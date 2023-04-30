import {DialogUtility} from '@syncfusion/ej2-popups';
import {AxiosResponse} from "axios";
import {ResizeSensor} from "css-element-queries";
import {ResizeSensorCallback} from "css-element-queries/src/ResizeSensor";
import {debounce, throttle} from "lodash";
import {getRandomString} from "../BaseUtils";
import {Err} from "../Core";
import {getErrorHandler} from "../CoreErrorHandling";
import {isDev} from '../CoreUtils';
import {ExceptionEvent} from "../ExceptionEvent";
import {WidgetErrorHandlerStatus} from "../gui/WidgetErrorHandler";
import {addNx2Child, removeNx2Child} from './ej2/Ej2Utils';
import {addNx2Class, IHtmlUtils} from "./Nx2HtmlDecorator";
import {Elem_or_Nx2, getFirstHTMLElementChild, isNx2} from './Nx2Utils';
import {StateNx2} from "./StateNx2";


export let NX2_CLASS = '_nx2_';


export abstract class Nx2<STATE extends StateNx2 = any, JS_COMPONENT = any> {
    protected constructor(state ?: STATE) {
        this._constructor(state);
        addNx2Class(this.state.deco, 'Nx2'); // this might not be the same as the actual _nx2_ HTMLElement
    } //  constructor

    /**
     * The constructor calls this method as soon as the class is created.
     * This is the absolute earliest time to initialize any fields in the object by extending/overriding this implementation
     * Initializes the state object to defaults if properties are null, sets the tagId if necessary and sets the class name for the widget and
     */
    protected _constructor(state ?: STATE): void {
        state = state || {} as STATE;
        state.ref = state.ref || {};

        state.deco = state.deco || {} as IHtmlUtils;
        IHtmlUtils.initForNx2(state);

        state.ref.widget = this;
        this.state = state;
        this.className = this.constructor.name; // the name of the class
        if (!state.tagId) state.tagId = getRandomString(this._className);
    } // _constructor

    /**
     * This method assumes that the state is completely initialized and ready to be used.
     *
     * Useful when overriding in order to customize the state object before calling super.
     *
     * @param state
     * @protected
     */
    protected onStateInitialized(state: STATE) {

        if (state.wrapper && !state.wrapperTagId)
            if (state.tagId)
                state.wrapperTagId = state.tagId + '_wrapper';
            else
                state.wrapperTagId = getRandomString(this._className + '_wrapper');


        /**
         * At development time detect that the state has changed
         */
        if (isDev()) {
            if (state && this.state) {
                if (state !== this.state) {
                    console.error('State mismatch. Old State is', this.state, 'New state is', state);
                    setTimeout(() => {
                            DialogUtility.alert({
                                title: 'Nx2 component state problem',
                                content: '<p>State used is a completely new variable instead of the original. <p>This new state will be ignored, so you won\'t see its contents in the UI and wonder why that is!!!<p>See console for details.<p>',
                                width: 'min(80%, 500px)',
                                height: 'min(80%, 300px)',
                                isModal: true,
                            });
                        },
                        500);
                } // if (state !== this.state)
            } // if (state && this.state)
        } // if (isDev())
    } // onStateInitialized


    /**
     * A boolean indicating this instance is an Nx2.
     * @type {boolean}
     * @readonly
     */
    readonly isNx2: boolean = true;

    private _state: STATE;

    get state(): STATE {
        return this._state;
    } // state

    set state(state: STATE) {
        if (state) {
            state.deco = IHtmlUtils.init(state.deco); // the decorator must exist because there must be a tag type for the component HTML

            // Tag the new state with the widget
            if (state.ref.widget && state.ref.widget != this) {
                throw new Error(`The state instance is already set to widget ${state.ref.widget.state.tagId} and is now trying to be assigned to ${state.tagId}!}`);
            }
            state.ref.widget = this as Nx2; // tag the state with the widget

        } else {
            // If being assigned a null state, then remove the reference to this widget from the previous state
            if (this.state) {
                this.state.ref.widget = null; // remove the reference to this object
            }
        }// if state
        this._state = state;
    }

