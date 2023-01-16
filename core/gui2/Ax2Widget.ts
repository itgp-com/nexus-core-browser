import {AxiosResponse}            from "axios";
import {ResizeSensor}             from "css-element-queries";
import {ResizeSensorCallback}     from "css-element-queries/src/ResizeSensor";
import {throttle}                 from "lodash";
import {getRandomString}          from "../BaseUtils";
import {Err}                      from "../Core";
import {getErrorHandler}          from "../CoreErrorHandling";
import {ExceptionEvent}           from "../ExceptionEvent";
import {WidgetErrorHandlerStatus} from "../gui/WidgetErrorHandler";
import {IHtmlUtils}               from "./Ix2HtmlDecorator";
import {Ix2State}                 from "./Ix2State";


export const WX2_HTML_PROPERTY = "_wx2_";


export abstract class Ax2Widget<
   STATE extends Ix2State = any,
   JS_COMPONENT = any> {

   protected _resizeSensorCallback: ResizeSensorCallback = throttle((_size: { width: number; height: number; }) => {
                                                                       if (this && this.initialized) {
                                                                          this.onResized({
                                                                                            size: _size
                                                                                         });
                                                                       } // if (thisX && thisX.obj && thisX.initialized )
                                                                    } // function body of debouncedFunction
      , (this.resizeEventMinInterval ? this.resizeEventMinInterval : 300));
   private _state: STATE;
   private _className: string;
   private _obj: JS_COMPONENT;
   private _resizeEventMinInterval: number = 200; // milliseconds
   private _resizeSensor: ResizeSensor;
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

   get htmlElement(): HTMLElement {
      if (!this.state.gen.htmlElement)
         this.initHtml();

      return this.state.gen.htmlElement;
   }

   set htmlElement(value: HTMLElement) {
      let state = this.state;


      let oldElement = state.gen.htmlElement;

      if (oldElement) {
         oldElement[WX2_HTML_PROPERTY] = null; // remove the reference to this object
         if (this.resizeSensor) {
            this.resizeSensor.detach();
         }
      }

      state.gen.htmlElement = value;

      if (value) {
         value[WX2_HTML_PROPERTY] = this; // tag this element with the widget
         if (state.resizeTracked && oldElement && this.initialized) {
            // only if the widget has already been initialized (if it has not, then initLogic will apply it the first time
            this.applyResizeSensor();
         }
      }
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
         this.handleUIError(ex);
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
            throw new Error(`The state instance is already set to widget ${state.gen.widget.state.tagId} and is now trying to be assigned to ${state.tagId}!}`);
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


   //--------- Getters and Setters ----------------


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

   get resizeEventMinInterval(): number {
      return this._resizeEventMinInterval;
   }

   set resizeEventMinInterval(value: number) {
      this._resizeEventMinInterval = value;
   }

   get resizeSensor(): ResizeSensor {
      return this._resizeSensor;
   }

   set resizeSensor(value: ResizeSensor) {
      this._resizeSensor = value;
   }

   initHtml(): void {
      if (this.state?.gen?.htmlElement) return;

      if (this.state.onHtml) {
         this.htmlElement = this.state.onHtml();
      } else {
         this.htmlElement = this.onHtml();
      }
   } // initHtml

   async initLogic(): Promise<void> {
      if (this.initialized)
         return;

      let state = this.state;

      if (state.beforeInitLogic) {

         try {
            let args: Ix2BeforeLogic = {
               cancel: false,
            };
            await state.beforeInitLogic(args);
            if (args.cancel) return;
         } catch (e) {
            this.handleError(e);
         }
      } // if beforeLogic


      this.initialized = true;
      let thisX        = this;

      try {
         this.initLogicInProgress = true;

         // run this component's logic BEFORE the children

         if (state.onLogic) {
            await state.onLogic(); // state widgetLogic second
         } else {
            await this.onLogic(); // widget localLogicImplementation third
         }

         // assign fully instantiated instance to a variable
         if (state?.afterInit) {
            try {
               await state.afterInit(this);
            } catch (ex) {
               console.error(ex);
               getErrorHandler().displayExceptionToUser(ex)
            }
         }


         let atLeastOneChildInitialized: boolean = false;
         let children: Ax2Widget[];
         if (state.children)
            children = state.children;
         if (children && children.length > 0) {
            await Promise.all(children.map(async (child) => {
               if (child && !child.initialized) {
                  atLeastOneChildInitialized = true;
                  return child.initLogic();
               }
            }));
         } // if ( this.children)

         // ------------ onChildrenInitialized -----------------------

         if (atLeastOneChildInitialized && state?.afterChildrenInit) {
            try {
               await state.afterChildrenInit();
            } catch (ex) {
               console.error(ex);
               getErrorHandler().displayExceptionToUser(ex)
            }
         } // atLeastOneChildInitialized

      } finally {
         this.initLogicInProgress = false;
      }


      if (state.afterInitLogic) {
         // ------------ After Init Logic Listeners -----------------------
         try {
            await state.afterInitLogic()
         } catch (ex) {
            thisX.handleError(ex);
         }
      } // if this.afterInitLogic


      if (this.afterInitLogic) {
         // ------------ After Init Logic Listeners -----------------------
         let args: Ix2AfterLogic = {
            widget: thisX
         };

         try {
            await this.afterInitLogic(args)
         } catch (ex) {
            thisX.handleUIError(ex);
         }

      } // if this.afterInitLogic


      if (state.resizeTracked) {
         thisX.applyResizeSensor();
      } // if (this.resizeTracked)

   } // initLogic

   /**
    * Override this method that is called after initLogic is fired.
    *
    * Empty implementation by default
    * @param args
    */
   async afterInitLogic(args: Ix2AfterLogic): Promise<void> {
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

   async refresh(args ?: Ix2Refresh) {
      if (this.initialized) {
         try {
            this.refreshInProgress = true;

            let state = this.state;


            args                  = args || {};
            args.currentLevelOnly = args.currentLevelOnly || false;
            args.resetUIOnRefresh = args.resetUIOnRefresh || false;
            args.gen              = args.gen || {};
            args.extras           = args.extras || {};

            let gen       = args.gen;
            gen.topParent = gen.topParent || this; // if empty, then this is the top parent
            gen.widget    = this;

            // let allowRefreshToContinue: boolean = true;
            // // if (state?.onBeforeRefresh) {
            // //
            // //    try {
            // //       allowRefreshToContinue = state.onBeforeRefresh({widget: this});
            // //    } catch (ex) {
            // //       console.log(ex);
            // //    }
            // //
            // // } // if (this._args_AbstractWidget?.onBeforeRefresh)
            //
            // if (!allowRefreshToContinue)
            //    return;


            if (!args.currentLevelOnly) {
               let children: Ax2Widget[];
               if (state.children)
                  children = state.children;
               if (children) {
                  for (const child of children) {

                     try {
                        let childArgs: Ix2Refresh = {
                           currentLevelOnly: false,
                           resetUIOnRefresh: args.resetUIOnRefresh,
                           gen:              {
                              topParent:      gen.topParent,
                              widget:         child,
                              parent:         this,
                              isAlgoCreated:  true,
                              parentArgument: args,
                           },
                        }; // childArgs

                        if (child)
                           await child.refresh(childArgs); // this would trigger a reset in the child if state.resetUIOnRefresh does not override it
                     } catch (e) {
                        this.handleUIError(e);
                     }

                  }
               } // if ( this.children)

            } // if (!refreshParam.currentLevelOnly)

            // noinspection JSUnusedAssignment
            let resetUIOnRefresh: boolean =false;
            if (state.resetUIOnRefresh !== undefined && state.resetUIOnRefresh !== null) {
               resetUIOnRefresh = state.resetUIOnRefresh;   // functionality on state ALWAYS trumps functionality on widget (state functionality can call widget functionality inside its implementation if need be)
            } else {
               resetUIOnRefresh = args.resetUIOnRefresh;
            }


            if (resetUIOnRefresh) {

               try {
                  await this.reset({
                                      extras: args.extras,
                                      gen:    {
                                         topParent:      gen.topParent,
                                         widget:         this,
                                         parent:         args.gen.widget,
                                         parentArgument: null, // no parent argument
                                      }
                                   });
               } catch (e) {
                  this.handleError(e);
               }
            } // if regenerateUI


            try {
               if (state.onRefresh) {
                  await state.onRefresh(); // functionality on state ALWAYS trumps functionality on widget (state functionality can call widget functionality inside its implementation if need be)
               } else {
                  if (this.onRefresh)
                     await this.onRefresh();
               }
            } catch (e) {
               this.handleError(e);
            }

            // if (state?.onAfterRefresh) {
            //    try {
            //       state.onAfterRefresh({widget: this});
            //    } catch (ex) {
            //       console.log(ex);
            //    }
            // } // if (this._args_AbstractWidget?.onAfterRefresh)

         } catch (err) {
            this.handleError(err);
         } finally {
            this.refreshInProgress = false;
         }
      } // if (this.initialized)

   } // refresh

   async reset(args ?: Ix2Destroy): Promise<void> {
      /*
       Resets the htmlElement and calls initLogic on this widget only.

       This method is called from inside the refresh method, when the resetUIOnRefresh flag is set to true.

       As such, and because the children are processed first in a refresh, by the time the reset happens here
       the children have already been reset.
       */
      let state = this.state;

      if (state.staticWidget) {
         return;
      }

      args        = args || {};
      // args.currentLevelOnly = args.currentLevelOnly || false;
      args.gen    = args.gen || {};
      args.extras = args.extras || {};

      let gen       = args.gen;
      gen.topParent = gen.topParent || this; // if empty, then this is the top parent
      gen.widget    = this;


      let oldHtmlElement = this.htmlElement;
      this.htmlElement   = null;
      this.initialized   = false; // to allow initLogic to work properly
      let newHtmlElement = this.htmlElement;
      await this.initLogic();
      oldHtmlElement.replaceWith(newHtmlElement);


   } // reset

   /**
    * Called to handle errors for the visual widget.
    * @param err
    * @return false if error not handled, true if handled
    */
   handleUIError(err: (AxiosResponse | Err | Error | ExceptionEvent | any)): WidgetErrorHandlerStatus {
      try {
         let status: WidgetErrorHandlerStatus;
         if (this.state.widgetErrorHandler) {
            status = this.state.widgetErrorHandler.handleWidgetError({err: err});
         }

         if (status && status.isErrorHandled) {
            return status; // we're done here
         }

         status = undefined;

         if (this.parent) {
            status = this.parent.handleUIError(err);
            if (status && status.isErrorHandled) {
               return status;
            }
         } // if this.parent

         // no parent so do the default error handling
         getErrorHandler().displayExceptionToUser(err);
      } catch (e) {
         this.handleError(e);
      }
      return {isErrorHandled: true};
   } // handleError

   /**
    * Handle errors that should not be handled in the UI.
    * Defaults to <code>console.error(err)</code>
    * @param err
    */
   handleError(err: (AxiosResponse | Err | Error | ExceptionEvent | any)): void {
      console.error(err);
   }

   /**
    *
    * @param evt
    */
   onResized(evt?: Ix2Resized): void {
   }

   protected applyResizeSensor(): void {

      try {
         if (this.resizeSensor)
            this.resizeSensor.detach();
      } catch (e) {
         this.handleError(e);
      }

      this.resizeSensor = null;
      this.resizeSensor = new ResizeSensor(this.htmlElement, this._resizeSensorCallback);
   } // createResizeSensor

   /**
    * The constructor calls this method as soon as the class is created.
    * This is the absolute earliest time to initialize any fields in the object by extending/overriding this implementation
    * Initializes the state object to defaults if properties are null, sets the tagId if necessary and sets the class name for the widget and
    */
   protected _constructor(state: STATE): void {
      state     = state || {} as STATE;
      state.gen = state.gen || {};

      state.deco = state.deco || {} as IHtmlUtils;
      IHtmlUtils.init(state.deco);

      state.gen.widget = this;
      this.state       = state;
      this.className   = this.constructor.name; // the name of the class
      if (!state.tagId) state.tagId = getRandomString(this._className);

      try {
         this._initialSetup(state);
      } catch (e) {
         this.handleError(e);
      }
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
} // Ax2Widget

export interface Ix2Refresh<WIDGET extends Ax2Widget = Ax2Widget> {

   /**
    * True if only the current level should be refreshed (not the children)
    * False if the entire tree should be refreshed
    */
   currentLevelOnly?: boolean;

   /**
    * True if both the HTML and the logic should be regenerated (as if the widget was just created.). The HTMLElement will then replace the existing one.
    * False if and internal (JS or HTML) component refresh is sufficient.
    */
   resetUIOnRefresh?: boolean;

   /**
    * Allows user to add either data or functions to be passed down the refresh chain.
    */
   extras?: any;

   /**
    * Properties that are filled in by the refresh method
    */
   gen?: Ix2Gen<Ix2Refresh, WIDGET>;

}

export interface Ix2Gen<EVENT_TYPE, WIDGET extends Ax2Widget> {

   /**
    * The widget that the refresh was triggered on. Autofilled by the refresh method.
    */
   widget?: WIDGET;

   /**
    * The immediate parent widget that the refresh was triggered on
    * Null if the refresh is triggered at this level
    */
   parent?: Ax2Widget;


   /**
    * The top level widget that the refresh was triggered on
    * Null if the refresh is triggered at this level
    *
    */
   topParent?: Ax2Widget;

   /**
    * True if this parameter is created by the algorithm while refreshing the children.
    * False if called specifically by the user.
    */
   isAlgoCreated?: boolean;

   /**
    * The argument for the parent above this child (or null if this is the top level)
    */
   parentArgument?: EVENT_TYPE;
} // Ix2RefreshGen

export interface Ix2Destroy<WIDGET extends Ax2Widget = Ax2Widget> {

   /**
    * Allows user to add either data or functions to be passed down the refresh chain.
    */
   extras?: any;

   /**
    * Properties that are filled in by the refresh method
    */
   gen?: Ix2Gen<Ix2Destroy, WIDGET>;

}

export interface Ix2BeforeLogic {

   /**
    * If developer sets to true, the initLogic will not be called.
    */
   cancel: boolean;
}

export interface Ix2AfterLogic {
}

export interface Ix2Resized {
   size?: { width: number; height: number; }
}