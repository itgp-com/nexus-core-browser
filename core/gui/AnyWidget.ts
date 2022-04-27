import {Component}                                                             from "@syncfusion/ej2-base";
import {getRandomString}                                                       from "../ej2/WidgetUtils";
import {AbstractWidget}                                                        from "./AbstractWidget";
import {Args_AnyWidget}                                                        from "./Args_AnyWidget";
import {BeforeInitLogicEvent, BeforeInitLogicListener}                         from "./BeforeInitLogicListener";
import {AfterInitLogicEvent, AfterInitLogicListener}                           from "./AfterInitLogicListener";
import {stringArgVal}                                                          from "../CoreUtils";
import {ListenerHandler}                                                       from "../ListenerHandler";
import {Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener} from "./Args_AnyWidget_Initialized_Listener";
import {getErrorHandler}                                                       from "../CoreErrorHandling";

/**
 * The generic root component of all the widgets.
 *
 * @author David Pociu - InsiTech
 * @since 0.1
 */
export abstract class AnyWidget<EJ2COMPONENT extends (Component<HTMLElement> | HTMLElement | any) = any, ARGS_ANY_WIDGET extends Args_AnyWidget = Args_AnyWidget, DATA_TYPE = any>
   extends AbstractWidget<DATA_TYPE> {

   private _name: string;
   private _obj: EJ2COMPONENT;
   // noinspection SpellCheckingInspection
   private _descriptor: ARGS_ANY_WIDGET;
   private _args_AnyWidgetInitializedListeners: ListenerHandler<Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener> = new ListenerHandler<Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener>();


   wrapperTagID: string;

   protected constructor() {
      super();
   }

   /**
    * Called either from the constructor if the descriptor is not null, or explicitly by the extending components once they
    * initialize the descriptor and widgetContainer based on their own constructor parameters (which might not extend the current descriptor).
    *
    * The extending classes may want to have a different descriptor that does not extend the one here so that only the relevant properties to the
    * respective component are available on initialization - reducing the possibility of error in using properties that
    * should not be available or used for that particular extending component.
    *
    * The separate initialization gives the extending component room to craft the parameters being passed to properly initialize this instance
    * without having to resort to some artificial function that operates on the parameters passed to super - as would be the case if the initialization
    * was done in the constructor.
    *
    * @param argsAnyWidget
    * @author David Pociu - InsiTech
    */
   initialize_AnyWidget(argsAnyWidget?: ARGS_ANY_WIDGET): void {
      let thisX = this;

      // If the descriptor does not exist, create a default one
      if (argsAnyWidget == null)
         argsAnyWidget = <ARGS_ANY_WIDGET>new Args_AnyWidget();

      Args_AnyWidget.initialize(argsAnyWidget, this);

      this.tagId       = getRandomString(argsAnyWidget.id);
      argsAnyWidget.id = this.tagId;
      this.name        = argsAnyWidget.colName;

      if ( argsAnyWidget.title != null)
         this.title = argsAnyWidget.title;

      // descriptor.initLogic() handled inside _initLogic()
      if (argsAnyWidget.children)
         this.children = argsAnyWidget.children;


      // initialize the tags so they available in initContentBegin/End
      thisX.wrapperTagID = `wrapper_${thisX.tagId}`;
      /** fire the listener for anyone interested  **/
      if (this.args_AnyWidgetInitializedListeners.countListeners() > 0) {
         this.args_AnyWidgetInitializedListeners.fire({
                                                         event: {
                                                            widget: thisX,
                                                            args:   argsAnyWidget
                                                         }
                                                      }
         );

      } // listeners


      if (argsAnyWidget.localContentBegin)
         this.contentBeginFromExtendingClass = stringArgVal(argsAnyWidget.localContentBegin);

      if (argsAnyWidget.localContentEnd)
         this.contentEndFromExtendingClass = stringArgVal(argsAnyWidget.localContentEnd);

      //----------------------- Listener Implementations ---------------------
      if (argsAnyWidget.beforeInitLogicListener) {
         this.beforeInitLogicListeners.addListener(new class extends BeforeInitLogicListener {
            beforeInitLogic(ev: BeforeInitLogicEvent): void {
               argsAnyWidget.beforeInitLogicListener(ev);
            }
         });
      }

      if (argsAnyWidget.afterInitLogicListener) {
         this.afterInitLogicListeners.addListener(new class extends AfterInitLogicListener {
            afterInitLogic(ev: AfterInitLogicEvent): void {
               argsAnyWidget.afterInitLogicListener(ev);
            }
         });
      }


      this.descriptor = argsAnyWidget;
   } // initAnyWidget


   async initLogic(): Promise<void> {
      if (!this.initialized) {
         await super.initLogic();


         // assign fully instantiated instance to a variable
         if (this.descriptor?.onInitialized) {
            try {
               this.descriptor.onInitialized(this);
            } catch (ex) {
               console.error(ex);
               getErrorHandler().displayExceptionToUser(ex)
            }
         }
      }
   } // initLogic

   /**
    * Implementation based on initContent present in descriptor and children
    */
   async localLogicImplementation() :Promise<void> {
      if (this.descriptor && this.descriptor.initLogic)
         this.descriptor.initLogic();
   } // _initLogic

   /**
    * Implementation based on initContent present in descriptor and children
    */
   async localClearImplementation() :Promise<void> {
      if (this.descriptor && this.descriptor.clear)
         this.descriptor.clear();
   } // _clear

   /**
    * Implementation based on initContent present in descriptor and children
    */
   async localRefreshImplementation() :Promise<void>{
      if (this.descriptor && this.descriptor.refresh)
         this.descriptor.refresh();
   } // _refresh


   /**
    * Implementation based on initContent present in descriptor and children
    */
   async localDestroyImplementation() :Promise<void>{

      if (this.descriptor && this.descriptor.destroy)
         this.descriptor.destroy();

      // just in case
      if (this.obj && !(this.obj as any).isDestroyed && (this.obj as any).destroy != null) {
         // Destroy this object itself
         try {
            await (this.obj as any).destroy();
         } catch (ex) {
            console.log(ex);
         }
      }

   } // _destroy


   //--------------- simple getters and setters ------------
   get name(): string {
      return this._name;
   }

   set name(value: string) {
      this._name = value;
   }

   get obj(): EJ2COMPONENT {
      return this._obj;
   }

   // noinspection JSUnusedGlobalSymbols
   set obj(value: EJ2COMPONENT) {
      this._obj = value;
   }

   get descriptor(): ARGS_ANY_WIDGET {
      return this._descriptor;
   }

   set descriptor(value: ARGS_ANY_WIDGET) {
      this._descriptor = value;
   }


   get args_AnyWidgetInitializedListeners(): ListenerHandler<Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener> {
      return this._args_AnyWidgetInitializedListeners;
   }

   set args_AnyWidgetInitializedListeners(value: ListenerHandler<Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener>) {
      this._args_AnyWidgetInitializedListeners = value;
   }
} // AnyWidget