    private _className: string;

    get className(): string {
        return this._className;
    }

    set className(value: string) {
        this._className = value;
    }

    //---------------- resize section ----------------


    /**
     *
     * @param evt Nx2Evt_Resized
     */
    onResized(evt?: Nx2Evt_Resized): void {
    }


    private _resizeSensor: ResizeSensor;
    private _resizeAllowed: boolean = true;

    public get resizeAllowed(): boolean {
        return this._resizeAllowed;
    }

    public set resizeAllowed(value: boolean) {
        this._resizeAllowed = value;
    }

    protected get resizeSensor(): ResizeSensor {
        return this._resizeSensor;
    }

    protected set resizeSensor(value: ResizeSensor) {
        this._resizeSensor = value;
    }

    private _resizeEventMinInterval: number; // milliseconds

    /**
     * Defaults to 400 ms if not set
     */
    get resizeEventMinInterval(): number {
        if (this._resizeEventMinInterval == null || this._resizeEventMinInterval <= 0)
            this._resizeEventMinInterval = 400;
        return this._resizeEventMinInterval;
    }

    set resizeEventMinInterval(value: number) {
        this._resizeEventMinInterval = value;
    }

    protected _applyResizeSensor(): void {

        if ( !this.resizeAllowed)
            return;

        // initialize the min interval if not already set
        this.resizeEventMinInterval

        try {
            if (this.resizeSensor)
                this.resizeSensor.detach();
        } catch (e) {
            this.handleError(e);
        }

        this.resizeSensor = null;
        this.resizeSensor = new ResizeSensor(this.htmlElement, this._resizeSensorCallback);
        this.resizeAllowed = true; // allow resize events to fire

    } // createResizeSensor


    /**
     * Using {@link debounce} and not {@link throttle} because we want to fire the event only once
     * AFTER the resize is complete. Throttle would fire the event first, debouncewaits the minimum interval
     * before firing. With throttle, we get an initial endless loop of resize events.
     *
     * @protected
     */
    protected _resizeSensorCallback: ResizeSensorCallback = debounce((_size: { width: number; height: number; }) => {
            if (this.resizeAllowed) {
                if (this && this.initialized) {

                    let param: Nx2Evt_Resized = {widget: this, size: _size}

                    if (this.state.onResized) {
                        this.state.onResized(param);
                    } else {
                        this.onResized(param);
                    }

                } // if (thisX && thisX.obj && thisX.initialized )
            } // if resizeAllowed
        } // function body of debouncedFunction
        , this.resizeEventMinInterval);


    //---------------- end resize methods ----------------


    private _obj: JS_COMPONENT;

    /**
     * Get the JS instance underlying this widget
     * Base method that is overwritten by typed method in AnyWidget
     */
    get obj(): JS_COMPONENT {
        return this._obj;
    }

    /**
     * Set the JS instance underlying this Widget
     * Base method that is overwritten by typed method in AnyWidget
     */
    set obj(value: JS_COMPONENT) {
        this._obj = value;
    }

    private _initialized: boolean = false; // True if initLogic has been invoked already

    get initialized(): boolean {
        return this._initialized;
    }

    set initialized(value: boolean) {
        this._initialized = value;
    }

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

    private _parent: Nx2;

    get parent(): Nx2 {
        return this._parent;
    }

