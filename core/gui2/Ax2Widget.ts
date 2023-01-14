import {AxiosResponse}       from "axios";
import {getRandomString, ko} from "../BaseUtils";
import {Err}                 from "../Core";
import {getErrorHandler}                              from "../CoreErrorHandling";
import {ExceptionEvent}                               from "../ExceptionEvent";
import {AfterInitLogicEvent}                          from "../gui/AfterInitLogicListener";
import {BeforeInitLogicEvent}                         from "../gui/BeforeInitLogicListener";
import {WidgetErrorHandler, WidgetErrorHandlerStatus} from "../gui/WidgetErrorHandler";
import {resolveMixedPromiseArray}                     from "../gui/WidgetUtils";
import {IHtmlUtils}                                   from "./Ix2HtmlDecorator";
import {Ix2State}                                     from "./Ix2State";


export const WX2_HTML_PROPERTY = "_wx2_";


export abstract class Ax2Widget<
   STATE extends Ix2State = any,
   JS_COMPONENT = any
> {

   protected _state: STATE;
   protected _className: string;

   private _obj: JS_COMPONENT;
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
   private _refreshInProgress: boolean;

   protected constructor(state: STATE) {
      this._constructor(state);
   } //  constructor

   /**
    * The constructor calls this method as soon as the class is created.
    * This is the absolute earliest time to initialize any fields in the object by extending/overriding this implementation
    * Initializes the state object to defaults if properties are null, sets the tagId if necessary and sets the class name for the widget and
    */
   protected _constructor(state: STATE): void {
      state           = state || {} as STATE;
      state.gen        = state.gen || {};

      state.deco       = state.deco || {} as IHtmlUtils;
      IHtmlUtils.init(state.deco);

      state.gen.widget = this;
      this._state     = state;
      this._className = this.constructor.name; // the name of the class
      if (!state.tagId) this.tagId = getRandomString(this._className);

      this._initialSetup(state);
   }

   /**
    * This method assumes that the state is completely initialized and ready to be used.
    *
    * Useful when overriding in order to customize the state object before calling super.
    *
    * Overriding code example:
    * <pre>
    *       protected async _initialSetup(state: StateWx2TextField) {
    *       this._customizeState(state);
    *       super._initialSetup(state);
    *    }
    *</pre>
    *
    * where _customizeState is a method that customizes the state object onHTML, onRefresh, etc.
    *
    * @param state
    * @protected
    */
   protected _initialSetup(state: STATE) {
   }

   initHtml(): void {
      if (this.state?.gen?.htmlElement) return;

      if ( this.state.onHtml) {
         this.htmlElement = this.state.onHtml();
      } else {
         this.htmlElement = this.onHtml();
      }
   } // initHtml

   async initLogic(): Promise<void> {
      if (this.initialized)
         return;

      this.initialized = true;
      let thisX        = this;

      try {
         this.initLogicInProgress = true;

         if (this.state.beforeInitLogic) {
            // ------------ Before Init Logic Listeners -----------------------
            let beforeEvt: BeforeInitLogicEvent<Ax2Widget> = {
               origin: thisX
            };

            try {
               await this.state.beforeInitLogic(beforeEvt)
            } catch (ex) {
               thisX.handleError(ex);
            }
         } // if this.state.beforeInitLogic


         // run this component's logic BEFORE the children

         if (this.state.onLogic) {
            await this.state.onLogic(); // state widgetLogic second
         } else {
            await this.onLogic(); // widget localLogicImplementation third
         }

         // assign fully instantiated instance to a variable
         if (this.state?.onInit) {
            try {
               await this.state.onInit(this);
            } catch (ex) {
               console.error(ex);
               getErrorHandler().displayExceptionToUser(ex)
            }
         }


         let children: Ax2Widget[];
         if ( this.state.children)
            children = this.state.children();
         if (children && children.length > 0) {
            await Promise.all(children.map(async (child) => {
               if (child)
                  return child.initLogic();
            }));
         } // if ( this.children)

         // ------------ onChildrenInitialized -----------------------

         if (this.state?.onChildrenInitialized) {
            try {
               await this.state.onChildrenInitialized(this);
            } catch (ex) {
               console.error(ex);
               getErrorHandler().displayExceptionToUser(ex)
            }
         }

         if (this.state.afterInitLogic) {
            // ------------ After Init Logic Listeners -----------------------
            let afterEvt: AfterInitLogicEvent = {
               origin: thisX
            };

            try {
               await this.state.afterInitLogic(afterEvt)
            } catch (ex) {
               thisX.handleError(ex);
            }

         } // if this.afterInitLogic


         if (this.afterInitLogic) {
            // ------------ After Init Logic Listeners -----------------------
            let afterEvt: AfterInitLogicEvent = {
               origin: thisX
            };

            try {
               await this.afterInitLogic(afterEvt)
            } catch (ex) {
               thisX.handleError(ex);
            }

         } // if this.afterInitLogic

      } finally {
         this.initLogicInProgress = false;
      }


   } // initLogic

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

   abstract onClear(): Promise<void>;

   abstract onDestroy(): Promise<void>;

   abstract onHtml(): HTMLElement;

   /**
    * This is the method that gives a component the chance to call any JavaScript and instantiate the widget.
    *
    * At this point all the HTML for the component has been created (from calls to {@link localContentBegin} and {@link localContentEnd} )
    *
    * The method is called from {@link AbstractWidget}'s {@link initLogic} method, after all the children's {@link initLogic} methods have been called.
    * Therefore, all children JS objects are available at this point in time.
    *
    */
   abstract onLogic(): Promise<void>;

   abstract onRefresh(): Promise<void>;


   async refresh(f ?: (VoidFunction | Promise<VoidFunction>)) {

      if (f) {
         let f2: VoidFunction = await f; // wait for the promise to resolve
         f2.call(this); // execute in context
      }

      if ( this.state.onRefresh) {
         await this.state.onRefresh();
      } else {
         await this.onRefresh();
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

            await this.onRefresh();

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


   //--------- Getters and Setters ----------------


   get htmlElement(): HTMLElement {
      if (!this.state.gen.htmlElement)
         this.initHtml();

      return this.state.gen.htmlElement;
   }

   set htmlElement(value: HTMLElement) {
      if (this.state.gen.htmlElement)
         this.state.gen.htmlElement[WX2_HTML_PROPERTY] = null; // remove the reference to this object

      this.state.gen.htmlElement = value;

      if (this.state.gen.htmlElement)
         this.state.gen.htmlElement[WX2_HTML_PROPERTY] = this; // tag this element with the widget
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
   get obj(): JS_COMPONENT {
      return this._obj;
   }

   /**
    * Set the JS instance underlying this AbstractWidget
    * Base method that is overwritten by typed method in AnyWidget
    */
   set obj(value: JS_COMPONENT) {
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
         state.deco = IHtmlUtils.init(state.deco); // the decorator must exist because there must be a tag type for the component HTML

         // Tag the new state with the widget
         if (state.gen.widget && state.gen.widget != this) {
            throw new Error(`The state instance is already set to widget ${state.gen.widget.tagId} and is now trying to be assigned to ${this.tagId}!}`);
         }
         state.gen.widget = this; // tag the state with the widget

      } else {
         // If being assigned a null state, then remove the reference to this widget from the previous state
         if (this.state) {
            this.state.gen.widget = null; // remove the reference to this object
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

   get className(): string {
      return this._className;
   }

   set className(value: string) {
      this._className = value;
   }
} // Ax2Widget