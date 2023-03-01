import {AxiosResponse} from "axios";
import {ResizeSensor} from "css-element-queries";
import {ResizeSensorCallback} from "css-element-queries/src/ResizeSensor";
import {throttle} from "lodash";
import {getRandomString} from "../BaseUtils";
import {Err} from "../Core";
import {getErrorHandler} from "../CoreErrorHandling";
import {ExceptionEvent} from "../ExceptionEvent";
import {WidgetErrorHandlerStatus} from "../gui/WidgetErrorHandler";
import {IHtmlUtils} from "./Ix2HtmlDecorator";
import {Ix2State} from "./Ix2State";


export let WX2_HTML_TAGGING_CLASS = '_wx2_';


export abstract class Ax2Widget<
    STATE extends Ix2State = any,
    JS_COMPONENT = any> {

    //---------------- abstract methods ----------------

    protected _resizeSensorCallback: ResizeSensorCallback = throttle((_size: { width: number; height: number; }) => {
            if (this && this.initialized) {
                this.onResized({
                    widget: this,
                    size: _size
                });
            } // if (thisX && thisX.obj && thisX.initialized )
        } // function body of debouncedFunction
        , (this.resizeEventMinInterval ? this.resizeEventMinInterval : 300));

    protected constructor(state: STATE) {
        this._constructor(state);
    } //  constructor

    private _state: STATE;

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

    //---------- end abstract methods -----------------

    private _className: string;

    get className(): string {
        return this._className;
    }

    set className(value: string) {
        this._className = value;
    }

    private _obj: JS_COMPONENT;

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

    private _resizeEventMinInterval: number = 200; // milliseconds

    get resizeEventMinInterval(): number {
        return this._resizeEventMinInterval;
    }

    set resizeEventMinInterval(value: number) {
        this._resizeEventMinInterval = value;
    }

    private _resizeSensor: ResizeSensor;

    get resizeSensor(): ResizeSensor {
        return this._resizeSensor;
    }

    set resizeSensor(value: ResizeSensor) {
        this._resizeSensor = value;
    }

    /**
     * True if initLogic has been invoked already
     * @private
     */
    private _initialized: boolean = false;

    get initialized(): boolean {
        return this._initialized;
    }

    set initialized(value: boolean) {
        this._initialized = value;
    }

    /**
     * initLogic still in process
     * @private
     */
    private _initLogicInProgress: boolean;

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

    private _parent: Ax2Widget;

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

    private _refreshInProgress: boolean;

    get refreshInProgress(): boolean {
        return this._refreshInProgress;
    }


    //--------- Getters and Setters ----------------

    /**
     * Used by system to set the flag.
     * Developers, please do not use this method unless you REALLY, REALLY understand the effects.
     * @param value
     */
    set refreshInProgress(value: boolean) {
        this._refreshInProgress = value;
    }

    get htmlElement(): HTMLElement {
        if (!this.state.gen.htmlElement)
            this.initHtml();

        return this.state.gen.htmlElement;
    }

    set htmlElement(value: HTMLElement) {
        let state = this.state;

        let oldElement = state.gen?.htmlElement;
        if (oldElement == value)
            return; // nothing to do

        if (oldElement) {
            oldElement.classList.remove(WX2_HTML_TAGGING_CLASS); // untag the element
            oldElement[WX2_HTML_TAGGING_CLASS] = null; // remove the reference to this object
            if (this.resizeSensor) {
                this.resizeSensor.detach();
            }
        }

        state.gen.htmlElement = value;

        if (value) {
            // tag this element with the widget
            value.classList.remove(WX2_HTML_TAGGING_CLASS); // just in case
            value.classList.add(WX2_HTML_TAGGING_CLASS); // tag the element
            value[WX2_HTML_TAGGING_CLASS] = this; // tag the element with the widget itself

            if (state.resizeTracked && oldElement && this.initialized) {
                // only if the widget has already been initialized (if it has not, then initLogic will apply it the first time
                this.applyResizeSensor();
            }
        }
    }

    abstract onClear(args: Ix2OnClear): void;

    abstract onDestroy(args: Ix2Destroy): void;

    abstract onHtml(args: Ix2OnHtml): HTMLElement;

    /**
     * This is the method that gives a component the chance to call any JavaScript and instantiate the widget.
     *
     * At this point all the HTML for the component has been created (from calls to {@link localContentBegin} and {@link localContentEnd} )
     *
     * The method is called from {@link AbstractWidget}'s {@link initLogic} method, after all the children's {@link initLogic} methods have been called.
     * Therefore, all children JS objects are available at this point in time.
     *
     */
    abstract onLogic(args: Ix2OnLogic): void ;

    abstract onRefresh(args ?: Ix2Refresh): void;

    initHtml(): void {
        if (this.state?.gen?.htmlElement) return;

        if (this.state.onHtml) {
            this.htmlElement = this.state.onHtml({widget: this});
        } else {
            this.htmlElement = this.onHtml({widget: this});
        }

    } // initHtml

    initLogic(): void {
        if (this.initialized)
            return;

        let args: Ix2BeforeLogic = {
            widget: this,
            cancel: false,
        };

        let state = this.state;

        try {
            if (state.beforeInitLogic) {
                state.beforeInitLogic(args);
                if (args.cancel) return;

            } else {
                if (this.beforeInitLogic) {
                    this.beforeInitLogic(args);
                    if (args.cancel) return;
                }
            }// if beforeLogic

        } catch (e) {
            this.handleError(e);
        }

        this.initialized = true;
        let thisX = this;

        try {
            this.initLogicInProgress = true;

            // run this component's logic BEFORE the children

            if (state.onLogic) {
                state.onLogic({widget: this}); // state widgetLogic second
            } else {
                this.onLogic({widget: this}); // widget localLogicImplementation third
            }

            try {
                if (state?.afterInitWidgetOnly) {
                        state.afterInitWidgetOnly({widget:this});
                }
            } catch (ex) {
                console.error(ex);
                getErrorHandler().displayExceptionToUser(ex)
            }

            let atLeastOneChildInitialized: boolean = false;
            let children: Ax2Widget[];
            if (state.children)
                children = state.children;
            if (children && children.length > 0) {
                children.map((child) => {
                    if (child && !child.initialized) {
                        atLeastOneChildInitialized = true;
                        return child.initLogic();
                    }
                });
            } // if ( this.children)

            // ------------ onChildrenInitialized -----------------------

            if (atLeastOneChildInitialized && state?.afterChildrenInit) {
                try {
                    state.afterChildrenInit();
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
                state.afterInitLogic({widget: this})
            } catch (ex) {
                thisX.handleError(ex);
            }
        } else {

            if (this.afterInitLogic) {
                // ------------ After Init Logic Listeners -----------------------
                let args: Ix2AfterLogic = {
                    widget: thisX
                };

                try {
                    this.afterInitLogic(args)
                } catch (ex) {
                    thisX.handleUIError(ex);
                }

            } // if this.afterInitLogic

        }
        if (state.resizeTracked) {
            thisX.applyResizeSensor();
        } // if (this.resizeTracked)

    } // initLogic

    clear(): void {
        // there is no default implementation for this method.
        if (this.state.onClear) {
            this.state.onClear({widget: this});
        } else {
            this.onClear({widget: this});
        }
    }

    destroy(): void {
        try {
            if (this.state.onDestroy) {
                this.state.onDestroy({widget: this});
            } else {
                this.onDestroy({widget: this});
            }
            if (this.htmlElement) {
                //remove the element from the DOM and also remove all of its event listeners and JavaScript properties, effectively destroying it.
                this.htmlElement.remove();
            }
        } catch (ex) {
            this.handleError(ex);
        }
    } // destroy

    /**
     *  Called after initLogic has been completed for this component but NOT for any child components
     *  Use the <link>onChildrenInstantiated</link> event if you need all child components to also have been initialized
     */
    afterInitWidgetOnly?: (args: Ix2AfterLogic) => void;

    /**
     * Called after the widget AND any children's logic have been initialized
     */
    afterInitLogic(args: Ix2AfterLogic): void {
    }

    /**
     * If this is specified, the widget's method (if any) will not be called.
     * Should you need to call the corresponding widget method, you can call it manually from this method
     * by using the widget instance in the parameter
     */
    beforeInitLogic(args: Ix2BeforeLogic): void {
    }

    refresh(args ?: Ix2Refresh) {
        if (this.initialized) {
            try {
                this.refreshInProgress = true;

                let state = this.state;


                args = args || {widget: this};
                args.currentLevelOnly = args.currentLevelOnly || false;
                args.resetUIOnRefresh = args.resetUIOnRefresh || false;
                args.gen = args.gen || {};
                args.extras = args.extras || {};

                let gen = args.gen;
                gen.topParent = gen.topParent || this; // if empty, then this is the top parent
                gen.widget = this;

                if (!args.currentLevelOnly) {
                    let children: Ax2Widget[];
                    if (state.children)
                        children = state.children;
                    if (children) {
                        for (const child of children) {

                            try {
                                let childArgs: Ix2Refresh = {
                                    widget: child,
                                    currentLevelOnly: false,
                                    resetUIOnRefresh: args.resetUIOnRefresh,
                                    gen: {
                                        topParent: gen.topParent,
                                        widget: child,
                                        parent: this,
                                        isAlgoCreated: true,
                                        parentArgument: args,
                                    },
                                }; // childArgs

                                if (child)
                                    child.refresh(childArgs); // this would trigger a reset in the child if state.resetUIOnRefresh does not override it
                            } catch (e) {
                                this.handleUIError(e);
                            }

                        }
                    } // if ( this.children)

                } // if (!refreshParam.currentLevelOnly)

                // noinspection JSUnusedAssignment
                let resetUIOnRefresh: boolean = false;
                if (state.resetUIOnRefresh !== undefined && state.resetUIOnRefresh !== null) {
                    resetUIOnRefresh = state.resetUIOnRefresh;   // functionality on state ALWAYS trumps functionality on widget (state functionality can call widget functionality inside its implementation if need be)
                } else {
                    resetUIOnRefresh = args.resetUIOnRefresh;
                }


                if (resetUIOnRefresh) {

                    try {
                        this.reset({
                            widget: this,
                            extras: args.extras,
                            gen: {
                                topParent: gen.topParent,
                                widget: this,
                                parent: args.gen.widget,
                                parentArgument: null, // no parent argument
                            }
                        });
                    } catch (e) {
                        this.handleError(e);
                    }
                } // if regenerateUI


                try {
                    if (state.onRefresh) {
                        state.onRefresh(args); // functionality on state ALWAYS trumps functionality on widget (state functionality can call widget functionality inside its implementation if need be)
                    } else {
                        if (this.onRefresh)
                            this.onRefresh(args);
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

    reset(args ?: Ix2Destroy): void {
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

        args = args || {widget: this}
        // args.currentLevelOnly = args.currentLevelOnly || false;
        args.gen = args.gen || {};
        args.extras = args.extras || {};

        let gen = args.gen;
        gen.topParent = gen.topParent || this; // if empty, then this is the top parent
        gen.widget = this;


        let oldHtmlElement = this.htmlElement;
        this.htmlElement = null;
        this.initialized = false; // to allow initLogic to work properly
        let newHtmlElement = this.htmlElement;
        this.initLogic();
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
     * @return false if further processing should stop, true if it can continue. Defaults to true.
     */
    handleError(err: (AxiosResponse | Err | Error | ExceptionEvent | any)): boolean {
        console.error(err);
        return true;
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
        state = state || {} as STATE;
        state.gen = state.gen || {};

        state.deco = state.deco || {} as IHtmlUtils;
        IHtmlUtils.init(state.deco);

        state.gen.widget = this;
        this.state = state;
        this.className = this.constructor.name; // the name of the class
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
     *       protected _initialSetup(state: StateWx2TextField) {
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


export interface Ix2Base<WIDGET extends Ax2Widget = Ax2Widget> {
    /**
     * The widget that the refresh was triggered on. Autofilled by the refresh method.
     */
    widget: WIDGET;
}

export interface Ix2OnHtml<WIDGET extends Ax2Widget = Ax2Widget> extends Ix2Base<WIDGET> {
}

export interface Ix2OnLogic<WIDGET extends Ax2Widget = Ax2Widget> extends Ix2Base<WIDGET> {
}

export interface Ix2OnClear<WIDGET extends Ax2Widget = Ax2Widget> extends Ix2Base<WIDGET> {
}

export interface Ix2Refresh<WIDGET extends Ax2Widget = Ax2Widget> extends Ix2Base<WIDGET> {

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

export interface Ix2Destroy<WIDGET extends Ax2Widget = Ax2Widget> extends Ix2Base<WIDGET> {

    /**
     * Allows user to add either data or functions to be passed down the refresh chain.
     */
    extras?: any;

    /**
     * Properties that are filled in by the refresh method
     */
    gen?: Ix2Gen<Ix2Destroy, WIDGET>;

}

export interface Ix2BeforeLogic<WIDGET extends Ax2Widget = Ax2Widget> extends Ix2Base<WIDGET> {

    /**
     * If developer sets to true, the initLogic will not be called.
     */
    cancel: boolean;
}

export interface Ix2AfterLogic extends Ix2Base {
}

export interface Ix2Resized extends Ix2Base {
    size?: { width: number; height: number; }
}