    set parent(value: Nx2) {
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


    //--------- Getters and Setters ----------------

    /**
     * Retrieves the HTMLElement associated with the widget. If the HTMLElement
     * reference is not yet initialized, it triggers the 'onStateInitialized' event
     * (if not already called) and initializes the HTMLElement.
     *
     * If there is a wrapper element, this instance will be the wrapper element.
     * If you need the element to which the JS component is anchored, user the htmlElementAnchor property.
     *
     * @return {HTMLElement} The HTMLElement associated with the widget.
     */
    get htmlElement(): HTMLElement {

        this._triggerOnStateInitialized(); // trigger onStateInitialzed if not already called

        if (!this.state.ref.htmlElement)
            this.initHtml();

        return this.state.ref.htmlElement;
    }

    set htmlElement(value: HTMLElement) {

        let state = this.state;

        let oldElement = state.ref?.htmlElement;
        if (oldElement == value)
            return; // nothing to do

        if (oldElement) {
            if (this.resizeSensor) {
                this.resizeSensor.detach();
            }

            let actualNx2Elem = oldElement;
            if (oldElement.id != this.state.tagId) {
                // oldElement is probably the wrapper
                actualNx2Elem = oldElement.querySelector(`#${this.state.tagId}`);
            }

            if (actualNx2Elem) {
                actualNx2Elem.classList.remove(NX2_CLASS); // untag the element
                actualNx2Elem[NX2_CLASS] = null; // remove the reference to this object
            }

        }
        state.ref.htmlElement = value;

        if (value) {
            // tag this element with the widget

            let actualNx2Elem = value;
            if (value.id != this.state.tagId) {
                // value is probably the wrapper
                actualNx2Elem = value.querySelector(`#${this.state.tagId}`);
            }
            if (actualNx2Elem) {
                actualNx2Elem.classList.remove(NX2_CLASS); // just in case
                actualNx2Elem.classList.add(NX2_CLASS); // tag the element
                actualNx2Elem[NX2_CLASS] = this; // tag the element with the widget itself
            }

            if (state.resizeTracked) {
                // only if the widget has already been initialized (if it has not, then initLogic will apply it the first time
                setTimeout(() => {
                        this._applyResizeSensor();
                    },
                    // this.resizeEventMinInterval // wait the minimum interval to avoid an infinite loop when the resize triggers because the panel is not finished its initial sizing
                );
            }
        }
    }


    /**
     * Retrieves the actual HTMLElement representing the widget, taking into account
     * the presence of a wrapper and tagId.
     *
     * If a wrapper is present and has a tagId, the element with the specified tagId is returned.
     *
     * If a wrapper is present but doesn't have a tagId, the first HTMLElement child or the wrapper itself is
     * returned, depending on whether it has child nodes or not.
     *
     * If no wrapper is present, the HTMLElement itself is returned.
     *
     * @return {HTMLElement} The actual HTMLElement representing the widget. Could be null in fringe cases where the wrapper somehow has no children.
     */
    get htmlElementAnchor(): HTMLElement {
        let htmlElement = this.htmlElement;
        if (htmlElement == null)
            return null;

        let state = this.state;
        let hasWrapper = state.wrapper != null;
        let hasTagId = this.hasTagId;
        if (hasWrapper) {
            if (hasTagId) {
                // has wrapper and has tagId: the tagId is the element
                return htmlElement.querySelector(`#${state.tagId}`);
            } else {
                if (htmlElement.hasChildNodes()) {
                    // wrapper but no tagId, and has children: the first child is it
                    return getFirstHTMLElementChild(htmlElement);
                } else {
                    // wrapper but no tagId, and no children: the wrapper is it
                    return htmlElement;
                }
            }
        } else {
            // no wrapper: the htmlElement itself is it
            return htmlElement;
        }
    } // htmlElementAnchor

    /**
     * Determines if the widget has a tagId. It checks the state for the presence of
     * a tagId and ensures that the 'noTagIdInHtml' property is false.
     *
     * @return {boolean} True if the widget has a tagId, otherwise false.
     */
    get hasTagId(): boolean {
        let state = this.state;
        if (!state)
            return false;
        if (state.noTagIdInHtml)
            return false;
        return state.tagId != null;
    }

    abstract onDestroy(args: Nx2Evt_Destroy): void;

    abstract onHtml(args: Nx2Evt_OnHtml): HTMLElement;

    /**
     * This is the method that gives a component the chance to call any JavaScript and instantiate the widget.
     *
     *
     * The method is called by initLogic method, after all the children's initLogic methods have been called.
     * Therefore, all children JS objects are available at this point in time.
     *
     */
    abstract onLogic(args: Nx2Evt_OnLogic): void ;

    /**
     * This is the perfect event in which to initialize any children or settings for 'this' rightContainer before
     * the HTMLElement is created
     * @param args
     * @protected
     */
    protected onBeforeInitHtml(args: Nx2Evt_OnHtml): void {
    }

    initHtml(): void {
        if (this.state?.ref?.htmlElement) return;
        try {
            if (this.state.onBeforeInitHtml) {
                this.state.onBeforeInitHtml.call(this, {widget: this});
            } else {
                this.onBeforeInitHtml.call(this, {widget: this});
            }
        } catch (ex) {
            console.error(ex)
        }

        if (this.state.onHtml) {
            this.htmlElement = this.state.onHtml.call(this, {widget: this});
        } else {
            this.htmlElement = this.onHtml.call(this, {widget: this});
        }
    } // initHtml

    initLogic(): void {
        if (this.initialized)
            return;


        this._triggerOnStateInitialized(); // trigger onStateInitialzed if not already called


        let args: Nx2Evt_BeforeLogic = {
            widget: this,
            cancel: false,
        };

        let state = this.state;

        try {
            if (state.onBeforeInitLogic) {
                state.onBeforeInitLogic(args);
                if (args.cancel) return;

            } else {
                if (this.onBeforeInitLogic) {
                    this.onBeforeInitLogic(args);
                    if (args.cancel) return;
                }
            }// if

        } catch (e) {
            this.handleError(e);
        }

        this.initialized = true;
        let thisX = this;

        thisX.initHtml(); // initialize the htmlElement at this point

        try {
            this.initLogicInProgress = true;

            // run this component's logic BEFORE the children

            if (state.onLogic) {
                state.onLogic({widget: this}); // state widgetLogic second
            } else {
                this.onLogic({widget: this}); // widget localLogicImplementation third
            }

            try {
                if (state?.onAfterInitWidgetOnly) {
                    state.onAfterInitWidgetOnly({widget: this});
                } else {
                    if (this.onAfterInitWidgetOnly) {
                        this.onAfterInitWidgetOnly.call(this, {widget: this})
                    }
                }
            } catch (ex) {
                console.error(ex);
                getErrorHandler().displayExceptionToUser(ex)
            }

            let atLeastOneChildInitialized: boolean = false;
            let children: Elem_or_Nx2[];
            if (state.children)
                children = state.children;
            if (children && children.length > 0) {
                children.map((child) => {
                    if (child) {
                        if (isNx2(child)) {
                            if (!child.initialized) {
                                atLeastOneChildInitialized = true;
                                return child.initLogic();
                            }
                        } // if ( isNx2(child))
                    } // if ( child)
                });
            } // if ( this.children)

            // ------------ onChildrenInitialized -----------------------

            if (atLeastOneChildInitialized && state?.onAfterChildrenInit) {
                try {
                    state.onAfterChildrenInit();
                } catch (ex) {
                    console.error(ex);
                    getErrorHandler().displayExceptionToUser(ex)
                }
            } // atLeastOneChildInitialized

        } finally {
            this.initLogicInProgress = false;
        }


        if (state.onAfterInitLogic) {
            // ------------ After Init Logic Listeners -----------------------
            try {
                state.onAfterInitLogic({widget: this})
            } catch (ex) {
                thisX.handleError(ex);
            }
        } else {

            if (this.onAfterInitLogic) {
                // ------------ After Init Logic Listeners -----------------------
                let args: Nx2Evt_AfterLogic = {
                    widget: thisX
                };

                try {
                    this.onAfterInitLogic(args)
                } catch (ex) {
                    thisX.handleUIError(ex);
                }

            } // if

        }
        if (state.resizeTracked) {
            thisX._applyResizeSensor();
        } // if (this.resizeTracked)

    } // initLogic


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
     * Called after the widget AND any children's logic have been initialized
     */
    onAfterInitLogic(args: Nx2Evt_AfterLogic): void {
    }


    /**
     * If this is specified, the widget's method (if any) will not be called.
     * Should you need to call the corresponding widget method, you can call it manually from this method
     * by using the widget instance in the parameter
     */
    onBeforeInitLogic(args: Nx2Evt_BeforeLogic): void {
    }

    /**
     *  Called after initLogic has been completed for this component but NOT for any child components
     *  Use the <link>onChildrenInstantiated</link> event if you need all child components to also have been initialized
     */
    onAfterInitWidgetOnly(args: Nx2Evt_AfterLogic): void {}


    /**
     * Returns the HTMLElement for this widget that makes sure that the Nx2 widget's logic has been initialized
     * @return {HTMLElement}
     */
    get htmlElementInitialized(): HTMLElement {
        let htmlElement = this.htmlElement;

        try {
            if (!this.initialized)
                this.initLogic();
        } catch (ex) {
            this.handleError(ex);
        }

        return htmlElement;
    } //htmlElementInitialized

    addNx2Child(nx2: Nx2): void {
        addNx2Child(this, nx2);
    } // addNx2Child

    removeNx2Child(nx2: Nx2): boolean {
        return removeNx2Child(this, nx2);
    } // removeNx2Child


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
        if (isDev()) {
            getErrorHandler().displayExceptionToUser(err);
        }
        return true;
    }

