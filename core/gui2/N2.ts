import {DialogUtility} from '@syncfusion/ej2-popups';
import {AxiosResponse} from "axios";
import {ResizeSensor} from "css-element-queries";
import {ResizeSensorCallback} from "css-element-queries/src/ResizeSensor";
import {debounce, throttle} from "lodash";
import {getRandomString} from "../BaseUtils";
import {N2_CLASS} from '../Constants';
import {Err} from "../Core";
import {getErrorHandler} from "../CoreErrorHandling";
import {isDev} from '../CoreUtils';
import {cssAdd} from '../CssUtils';
import {ExceptionEvent} from "../ExceptionEvent";
import {WidgetErrorHandlerStatus} from "../gui/WidgetErrorHandler";
import {ObserverManager} from '../ObserverManager';
import {addN2Child, removeN2Child} from './ej2/Ej2Utils';
import {addN2Class, IHtmlUtils} from "./N2HtmlDecorator";
import {Elem_or_N2, getFirstHTMLElementChild, isN2, toProperHtmlId} from './N2Utils';
import {CSS_VARS_CORE} from './scss/vars-material';
import {StateN2} from "./StateN2";
import {ThemeChangeEvent, themeChangeListeners} from './Theming';


export abstract class N2<STATE extends StateN2 = any, JS_COMPONENT = any> {
    static readonly CLASS_IDENTIFIER: string = 'N2';

    /**
     * A boolean indicating this instance is a N2.
     * @type {boolean}
     * @readonly
     */
    readonly isN2: boolean = true;

    private _className: string;
    private _state: STATE;
    private _obj: JS_COMPONENT;
    private _parent: N2;
    private _initialized: boolean = false; // True if initLogic has been invoked already
    private _initLogicInProgress: boolean;
    private _resizeSensor: ResizeSensor;
    private _resizeAllowed: boolean = true;
    private _resizeEventMinInterval: number; // milliseconds

    private __onStateInitializedInProgress = false;
    private _initStateCalled: boolean = false;
    private _alreadyInOnStateInitialized: boolean = false; // flag to prevent infinite recursion
    private _onDOMAddedProcessed: boolean = false;
    private _onDOMRemovedProcessed: boolean = false;
    public lastSize: { width: number; height: number; } = {width: 0, height: 0}; // extending classes update this if they need to fire onResized (N2PanelGrid specifically)

    protected constructor(state ?: STATE) {
        this._constructor(state);
    } //  constructor

    /**
     * The constructor calls this method as soon as the class is created.
     * This is the absolute earliest time to initialize any fields in the object by extending/overriding this implementation
     * Initializes the state object to defaults if properties are null, sets the tagId if necessary and sets the class name for the widget and
     */
    protected _constructor(state ?: STATE): void {
        state = state || {} as STATE;
        state.ref = state.ref || {};
        state.other = state.other || {};

        state.deco = state.deco || {} as IHtmlUtils;
        IHtmlUtils.initForN2(state);

        state.ref.widget = this;
        this.state = state;
        this.className = this.constructor.name; // the name of the class
        if (!state.tagId) state.tagId = getRandomString(toProperHtmlId(this._className)); // in case className gets converted to something starting with $ or another invalid char we always have the '_' as a valid char
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

        addN2Class(state.deco, N2.CLASS_IDENTIFIER); // this might not be the same as the actual _n2_ HTMLElement

        if (!this.__onStateInitializedInProgress && state.onStateInitialized) {
            // if state contains the method, that overrides this one
            try {
                this.__onStateInitializedInProgress = true; // eliminates infinite recursion if the state.onStateInitialized calls this method

                state.onStateInitialized({widget: this})
            } catch (e) {
                console.error(e);
                this.handleError(e);
            } finally {
                this.__onStateInitializedInProgress = false;
            }

        } else { // if (state.onStateInitialized)

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
                                    title: 'N2 component state problem',
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
        } // if (state.onStateInitialized)

    } // onStateInitialized


