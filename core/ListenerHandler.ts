import { ExceptionEvent } from "./ExceptionEvent";
import { BaseListener } from "./BaseListener";

/**
 * Class to stop the listener chain.
 */
export class StopListenerChain {
   /** If true, stops the event processing. */
   stopEventProcessing?: boolean;
}

/**
 * Type guard for StopListenerChain.
 * @param arg - The object to check.
 * @returns True if the object is a StopListenerChain.
 */
export function isStopListenerChain(arg: any): arg is StopListenerChain {
   if (!arg) return false;
   let maybe = arg as StopListenerChain;
   return maybe.stopEventProcessing !== undefined;
}

/**
 * Arguments for firing a listener.
 */
export class Args_FireListener<E, Listener extends BaseListener<E>> {
   /** The event object. */
   event: E;
   /** Optional exception handler. */
   exceptionHandler?: { (event: ExceptionEvent): void };
}

/**
 * Handler for managing listeners.
 */
export class ListenerHandler<E, Listener extends BaseListener<E>> {
   /** Array of listeners with their priorities. */
   private listeners: { listener: Listener; priority: number }[] = [];
   /** Cross-reference array for function-based listeners. */
   private xref: [BaseListener<E>, (ev: E) => void][] = [];

   /**
    * Add a function-based listener.
    * @param f - The listener function.
    * @param priority - The priority of the listener. Default is 100.
    */
   add(f: (ev: E) => void, priority: number = 100) {
      let baseListener: BaseListener<E> = new class BaseListener {
         eventFired(ev: E): void {
            f(ev);
         }
      };
      this.xref.push([baseListener, f]);
      this.addListener(baseListener as Listener, priority);
   }

   /**
    * Add a listener object.
    * @param listener - The listener object.
    * @param priority - The priority of the listener. Default is 100.
    */
   addListener(listener: Listener, priority: number = 100): void {
      if (listener) {
         if (!this.listeners.some(item => item.listener === listener)) {
            this.listeners.push({ listener, priority });
            this.listeners.sort((a, b) => a.priority - b.priority);
         }
      }
   }

   /**
    * Remove a function-based listener.
    * @param f - The listener function to remove.
    */
   remove(f: (ev: E) => void) {
      this.xref = this.xref.filter(([baseListener, func]) => {
         if (func === f) {
            this.removeListener(baseListener as Listener);
            return false;
         }
         return true;
      });
   }

   /**
    * Remove a listener object.
    * @param listener - The listener object to remove.
    */
   removeListener(listener: Listener): void {
      if (listener) {
         this.listeners = this.listeners.filter(item => item.listener !== listener);
         this.xref = this.xref.filter(([baseListener]) => baseListener !== listener);
      }
   }

   /**
    * Clear all listeners.
    */
   clear(): void {
      this.listeners.length = 0;
      this.xref.length = 0;
   }

   /**
    * List all listeners.
    * @returns An array of all listener objects.
    */
   listListeners() {
      return this.listeners.map(item => item.listener);
   }

   /**
    * Count the number of listeners.
    * @returns The number of listeners.
    */
   countListeners(): number {
      return this.listeners.length;
   }

   /**
    * Fire an event to all listeners.
    * @param args - The arguments for firing the event.
    */
   fire(args: Args_FireListener<E, Listener>) {
      let event = args.event;
      let exceptionHandler: { (event: ExceptionEvent): void } = args.exceptionHandler;

      if (this.listeners) {
         for (const { listener } of this.listeners) {
            if (listener) {
               try {
                  listener.eventFired(event);

                  if (isStopListenerChain(event)) {
                     let stop: boolean = event.stopEventProcessing;
                     if (stop) {
                        break;
                     }
                  }
               } catch (ex) {
                  if (exceptionHandler) {
                     let ev: ExceptionEvent = {
                        event_id: 'ListenerHandler_fire',
                        originInstance: this,
                        exception: ex,
                        parametersAtExceptionTime: [listener, args],
                        description: "Exception occurred while calling ListenerHandler.fire with listener " + JSON.stringify(listener) + " with arguments " + JSON.stringify(args),
                     };
                     exceptionHandler(ev);
                  } else {
                     console.log(ex);
                  }
               } // if (exceptionHandler)
            } // if listener
         } // for
      } // if (this.listeners)
   } // fire
} // ListenerHandler