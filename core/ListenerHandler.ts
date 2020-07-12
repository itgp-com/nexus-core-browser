import {ExceptionEvent} from "./ExceptionEvent";
import {BaseListener}   from "./BaseListener";

export class StopListenerChain {
   stopEventProcessing ?: boolean;
}

export function isStopListenerChain(arg: any): arg is StopListenerChain {
   if (!arg)
      return false;
   let maybe = (arg as StopListenerChain);
   return (maybe.stopEventProcessing != undefined);
}

export class Args_FireListener<E, Listener extends BaseListener<E>> {
   event: E;
   /**
    * If this listener extends {@link StopListenerChain} and turns the {@link StopListenerChain.stopEventProcessing} value to true
    * then the listener event calling is stopped immediately.
    */
   exceptionHandler?: { (event: ExceptionEvent): void }
}


export class ListenerHandler<E, Listener extends BaseListener<E>> {
   private listeners: Listener[] = [];


   add(listener: Listener): void {
      if (listener) {
         let n: number = this.listeners.length;
         for (let i = 0; i < n; i++) {
            let l = this.listeners[i];
            if (l === listener)
               return; // this listener already exists
         } // for
         this.listeners.push(listener);
      } // if listener
   } // addListener

   remove(listener: Listener): void {
      if (listener) {

         let n: number = this.listeners.length;
         for (let i = 0; i < n; i++) {
            let l = this.listeners[i];
            if (l === listener) {
               this.listeners = this.listeners.splice(i);
               return; // done, since a listener is in there only once
            }
         } // for
      } // if listener
   } // remove

   /**
    * Remove all the listeners
    */
   clear(): void{
      this.listeners.length = 0;
   }

   /**
    * Returns a copy of the listener list. Modifying this list has no effect on the listeners in the handler.
    * To add and remove listeners you have to use the add and remove methods of the handler instance.
    */
   list() {
      let newList: Listener[] = [...this.listeners];
      return newList;
   }

   count(): number {
      return this.listeners.length;
   }

   //fire(event:E, exceptionHandler?:{(event: ExceptionEvent): void} ) {
   fire(args: Args_FireListener<E, Listener>) {
      let event                                               = args.event;
      let exceptionHandler: { (event: ExceptionEvent): void } = args.exceptionHandler;

      if (this.listeners) {
         let n: number = this.listeners.length;
         for (let i = 0; i < n; i++) {
            let l = this.listeners[i];
            if (l) {
               try {
                  l.eventFired(event);

                  if (isStopListenerChain(event)) {
                     let stop: boolean = (<StopListenerChain>event).stopEventProcessing;
                     if (stop) {
                        break; // get out of for loop
                     }
                  }

               } catch (ex) {
                  if (exceptionHandler) {
                     let ev: ExceptionEvent = {
                        event_id:                  'ListenerHandler_fire',
                        originInstance:            this,
                        exception:                 ex,
                        parametersAtExceptionTime: [l, args],
                        description:               "Exception occurred why calling ListenerHandler.fire with listener " + JSON.stringify(l) + " with arguments " + JSON.stringify(args),
                     }; // ev
                     exceptionHandler(ev);
                  } else {
                     // silent, but at least show a trace that an exception occurred
                     console.log(ex);
                  } // if (exceptionHandler)
               } // catch

            } // if l
         } // for
      } // if this.listeners
   } // fireEvent

} // main class