    //---------------------------------------------
    private _initStateCalled: boolean = false;

    protected _triggerOnStateInitialized(): void {

        if (!this._initStateCalled) {
            try {
                this.onStateInitialized(this.state);
            } catch (e) {
                this.handleError(e);
            } finally {
                this._initStateCalled = true;
            }
        }
    } // _triggerOnStateInitialized
    //--------------------------------------------

} // Nx2

export interface Nx2Evt<WIDGET extends Nx2 = Nx2> {
    widget: WIDGET;
}

export interface Nx2Evt_OnHtml<WIDGET extends Nx2 = Nx2> extends Nx2Evt<WIDGET> {
}

export interface Nx2Evt_OnLogic<WIDGET extends Nx2 = Nx2> extends Nx2Evt<WIDGET> {
}


export interface Nx2Evt_Ref<EVENT_TYPE, WIDGET extends Nx2> {

    /**
     * The widget that the refresh was triggered on. Autofilled by the refresh method.
     */
    widget?: WIDGET;

    /**
     * The immediate parent widget that the refresh was triggered on
     * Null if the refresh is triggered at this level
     */
    parent?: Nx2;


    /**
     * The topContainer level widget that the refresh was triggered on
     * Null if the refresh is triggered at this level
     *
     */
    topParent?: Nx2;