    protected get alreadyInOnStateInitialized(): boolean {
        return this._alreadyInOnStateInitialized;
    }

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
            state.ref.widget = this as N2; // tag the state with the widget

        } else {
            // If being assigned a null state, then remove the reference to this widget from the previous state
            if (this.state) {
                this.state.ref.widget = null; // remove the reference to this object
            }
        }// if state
        this._state = state;
    }


    get className(): string {
        return this._className;
    }

    set className(value: string) {
        this._className = value;
    }

    //---------------- resize section ----------------


    /**
     *
     * @param evt N2Evt_Resized
     */
    onResized(evt?: N2Evt_Resized): void {
    }


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

        if (!this.resizeAllowed)
            return;

        // initialize the min interval if not already set
        this.resizeEventMinInterval

        try {
            if (this.resizeSensor)
                this.resizeSensor.detach();
        } catch (e) {
            console.error(e);
            this.handleError(e);
        }

        this.resizeSensor = null;
        this.resizeSensor = new ResizeSensor(this.htmlElement, this._resizeSensorCallback);
        this.resizeAllowed = true; // allow resize events to fire

    } // createResizeSensor


    /**
     * Using {@link debounce} and not {@link throttle} because we want to fire the event only once
     * AFTER the resize is complete. Throttle would fire the event first, debounce waits the minimum interval
     * before firing. With throttle, we get an initial endless loop of resize events.
     *
     * @protected
     */
    protected _resizeSensorCallback: ResizeSensorCallback = debounce((_size: { width: number; height: number; }) => {
            if (this.resizeAllowed) {
                if (this && this.initialized) {

                    if (this.lastSize.width == _size.width && this.lastSize.height == _size.height)
                        return; // no change in size

                    let param: N2Evt_Resized = this.create_N2Evt_Resized(_size);

                    if( param.lastSizeEmpty || param.height_diff != 0 || param.width_diff != 0 ) {
                        try {
                            if (this.state.onResized) {
                                this.state.onResized(param);
                            } else {
                                this.onResized(param);
                            }
                        } catch (e) { console.error(e);}
                    }

                    this.lastSize = _size;

                } // if (thisX && thisX.obj && thisX.initialized )
            } // if resizeAllowed
        } // function body of debouncedFunction
        ,
        this.resizeEventMinInterval,
        {
            leading: false, //leading: false means the function will not execute on the first call but will start the timer.
            trailing: true, // trailing: true ensures that the function will execute once at the end of the wait period, provided no new calls are made within the last 500ms of the timer.
        }
    );

    create_N2Evt_Resized(size: { width: number; height: number; }): N2Evt_Resized {
        return {
            widget: this,
            size: size,
            lastSize: this.lastSize,
            lastSizeEmpty: (this.lastSize.width == 0 && this.lastSize.height ==0 ),
            height_diff: Math.abs(size.height - this.lastSize.height),
            width_diff: Math.abs(size.width - this.lastSize.width),
        };
    } // create_N2Evt_Resized


    //---------------- end resize methods ----------------


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


    get parent(): N2 {
        return this._parent;
    }

    set parent(value: N2) {
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
        } catch (e) {
            console.error(e);
            this.handleUIError(e);
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

        this._triggerOnStateInitialized(); // trigger onStateInitialized if not already called

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

            let actualN2Elem = oldElement;
            if (oldElement.id != this.state.tagId) {
                // oldElement is probably the wrapper
                try {
                    actualN2Elem = oldElement.querySelector(`#${this.state.tagId}`);
                } catch (e) {
                    console.error(e);
                    actualN2Elem = document.getElementById(this.state.tagId);
                }
            }

            if (actualN2Elem) {
                actualN2Elem.classList.remove(N2_CLASS); // untag the element
                (actualN2Elem as any)[N2_CLASS] = null; // remove the reference to this object
            }

        }
        state.ref.htmlElement = value;

        if (value) {
            // tag this element with the widget

            let actualN2Elem = value;
            if (value.id != this.state.tagId) {
                // value is probably the wrapper
                try {
                    actualN2Elem = value.querySelector(`#${this.state.tagId}`);
                } catch (e) {
                    console.error(e);
                    actualN2Elem = document.getElementById(this.state.tagId);
                }
            }
            if (actualN2Elem) {
                actualN2Elem.classList.remove(N2_CLASS); // just in case
                actualN2Elem.classList.add(N2_CLASS); // tag the element
                (actualN2Elem as any)[N2_CLASS] = this; // tag the element with the widget itself
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
                try {
                    let elem = htmlElement.querySelector(`#${state.tagId}`) as HTMLElement;
                    return (elem ? elem : document.getElementById(this.state.tagId));

                } catch (e) {
                    console.error(e);
                    return document.getElementById(this.state.tagId);
                }
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

    abstract onDestroy(args: N2Evt_Destroy): void;

    abstract onHtml(args: N2Evt_OnHtml): HTMLElement;

    /**
     * This is the method that gives a component the chance to call any JavaScript and instantiate the widget.
     *
     *
     * The method is called by initLogic method, after all the children's initLogic methods have been called.
     * Therefore, all children JS objects are available at this point in time.
     *
     */
    abstract onLogic(args: N2Evt_OnLogic): void ;

    /**
     * This is the perfect event in which to initialize any children or settings for 'this' rightContainer before
     * the HTMLElement is created
     * @protected
     * @param _args
     */
    protected onBeforeInitHtml(_args: N2Evt_OnHtml): void {
    }

    initHtml(): void {
        if (this.state?.ref?.htmlElement) return;
        try {
            if (this.state.onBeforeInitHtml) {
                this.state.onBeforeInitHtml.call(this, {widget: this});
            } else {
                this.onBeforeInitHtml.call(this, {widget: this});
            }
        } catch (e) {
            console.error(e)
        }

        if (this.state.onHtml) {
            this.htmlElement = this.state.onHtml.call(this, {widget: this});
        } else {
            this.htmlElement = this.onHtml.call(this, {widget: this});
        }

        this._registerOnDOMAdded(); // register the onDOMAdded event
        this._registerOnDOMRemoved(); // register the onDOMRemoved event
    } // initHtml

    initLogic(): void {
        if (this.initialized)
            return;


        this._triggerOnStateInitialized(); // trigger onStateInitialized if not already called


        let args: N2Evt_BeforeLogic = {
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
            console.error(e);
            this.handleError(e);
        }

        this.initialized = true;
        let thisX = this;

        thisX.initHtml(); // initialize the htmlElement at this point

        try {
            this.initLogicInProgress = true;

            // run this component's logic BEFORE the children

            if (state.onLogic) {
                state.onLogic({widget: this} as N2Evt_OnLogic); // state widgetLogic second
            } else {
                this.onLogic({widget: this} as N2Evt_OnLogic); // widget localLogicImplementation third
            }

            try {
                if (state?.onAfterInitWidgetOnly) {
                    state.onAfterInitWidgetOnly({widget: this});
                } else {
                    if (this.onAfterInitWidgetOnly) {
                        this.onAfterInitWidgetOnly.call(this, {widget: this})
                    }
                }
            } catch (e) {
                console.error(e);
                getErrorHandler().displayExceptionToUser(e)
            }

            let atLeastOneChildInitialized: boolean = false;
            let children: Elem_or_N2[];
            if (state.children)
                children = state.children;
            if (children && children.length > 0) {
                children.map((child) => {
                    if (child) {
                        if (isN2(child)) {
                            if (!child.initialized) {
                                atLeastOneChildInitialized = true;
                                return child.initLogic();
                            }
                        } // if ( isN2(child))
                    } // if ( child)
                });
            } // if ( this.children)

            // ------------ onChildrenInitialized -----------------------

            if (atLeastOneChildInitialized && state?.onAfterChildrenInit) {
                try {
                    state.onAfterChildrenInit();
                } catch (e) {
                    console.error(e);
                    getErrorHandler().displayExceptionToUser(e)
                }
            } // atLeastOneChildInitialized

        } finally {
            this.initLogicInProgress = false;
        }


        if (state.onAfterInitLogic) {
            // ------------ After Init Logic Listeners -----------------------
            try {
                state.onAfterInitLogic({widget: this})
            } catch (e) {
                console.error(e);
                thisX.handleError(e);
            }
        } else {

            if (this.onAfterInitLogic) {
                // ------------ After Init Logic Listeners -----------------------
                let args: N2Evt_AfterLogic = {
                    widget: thisX
                };

                try {
                    this.onAfterInitLogic(args)
                } catch (e) {
                    console.error(e);
                    thisX.handleUIError(e);
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
        } catch (e) {
            console.error(e);
            this.handleError(e);
        }
    } // destroy

    /**
     * Called after the widget AND any children's logic have been initialized
     */
    onAfterInitLogic(_args: N2Evt_AfterLogic): void {
    }


    /**
     * If this is specified, the widget's method (if any) will not be called.
     * Should you need to call the corresponding widget method, you can call it manually from this method
     * by using the widget instance in the parameter
     */
    onBeforeInitLogic(_args: N2Evt_BeforeLogic): void {
    }

    /**
     *  Called after initLogic has been completed for this component but NOT for any child components
     *  Use the <link>onChildrenInstantiated</link> event if you need all child components to also have been initialized
     */
    onAfterInitWidgetOnly(_args: N2Evt_AfterLogic): void {}


    /**
     * If this is overridden in a child class, it will be called when the html element for this N2 widget is added to the DOM
     * @param {N2Evt_DomAdded} ev
     */
    onDOMAdded(ev: N2Evt_DomAdded): void {}

    /**
     * If this is overridden in a child class, it will be called when the html element for this N2 widget is removed from the DOM
     * @param {N2Evt_DomRemoved} ev
     */
    onDOMRemoved(ev: N2Evt_DomRemoved): void {}


    private _initLogicIfNeeded() {

        try {
            if (!this.initialized)
                this.initLogic();
        } catch (e) {
            console.error(e);
            this.handleError(e);
        }
    } // _initLogicIfNeeded
    /**
     * Returns the HTMLElement for this widget that makes sure that the N2 widget's logic has been initialized
     * @return {HTMLElement}
     */
    get htmlElementInitialized(): HTMLElement {
        let htmlElement = this.htmlElement;
        this._initLogicIfNeeded.call(this)

        return htmlElement;
    } //htmlElementInitialized

    /**
     * Returns the HTMLElementAnchor for this widget that makes sure that the N2 widget's logic has been initialized
     * @return {HTMLElement}
     */
    get htmlElementAnchorInitialized(): HTMLElement {
        let htmlElement = this.htmlElementAnchor;
        this._initLogicIfNeeded.call(this)
        return htmlElement;
    } //htmlElementInitialized
    /**
     * Add child(ren) N2 or HTMLElement to this N2 instance
     * @return {boolean} true if successful, false if error
     * @param n2
     */
    addN2Child(...n2: Array<N2>): void {
        addN2Child(this, ...n2);
    } // addN2Child


    /**
     *
     * Remove child(ren) N2 or HTMLElement from this N2 instance
     * @return {boolean} true if successful, false if error
     * @param n2
     */
    removeN2Child(...n2: Array<N2>): boolean {
        return removeN2Child(this, ...n2);
    } // removeN2Child


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
            console.error(e);
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
    protected _triggerOnStateInitialized(): void {
        if (this._alreadyInOnStateInitialized)
            return;
        if (!this._initStateCalled) {
            try {
                this._alreadyInOnStateInitialized = true;
                this.onStateInitialized(this.state);
            } catch (e) {
                console.error(e);
                this.handleError(e);
            } finally {
                this._alreadyInOnStateInitialized = false;
                this._initStateCalled = true;
            }
        }
    } // _triggerOnStateInitialized

    protected _registerOnDOMAdded(): void {
        if (this._onDOMAddedProcessed)
            return;

        this._onDOMAddedProcessed = true; // so it cannot be called again

        try {
            if (this.state.onDOMAdded) {
                try {
                    ObserverManager.addOnAdded({
                        identifier: this.state.tagId,
                        onAdded: (element: HTMLElement) => {
                            try {
                                this.state.onDOMAdded.call(this, {widget: this, element: element});
                            } catch (e) { console.error('Error calling this.state.onDOMAdded(...)', e, element, this); }
                        },
                        autoRemove: true,
                    });
                } catch (e) {
                    console.error(e);
                    this.handleError(e);
                }
            } else if (!(N2.prototype.onDOMAdded === this.onDOMAdded)) {
                // if the base method from N2 is DIFFERENT than the current method
                try {
                    ObserverManager.addOnAdded({
                        identifier: this.state.tagId,
                        onAdded: (element: HTMLElement) => {
                            try {
                                this.onDOMAdded.call(this, {widget: this, element: element});
                            } catch (e) { console.error('Error calling this.onDOMAdded(...)', e, element, this); }
                        },
                        autoRemove: true,
                    });
                } catch (e) {
                    console.error(e);
                    this.handleError(e);
                }
            }
        } catch (e) { console.error(e); }

    } // _registerOnDOMAdded
    //--------------------------------------------


    protected _registerOnDOMRemoved(): void {
        if (this._onDOMRemovedProcessed)
            return;

        this._onDOMRemovedProcessed = true; // so it cannot be called again

        try {
            if (this.state.onDOMRemoved) {
                try {
                    ObserverManager.addOnRemoved({
                        identifier: this.state.tagId,
                        onRemoved: (element: HTMLElement) => {
                            try {
                                this.state.onDOMRemoved.call(this, {widget: this, element: element});
                            } catch (e) { console.error('Error calling this.state.onDOMRemoved(...)', e, element, this); }
                        },
                        autoRemove: true,
                    });
                } catch (e) {
                    console.error(e);
                    this.handleError(e);
                }

            } else if (!(N2.prototype.onDOMRemoved === this.onDOMRemoved)) {
                // if the base method from N2 is DIFFERENT than the current method
                try {
                    ObserverManager.addOnRemoved({
                        identifier: this.state.tagId,
                        onRemoved: (element: HTMLElement) => {
                            try {
                                this.onDOMRemoved.call(this, {widget: this, element: element});
                            } catch (e) { console.error('Error calling this.onDOMRemoved(...)', e, element, this); }
                        },
                        autoRemove: true,
                    });
                } catch (e) {
                    console.error(e);
                    this.handleError(e);
                }
            }

        } catch (e) { console.error(e); }

    } // _registerOnDOMRemoved
    //--------------------------------------------

    get classIdentifier(): string { return N2.CLASS_IDENTIFIER; }

    /**
     * Return the N2 instances inside this model. Empty array if none. Never null
     * @param model
     * @return {N2[]} array of N2 or empty array. Never null
     */
    public static instances(model: any): N2[] {
        return (model && model[N2_CLASS] || []) as N2[];
    }

    /**
     * Returns the first N2 instance in the model passed in or null if there is none
     * @param model
     * @return {N2} the first N2 instance in the model passed in or null if there is none
     */
    public static instance(model: any): N2 {
        let array = N2.instances(model);
        return (array && array.length > 0 ? array[0] : null) as N2;
    }


} // N2

export interface N2Evt<WIDGET extends N2 = N2> {
    widget: WIDGET;
}

export interface N2Evt_OnHtml<WIDGET extends N2 = N2> extends N2Evt<WIDGET> {
}

export interface N2Evt_OnLogic<WIDGET extends N2 = N2> extends N2Evt<WIDGET> {
}


export interface N2Evt_Ref<EVENT_TYPE, WIDGET extends N2> {

    /**
     * The widget that the refresh was triggered on. Autofilled by the refresh method.
     */
    widget?: WIDGET;

    /**
     * The immediate parent widget that the refresh was triggered on
     * Null if the refresh is triggered at this level
     */
    parent?: N2;


    /**
     * The topContainer level widget that the refresh was triggered on
     * Null if the refresh is triggered at this level
     *
     */
    topParent?: N2;

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

export interface N2Evt_Destroy<WIDGET extends N2 = N2> extends N2Evt<WIDGET> {

    /**
     * Allows user to add either data or functions to be passed down the refresh chain.
     */
    extras?: any;

    /**
     * Properties that are filled in by the refresh method
     */
    ref?: N2Evt_Ref<N2Evt_Destroy, WIDGET>;

}

export interface N2Evt_BeforeLogic<WIDGET extends N2 = N2> extends N2Evt<WIDGET> {

    /**
     * If developer sets to true, the initLogic will not be called.
     */
    cancel: boolean;
}

export interface N2Evt_AfterLogic extends N2Evt {
}

export interface N2Evt_Resized extends N2Evt {
    size: { width: number; height: number; }
    lastSize: { width: number; height: number; }
    lastSizeEmpty: boolean;
    height_diff: number;
    width_diff: number;
}


export interface N2Evt_DomAdded<WIDGET extends N2 = N2> extends N2Evt<WIDGET> {
    /**
     * The HTMLElement of this widget that was added to the DOM
     */
    element: HTMLElement;
}

export interface N2Evt_DomRemoved<WIDGET extends N2 = N2> extends N2Evt<WIDGET> {
    /**
     * The HTMLElement of this widget that was removed from the DOM
     */
    element: HTMLElement;
}


themeChangeListeners().add((ev: ThemeChangeEvent) => {


    /* Targets .e-control elements that also have the N2.CLASS_IDENTIFIER class */
    /* Targets .e-control elements that are descendants of an element with the N2.CLASS_IDENTIFIER class */
    let cssContent = `
.e-control.${N2.CLASS_IDENTIFIER}, .${N2.CLASS_IDENTIFIER} .e-control {
    font-family: var(--app-font-family);    
}
`
//--------------- the following deals with N2 input components ----------
    cssContent += `
.${N2.CLASS_IDENTIFIER} .e-input-group input.e-input,
.${N2.CLASS_IDENTIFIER} .e-input-group.e-control-wrapper input.e-input,
.${N2.CLASS_IDENTIFIER} .e-input-group textarea.e-input,
.${N2.CLASS_IDENTIFIER} .e-input-group.e-control-wrapper textarea.e-input,
.e-input-group.${N2.CLASS_IDENTIFIER} input.e-input,
.e-input-group.e-control-wrapper.${N2.CLASS_IDENTIFIER} input.e-input,
.e-input-group.${N2.CLASS_IDENTIFIER} textarea.e-input,
.e-input-group.e-control-wrapper.${N2.CLASS_IDENTIFIER} textarea.e-input {
    font-family: var(--app-font-family) !important;
}

 /* For input elements and for textarea elements */
.${N2.CLASS_IDENTIFIER} input.e-input,
.${N2.CLASS_IDENTIFIER} .e-input-group input.e-input,
.${N2.CLASS_IDENTIFIER} .e-input-group.e-control-wrapper input.e-input,
input.e-input.${N2.CLASS_IDENTIFIER},
.e-input-group.${N2.CLASS_IDENTIFIER} input.e-input,
.e-input-group.e-control-wrapper.${N2.CLASS_IDENTIFIER} input.e-input,
.${N2.CLASS_IDENTIFIER} textarea.e-input,
.${N2.CLASS_IDENTIFIER} .e-input-group textarea.e-input,
.${N2.CLASS_IDENTIFIER} .e-input-group.e-control-wrapper textarea.e-input,
textarea.e-input.${N2.CLASS_IDENTIFIER},
.e-input-group.${N2.CLASS_IDENTIFIER} textarea.e-input,
.e-input-group.e-control-wrapper.${N2.CLASS_IDENTIFIER} textarea.e-input {
    padding-bottom: 1px;
}

/* float label inside the input element */
.${N2.CLASS_IDENTIFIER} .e-float-input:not(.e-input-focus):not(.e-disabled) input:not(:focus):not(:valid) ~ label.e-float-text:not(.e-label-top),
.e-float-input.${N2.CLASS_IDENTIFIER}:not(.e-input-focus):not(.e-disabled) input:not(:focus):not(:valid) ~ label.e-float-text:not(.e-label-top) {
    color: ${CSS_VARS_CORE.app_label_color_coolgray} !important;
}

/* change the border color while focus the input element */
.${N2.CLASS_IDENTIFIER} .e-float-input:not(.e-input-group) .e-float-line::before,
.${N2.CLASS_IDENTIFIER} .e-float-input:not(.e-input-group) .e-float-line::after,
.e-float-input.${N2.CLASS_IDENTIFIER}:not(.e-input-group) .e-float-line::before,
.e-float-input.${N2.CLASS_IDENTIFIER}:not(.e-input-group) .e-float-line::after {
    background: ${CSS_VARS_CORE.app_label_color_coolgray} !important;
}

/* float label color on top of the input element while focus the input */
.${N2.CLASS_IDENTIFIER} .e-float-input:not(.e-error) input:focus ~ label.e-float-text,
.e-float-input.${N2.CLASS_IDENTIFIER}:not(.e-error) input:focus ~ label.e-float-text {
    color: ${CSS_VARS_CORE.app_label_color_coolgray} !important;
    font-size: ${CSS_VARS_CORE.app_font_size_plus_2}px !important;
}

/* float label color on top of the input element */
.${N2.CLASS_IDENTIFIER} .e-float-input:not(.e-error) input:valid ~ label.e-float-text,
.e-float-input.${N2.CLASS_IDENTIFIER}:not(.e-error) input:valid ~ label.e-float-text {
    color: ${CSS_VARS_CORE.app_label_color_coolgray};
}
`;

// Add the CSS content to the default style element
    cssAdd(cssContent);


}); // normal priority