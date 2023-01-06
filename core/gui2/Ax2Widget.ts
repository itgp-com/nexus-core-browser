import {Ix2State}        from "./Ix2State";
import {getRandomString} from "../BaseUtils";
import {IHtmlUtils}               from "./Ix2HtmlDecorator";
import {resolveMixedPromiseArray} from "../gui/WidgetUtils";
import {ko}                       from "./Wx2Utils";
import {BeforeInitLogicEvent}     from "../gui/BeforeInitLogicListener";
import {getErrorHandler}                              from "../CoreErrorHandling";
import {AfterInitLogicEvent}                          from "../gui/AfterInitLogicListener";
import {AxiosResponse}                                from "axios";
import {Err}                                          from "../Core";
import {ExceptionEvent}                               from "../ExceptionEvent";
import {WidgetErrorHandler, WidgetErrorHandlerStatus} from "../gui/WidgetErrorHandler";


export const WX2_HTML_PROPERTY = "_wx2_";


export abstract class Ax2Widget<
   STATE extends Ix2State = Ix2State,
   JSCOMPONENT = any
>{

   protected _state: STATE;
   protected _className: string;
   protected _htmlElement: HTMLElement;

   private _obj: JSCOMPONENT;
   /**
    * True if initLogic has been invoked already
    * @private
    */
   private _initialized: boolean = false;
   /**
    * initLogic still in process
    * @private
    */
   private _initLogicInProgress: boolean;

   private _parent: Ax2Widget;


   protected constructor(state: STATE) {
      this._constructor(state);
   } //  constructor


   /**
    * The constructor calls this method as soon as the class is created.
    * This is the absolute earliest time to initialize any fields in the object by extending/overriding this implementation
    */
   protected _constructor(state: STATE): void {
      state = state || {} as STATE;
      this._state = state;
      this._className = this.constructor.name; // the name of the class
      if (!state.tagId) this.tagId = getRandomString(this._className);
   }


   protected async _initialSetup(state: STATE) {
      if (!state) state = {} as STATE;
      this.state                             = state;
      let wx2Array: Ax2Widget<any>[] = await resolveMixedPromiseArray<Ax2Widget>(state.initialChildren);
      state.children                 = ko.observableArray<Ax2Widget>(wx2Array);
      this.localHtmlImplementation();
   }


   /**
    * Override this method that is called after initLogic is fired.
    *
    * Empty implementation by default
    * @param evt
    * @since 1.0.24
    */
   async afterInitLogic(evt: AfterInitLogicEvent<Ax2Widget>): Promise<void> {
      //empty implementation
   }


   abstract localHtmlImplementation(): HTMLElement;

   /**
    * This is the method that gives a component the chance to call any JavaScript and instantiate the widget.
    *
    * At this point all the HTML for the component has been created (from calls to {@link localContentBegin} and {@link localContentEnd}
    *
    * The method is called from {@link AbstractWidget}'s {@link initLogic} method, after all the children's {@link initLogic} methods have been called.
    * Therefore, all children JS objects are available at this point in time.
    *
    */
   abstract localLogicImplementation(): Promise<void> ;

   abstract localDestroyImplementation(): Promise<void>;

   abstract localRefreshImplementation(): Promise<void>;

   abstract localClearImplementation(): Promise<void>;


   async initLogic(): Promise<void> {
      if (this.initialized)
         return;

      this.initialized = true;
      let thisX        = this;

      try {
         this.initLogicInProgress = true;

         // ------------ Before Init Logic Listeners -----------------------
         let beforeEvt: BeforeInitLogicEvent<Ax2Widget> = {
            origin: thisX
         };

         try {
            await this.state.beforeInitLogic(beforeEvt)
         } catch (ex) {
            thisX.handleError(ex);
         }

         // if (this.beforeInitLogicListeners.countListeners() > 0) {
         //    this.beforeInitLogicListeners.fire({
         //                                          event:            beforeEvt,
         //                                          exceptionHandler: (event) => {
         //                                             thisX.handleError(event);
         //                                          }
         //                                       }
         //    );
         // }

         // run this component's logic BEFORE the children
         let done: boolean = false;

         if (this.state.initLogic) {
            done = await this.state.initLogic(this); // state widgetLogic second
         }

         if (!done) {
            await this.localLogicImplementation(); // widget localLogicImplementation third
         } // if

         if (this.state.initLogicLast) {
            await this.state.initLogicLast(this); // state afterWidgetLogic fourth
         }


         // assign fully instantiated instance to a variable
         if (this.state?.onInitialized) {
            try {
               await this.state.onInitialized(this);
            } catch (ex) {
               console.error(ex);
               getErrorHandler().displayExceptionToUser(ex)
            }
         }


         let children: Ax2Widget[] = this.state.children();
         if (children && children.length > 0) {
            await Promise.all(children.map(async (child) => {
               if (child)
                  return child.initLogic();
            }));
         } // if ( this.children)

         // ------------ onChildrenInitialized -----------------------
         try {
            await thisX.onChildrenInitialized()
         } catch (ex) {
            thisX.handleError(ex);
         }

         if (this.state?.onChildrenInitialized) {
            try {
               await this.state.onChildrenInitialized(this);
            } catch (ex) {
               console.error(ex);
               getErrorHandler().displayExceptionToUser(ex)
            }
         }


         // ------------ After Init Logic Listeners -----------------------
         let afterEvt: AfterInitLogicEvent = {
            origin: thisX
         };

         try {
            await this.afterInitLogic(afterEvt)
         } catch (ex) {
            thisX.handleError(ex);
         }

         // if (this.afterInitLogicListeners.countListeners() > 0) {
         //    this.afterInitLogicListeners.fire({
         //                                         event:            afterEvt,
         //                                         exceptionHandler: (event) => {
         //                                            thisX.handleError(event);
         //                                         }
         //                                      },
         //    );
         // } // if (this.afterInitLogicListeners.count() > 0)
      } finally {
         this.initLogicInProgress = false;
      }


   } // initLogic


   private _refreshInProgress: boolean;
   get refreshInProgress(): boolean {
      return this._refreshInProgress;
   }

   /**
    * Used by system to set the flag.
    * Developers, please do not use this method unless you REALLY, REALLY understand the effects.
    * @param value
    */
   set refreshInProgress(value: boolean) {
      this._refreshInProgress = value;
   }

   protected async _refresh() {
      if (this.initialized) {
         try {
            this.refreshInProgress = true;

            // let allowRefreshToContinue: boolean = true;
            // // if (this.state?.onBeforeRefresh) {
            // //
            // //    try {
            // //       allowRefreshToContinue = this.state.onBeforeRefresh({widget: this});
            // //    } catch (ex) {
            // //       console.log(ex);
            // //    }
            // //
            // // } // if (this._args_AbstractWidget?.onBeforeRefresh)
            //
            // if (!allowRefreshToContinue)
            //    return;


            let children: Ax2Widget[] = this.state.children();
            if (children) {
               for (const child of children) {
                  if (child)
                     await child.refresh();
               }
            } // if ( this.children)

            await this.localRefreshImplementation();

            // if (this.state?.onAfterRefresh) {
            //    try {
            //       this.state.onAfterRefresh({widget: this});
            //    } catch (ex) {
            //       console.log(ex);
            //    }
            // } // if (this._args_AbstractWidget?.onAfterRefresh)

         } finally {
            this.refreshInProgress = false;
         }
      } // if (this.initialized)
   } // refresh


   /**
    * Override this method that is called after children are initialized.
    *
    * Empty implementation by default
    * @since 3.0.2
    */
   async onChildrenInitialized(): Promise<void> {
      //empty implementation
   }

   async refresh(f ?: (VoidFunction | Promise<VoidFunction>)) {

      if (f) {
         let f2: VoidFunction = await f; // wait for the promise to resolve
         f2.call(this); // execute in context
      }

      if (this.state.repaintOnRefresh) {
         //TODO implement
         console.log("TODO implement refresh for repaintOnRefresh");
      } else {
         //Regular refresh
         await this._refresh();
      }
   } // refresh


   /**
    * Called to handle errors.
    * @param err
    * @return false if error not handled, true if handled
    */
   handleError(err: (AxiosResponse | Err | Error | ExceptionEvent | any)): WidgetErrorHandlerStatus {
      let status: WidgetErrorHandlerStatus;
      if (this.widgetErrorHandler) {
         status = this.widgetErrorHandler.handleWidgetError({err: err});
      }

      if (status && status.isErrorHandled) {
         return status; // we're done here
      }

      status = undefined;

      if (this.parent) {
         status = this.parent.handleError(err);
         if (status && status.isErrorHandled) {
            return status;
         }
      } // if this.parent

      // no parent so do the default error handling
      getErrorHandler().displayExceptionToUser(err);
      return {isErrorHandled: true};
   } // handleError


   get className(): string {
      return this._className;
   }

   set className(value: string) {
      this._className = value;
   }


   get htmlElement(): HTMLElement {
      if (!this._htmlElement) {
         this.localHtmlImplementation();
      }
      return this._htmlElement;
   }

   set htmlElement(value: HTMLElement) {
      if (this._htmlElement)
         this._htmlElement[WX2_HTML_PROPERTY] = null; // remove the reference to this object

      this._htmlElement = value;

      if (this._htmlElement)
         this._htmlElement[WX2_HTML_PROPERTY] = this; // tag this element with the widget
   }

   get initialized(): boolean {
      return this._initialized;
   }


   set initialized(value: boolean) {
      this._initialized = value;
   }


   get initLogicInProgress(): boolean {
      return this._initLogicInProgress;
   }

   /**
    * Used by system to set the flag.
    * Developers, please do not use this method unless you REALLY, REALLY understand the effects.
    * @param value
    */
   set initLogicInProgress(value: boolean) {
      this._initLogicInProgress = value;
   }

   /**
    * Get the JS instance underlying this AbstractWidget
    * Base method that is overwritten by typed method in AnyWidget
    */
   get obj(): JSCOMPONENT {
      return this._obj;
   }

   /**
    * Set the JS instance underlying this AbstractWidget
    * Base method that is overwritten by typed method in AnyWidget
    */
   set obj(value: JSCOMPONENT) {
      this._obj = value;
   }

   get parent(): Ax2Widget {
      return this._parent;
   }

   set parent(value: Ax2Widget) {
      try {
         this._parent = value;
         // if (this.parentAddedListeners.countListeners() > 0) {
         //    this.parentAddedListeners.fire({
         //                                      event: {
         //                                         child:  this,
         //                                         parent: value,
         //                                      }
         //                                   });
         // } // if
      } catch (ex) {
         this.handleError(ex);
      }
   }

   get state(): STATE {
      return this._state;
   } // state

   set state(state: STATE) {
      if (state) {
         state.decorator = IHtmlUtils.init(state.decorator); // the decorator must exist because there must be a tag type for the component HTML

         // Tag the new state with the widget
         if (state.widget && state.widget != this) {
            throw new Error(`The state instance is already set to widget ${state.widget.tagId} and is now trying to be assigned to ${this.tagId}!}`);
         }
         state.widget = this; // tag the state with the widget

      } else {
         // If being assigned a null state, then remove the reference to this widget from the previous state
         if (this.state) {
            this.state.widget = null; // remove the reference to this object
         }
      }// if state
      this._state = state;
   }


   get tagId(): string {
      return this.state.tagId;
   }

   set tagId(value: string) {
      this.state.tagId = value;
   }


   get widgetErrorHandler(): WidgetErrorHandler {
      return this._state.widgetErrorHandler;
   }

   set widgetErrorHandler(value: WidgetErrorHandler) {
      this.state.widgetErrorHandler = value;
   }

} // Ax2Widget