    /**
     * True if this parameter is created by the algorithm while refreshing the children.
     * False if called specifically by the user.
     */
    isAlgoCreated?: boolean;

    /**
     * The argument for the parent above this child (or null if this is the topContainer level)
     */
    parentArgument?: EVENT_TYPE;
}

export interface Nx2Evt_Destroy<WIDGET extends Nx2 = Nx2> extends Nx2Evt<WIDGET> {

    /**
     * Allows user to add either data or functions to be passed down the refresh chain.
     */
    extras?: any;

    /**
     * Properties that are filled in by the refresh method
     */
    ref?: Nx2Evt_Ref<Nx2Evt_Destroy, WIDGET>;

}

export interface Nx2Evt_BeforeLogic<WIDGET extends Nx2 = Nx2> extends Nx2Evt<WIDGET> {

    /**
     * If developer sets to true, the initLogic will not be called.
     */
    cancel: boolean;
}

export interface Nx2Evt_AfterLogic extends Nx2Evt {
}

export interface Nx2Evt_Resized extends Nx2Evt {
    size?: { width: number; height: number; }
}


// private _refreshInProgress: boolean;
// get refreshInProgress(): boolean {
//     return this._refreshInProgress;
// }
//
// /**
//  * Used by system to set the flag.
//  * Developers, please do not use this method unless you REALLY, REALLY understand the effects.
//  * @param value
//  */
// set refreshInProgress(value: boolean) {
//     this._refreshInProgress = value;
// }

// refresh(args ?: Nx2Evt_Refresh) {
//     if (this.initialized) {
//         try {
//             this.refreshInProgress = true;
//
//             let state = this.state;
//
//
//             args = args || {widget: this};
//             // args.currentLevelOnly = args.currentLevelOnly || false;
//             // args.resetUIOnRefresh = args.resetUIOnRefresh || false;
//             args.ref = args.ref || {};
//             args.extras = args.extras || {};
//
//             let ref = args.ref;
//             ref.topParent = ref.topParent || this; // if empty, then this is the topContainer parent
//             ref.widget = this;
//
//             // if (!args.currentLevelOnly) {
//             //     let children: Nx2[];
//             //     if (state.children)
//             //         children = state.children;
//             //     if (children) {
//             //         for (const child of children) {
//             //
//             //             try {
//             //                 let childArgs: Nx2Evt_Refresh = {
//             //                     widget: child,
//             //                     // currentLevelOnly: false,
//             //                     // resetUIOnRefresh: args.resetUIOnRefresh,
//             //                     ref: {
//             //                         topParent: ref.topParent,
//             //                         widget: child,
//             //                         parent: this,
//             //                         isAlgoCreated: true,
//             //                         parentArgument: args,
//             //                     },
//             //                 }; // childArgs
//             //
//             //                 if (child)
//             //                     child.refresh(childArgs); // this would trigger a reset in the child if state.resetUIOnRefresh does not override it
//             //             } catch (e) {
//             //                 this.handleUIError(e);
//             //             }
//             //
//             //         }
//             //     } // if ( this.children)
//             //
//             // } // if (!refreshParam.currentLevelOnly)
//
//             // // noinspection JSUnusedAssignment
//             // let resetUIOnRefresh: boolean = false;
//             // if (state.resetUIOnRefresh !== undefined && state.resetUIOnRefresh !== null) {
//             //     resetUIOnRefresh = state.resetUIOnRefresh;   // functionality on state ALWAYS trumps functionality on widget (state functionality can call widget functionality inside its implementation if need be)
//             // } else {
//             //     resetUIOnRefresh = args.resetUIOnRefresh;
//             // }
//
//
//             // if (resetUIOnRefresh) {
//             //
//             //     try {
//             //         this.reset({
//             //             widget: this,
//             //             extras: args.extras,
//             //             ref: {
//             //                 topParent: ref.topParent,
//             //                 widget: this,
//             //                 parent: args.ref.widget,
//             //                 parentArgument: null, // no parent argument
//             //             }
//             //         });
//             //     } catch (e) {
//             //         this.handleError(e);
//             //     }
//             // } // if (resetUIOnRefresh)
//
//
//             try {
//                 if (state.onRefresh) {
//                     state.onRefresh(args); // functionality on state ALWAYS trumps functionality on widget (state functionality can call widget functionality inside its implementation if need be)
//                 } else {
//                     if (this.onRefresh)
//                         this.onRefresh(args);
//                 }
//             } catch (e) {
//                 this.handleError(e);
//             }
//
//             // if (state?.onAfterRefresh) {
//             //    try {
//             //       state.onAfterRefresh({widget: this});
//             //    } catch (ex) {
//             //       console.log(ex);
//             //    }
//             // } // if (this._args_AbstractWidget?.onAfterRefresh)
//
//         } catch (err) {
//             this.handleError(err);
//         } finally {
//             this.refreshInProgress = false;
//         }
//     } // if (this.initialized)
//
// } // refresh

// reset(args ?: Nx2Evt_Destroy): void {
//     /*
//      Resets the htmlElement and calls initLogic on this widget only.
//
//      This method is called from inside the refresh method, when the resetUIOnRefresh flag is set to true.
//
//      As such, and because the children are processed first in a refresh, by the time the reset happens here
//      the children have already been reset.
//      */
//     let state = this.state;
//
//
//     args = args || {widget: this}
//     // args.currentLevelOnly = args.currentLevelOnly || false;
//     args.ref = args.ref || {};
//     args.extras = args.extras || {};
//
//     let ref = args.ref;
//     ref.topParent = ref.topParent || this; // if empty, then this is the topContainer parent
//     ref.widget = this;
//
//
//     let oldHtmlElement = this.htmlElement;
//     this.htmlElement = null;
//     this.initialized = false; // to allow initLogic to work properly
//     let newHtmlElement = this.htmlElement;
//     this.initLogic();
//     oldHtmlElement.replaceWith(newHtmlElement);
//
//
// } // reset