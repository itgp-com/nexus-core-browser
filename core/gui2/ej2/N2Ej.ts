import {Component} from "@syncfusion/ej2-base";
import * as _ from 'lodash';
import {EJINSTANCES, N2_CLASS} from '../../Constants';
import {N2, N2Evt_Destroy, N2Evt_OnLogic} from "../N2";
import {addN2Class} from '../N2HtmlDecorator';
import {isN2} from '../N2Utils';
import {StateN2, StateN2Ref} from "../StateN2";
import {isEj2HtmlElement} from './Ej2Utils';

export interface StateN2EjRef extends StateN2Ref {
    widget?: N2Ej;
}

export interface N2Evt_onEjObj<W extends N2Ej = N2Ej> { widget: W; }

/**
 * State interface for EJ2-wrapping N2 widgets. Extends {@link StateN2} with the
 * Syncfusion component model (`ej`) and EJ2-specific configuration.
 *
 * ## The `ej` property
 *
 * `state.ej` holds the **Syncfusion model object** — e.g. `GridModel`, `ButtonModel`,
 * `DialogModel`, `TextBoxModel`.  When `createEjObj()` runs, this object is passed
 * directly to the Syncfusion component constructor:
 *
 * ```typescript
 * // Inside createEjObj():
 * this.obj = new Grid(this.state.ej);   // state.ej is the GridModel
 * ```
 *
 * Modifications to `state.ej` made **before** `initLogic()` runs will take
 * effect on the created component.  After the component is created, the live
 * Syncfusion instance is available as `this.obj` and can be manipulated directly.
 *
 * ## The `ejInstances` tagging system
 *
 * When `this.obj` is assigned, the EJ2 instance is automatically tagged on
 * `state.ej` under two keys:
 *
 * - `state.ej['ejInstances']` — array of ALL EJ2 component instances created from this model.
 *   Retrieved via `N2Ej.ejInstances(ejModel)`.
 * - `state.ej['_n2_']` — array of ALL N2 widget instances referencing this model.
 *   Retrieved via `N2.instances(model)`.
 *
 * This allows navigating model→instance(s) and instance→model.
 *
 * @typeParam WIDGET_LIBRARY_MODEL - The Syncfusion model type (e.g. `GridModel`, `ButtonModel`)
 */
export interface StateN2Ej<WIDGET_LIBRARY_MODEL = any> extends StateN2 {
    /**
     * The Syncfusion component model. Passed to the EJ2 constructor during `createEjObj()`.
     * Properties set here configure the Syncfusion component (columns, dataSource, width, etc.).
     */
    ej?: WIDGET_LIBRARY_MODEL;

    /**
     * Override with specific type used in code completion.
     * Contains all the fields that have references to this instance and are usually
     * created by the widget initialization code.
     */
    ref?: StateN2EjRef


    /**
     * When false (default), `appendEjToHtmlElement()` is called automatically from
     * inside `onLogic()` after the EJ2 component is created.
     * When true, the developer must call `appendEjToHtmlElement()` manually.
     */
    skipAppendEjToHtmlElement?: boolean;

    /**
     * Listener(s) that fire at the end of `onLogic()` after the EJ2 object is
     * created (and appended, unless `skipAppendEjToHtmlElement` is true).
     *
     * Accepts a single function or an array of functions. Each receives an event
     * object with `{ widget: N2Ej_instance }`.
     *
     * Use this to perform post-creation setup that needs the live EJ2 component.
     */
    onEjObj?: ((ev: N2Evt_onEjObj) => void) | Array<(ev: N2Evt_onEjObj) => void>;

    /**
     * Registers an additional `onEjObj` listener at runtime. Initialised automatically
     * by `N2Ej._constructor`.
     */
    addOnEjObjListener?: (listener: (ev: N2Evt_onEjObj) => void) => void;
}

/**
 * Abstract base for all N2 widgets that wrap a Syncfusion Essential JS 2 (EJ2) component.
 * Extends {@link N2} with EJ2-specific lifecycle steps: `createEjObj()`, automatic
 * `appendTo`, and bi-directional tagging between the state model and the EJ2 instance.
 *
 * ## Key additions over N2
 *
 * - `state.ej` — holds the Syncfusion **model** (e.g. `GridModel`, `ButtonModel`).
 *   This is what gets passed to the Syncfusion component constructor.
 * - `this.obj` — the **live Syncfusion component instance** (e.g. `Grid`, `Button`).
 * - `createEjObj()` — abstract; subclasses instantiate the Syncfusion component here.
 * - `appendEjToHtmlElement()` — calls `obj.appendTo(htmlElementAnchor)` automatically
 *   (unless `state.skipAppendEjToHtmlElement` is true).
 *
 * ## onLogic flow (implemented here, called by N2.initLogic)
 *
 * ```
 * createEjObj()                       ← subclass instantiates the EJ2 component
 * obj[N2_CLASS] = this                ← tag the EJ2 instance → back to N2 widget
 * if !skipAppend: appendEjToHtmlElement()  ← obj.appendTo(htmlElementAnchor)
 * fire state.onEjObj listeners        ← notify listeners the EJ2 obj is ready
 * ```
 *
 * ## Model↔instance tagging
 *
 * When `obj` is set, `tagEjWithEJComponent` stores:
 * - `state.ej['ejInstances']` — array of EJ2 component instances created from this model
 * - `state.ej['_n2_']` — array of N2 widget instances referencing this model
 *
 * These can be retrieved with the static helpers:
 * - `N2Ej.ejInstances(ejModel)` → array of EJ2 components
 * - `N2Ej.ejInstance(ejModel)` → first EJ2 component or null
 * - `N2.instances(model)` → array of N2 widgets (inherited from N2)
 *
 * @typeParam STATE - State type extending {@link StateN2Ej}
 * @typeParam EJ2COMPONENT - The Syncfusion Component subclass (e.g. `Grid`, `Button`, `Dialog`)
 */
export abstract class N2Ej<STATE extends StateN2Ej = StateN2Ej, EJ2COMPONENT extends (Component<HTMLElement> | HTMLElement | any) = any>
    extends N2<STATE, EJ2COMPONENT> {
    static readonly CLASS_IDENTIFIER: string = 'N2Ej';


    protected constructor(state ?: STATE) {
        super(state);
    }


    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2Ej.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }


    protected _constructor(state ?: STATE) {
        state = state || {} as STATE;
        state.ej = state.ej || {};
        super._constructor(state);

        // Initialize onEjObj listener support without requiring interface changes
        try {
            const st: any = state as any;
            // Normalize existing onEjObj into an array of functions
            let listeners: Function[] = [];
            const existing = st.onEjObj;
            if (existing) {
                if (Array.isArray(existing)) {
                    listeners = existing.filter((fn: any) => typeof fn === 'function');
                } else if (typeof existing === 'function') {
                    listeners = [existing];
                }
            }
            st.onEjObj = listeners; // ensure it's an array going forward

            // Provide a registration helper on the state
            if (typeof st.addOnEjObjListener !== 'function') {
                st.addOnEjObjListener = (listener: (ev: N2Evt_onEjObj) => void) => {
                    try {
                        if (!st.onEjObj || !Array.isArray(st.onEjObj)) st.onEjObj = [];
                        if (typeof listener === 'function') st.onEjObj.push(listener);
                    } catch (e) { console.error(e); }
                };
            }
        } catch (e) { console.error(e); }
    }

    get classIdentifier(): string { return N2Ej.CLASS_IDENTIFIER; }


    /**
     * Called by `onLogic()` to execute the EJ2-specific logic. Default implementation:
     *
     * 1. `createEjObj()` — instantiate the Syncfusion component
     * 2. Tag the EJ2 instance with `this` (the N2 widget)
     * 3. If `state.skipAppendEjToHtmlElement` is NOT true, call `appendEjToHtmlElement()`
     *    which calls `obj.appendTo(this.htmlElementAnchor)`
     * 4. Fire all `state.onEjObj` listeners
     *
     * Override to add custom logic before or after the EJ2 creation. Call
     * `super.onLogic(args)` at the appropriate point (typically after your setup).
     */
    onLogic(args: N2Evt_OnLogic): void {
        this.createEjObj();
        if (this.obj)
            (this.obj as any)[N2_CLASS] = this; // tag the object with the N2 instance
        if (!this.state.skipAppendEjToHtmlElement) {
            this.appendEjToHtmlElement();
        }

        // Fire onEjObj listeners at the very end
        try {
            const st: any = this.state as any;
            const listeners = st?.onEjObj;
            const ev:N2Evt_onEjObj = { widget: this };
            if (Array.isArray(listeners)) {
                listeners.forEach((fn: any) => {
                    try { if (typeof fn === 'function') fn(ev); } catch (e) { console.error(e); }
                });
            } else if (typeof listeners === 'function') {
                try { listeners(ev); } catch (e) { console.error(e); }
            }
        } catch (e) { console.error(e); }
    } // onLogic


    /**
     * Instantiate the Syncfusion EJ2 component and assign it to `this.obj`.
     *
     * This is the **only** method that MUST be implemented by every EJ2 widget subclass.
     *
     * ## Implementation pattern
     *
     * ```typescript
     * createEjObj(): void {
     *     this.obj = new SyncfusionComponent(this.state.ej);
     * }
     * ```
     *
     * The `state.ej` object is the Syncfusion model (e.g. `GridModel`, `ButtonModel`)
     * and is passed directly to the Syncfusion constructor. After this method returns,
     * the base `onLogic` automatically:
     * - Tags the EJ2 instance with the N2 widget (`obj['_n2_'] = this`)
     * - Calls `appendEjToHtmlElement()` (unless `state.skipAppendEjToHtmlElement`)
     * - Fires `state.onEjObj` listeners
     */
    abstract createEjObj(): void ;

    /**
     * Append the ej2 component to the htmlElementAnchor
     * Default implementation calls the appendTo method of the ej2 component
     *
     * <code> this.obj.appendTo(this.htmlElementAnchor);</code>
     */
    appendEjToHtmlElement(): void {
        if (!this.htmlElementAnchor)
            return;
        if (!this.obj)
            return;

        let fn = (this.obj as any).appendTo;
        if (_.isFunction(fn)) {
            //call the appendTo method of the ej2 component
            fn.call(this.obj, this.htmlElementAnchor); // this will initialize the htmlElement if needed
        }
    }

    onDestroy(args: N2Evt_Destroy): void {
        if (this.state.children) {
            this.state.children.forEach(child => {
                try {
                    if (child && isN2(child))
                        child.destroy();
                } catch (e) {
                    console.error('Error destroying child', e);
                }
            });
        }

        if (this.obj && this.state.ej) {
            try {
                this.untagEjWithEJComponent(this.obj); // all exceptions are caught inside untagEjWithEJComponent but just in case it's overridden we add the try/catch
                (this.obj as any)[N2_CLASS] = null; // untag the object with the N2 instance
            } catch (_ignore) { }
            try {
                if ((this.obj as any).destroy && typeof (this.obj as any).destroy === 'function')
                    (this.obj as any).destroy();
            } catch (_ignore) { }
        }

    } // onDestroy


    get obj(): EJ2COMPONENT {
        // this is needed here because without it, it does not default to N2.obj but rather is undefined when set is the only method defined here
        return super.obj;
    }

    // overwrite N2 set obj
    set obj(value: EJ2COMPONENT) {
        super.obj = value;
        this.tagEjWithEJComponent(value);
    } // set obj


    /**
     * Returns true if appendTo was called (if there's at least an Ej2 component in htmlElementAnchor)
     * @return {boolean} true if appendTo was called
     */
    isAppendToCalled(): boolean {
        let called: boolean = false;
        if (this.htmlElementAnchor && this.obj) {
            called = isEj2HtmlElement(this.htmlElementAnchor); // if there's an n2 in htmlElementAnchor, appendTo was called
        } // if ( this.htmlElementAnchor && this.obj)
        return called;
    } // isAppendToCalled

    tagEjWithEJComponent(ejInstance: EJ2COMPONENT): void {
        try {
            if (!ejInstance)
                return;

            let state: STATE = this.state;
            if (!state)
                return; // unlikely, but who knows...

            // Get ej value. Initialize ej in state if it doesn't exist
            let ej: any = state.ej;
            if (!ej) {
                ej = {};
                state.ej = ej;
            }

            // Get ejInstances value. Initialize ejInstances in ej if the array doesn't exist
            let ejInstances: EJ2COMPONENT[] = ej[EJINSTANCES];
            if (!ejInstances) {
                ejInstances = [];
                ej[EJINSTANCES] = ejInstances;
            }

            // At this point state.ej.ejInstances is an array that is guaranteed to exist (empty or not)

            // Check if the instance is not already in the array
            if (!ejInstances.includes(ejInstance)) {
                // Only add if not in array already
                ejInstances.push(ejInstance); // actually add the instance to the array
            }

             // ----------- Now Tag with N2 instances ----------

            let n2Instances: N2[] = ej[N2_CLASS];
            if (!n2Instances) {
                n2Instances = [];
                ej[N2_CLASS] = n2Instances;
            }

            // At this point state.ej.n2Instances is an array that is guaranteed to exist (empty or not)
            // Check if the instance is not already in the array
            if (!n2Instances.includes(this)) {
                // Only add if not in array already
                n2Instances.push(this); // actually add the instance to the array
            }

        } catch (e) {
            console.error('Error tagging ej2 component', e);
        }
    } // tagEjWithEJComponent

    untagEjWithEJComponent(ejInstance: EJ2COMPONENT): void {
        try {
            if (!ejInstance)
                return;

            let state: STATE = this.state;
            if (!state)
                return; // unlikely, but who knows...

            // Get ej value. Initialize ej in state if it doesn't exist
            let ej: any = state.ej;
            if (!ej)
                return; // nothing to untag

            // Get ejInstances value. Initialize ejInstances in ej if the array doesn't exist
            let ejInstances: EJ2COMPONENT[] = ej[EJINSTANCES];
            if (ejInstances) {

                // At this point state.ej.ejInstances is an array that is guaranteed to exist (empty or not)

                const index = ejInstances.indexOf(ejInstance);
                if (index !== -1) {
                    ejInstances.splice(index, 1); // actually remove the instance from the array
                }
            }

            // ----------- Now Untag with N2 instances ----------
            let n2Instances: N2[] = ej[N2_CLASS];
            if (!n2Instances)
                return; // nothing to untag

            const index = n2Instances.indexOf(this);
            if (index !== -1) {
                n2Instances.splice(index, 1); // actually remove the instance from the array
            }


        } catch (e) {
            console.error('Error tagging ej2 component', e);
        }
    } // untagEjWithEJComponent


    /**
     * Returns an array of all the EJ2 instances in the model passed in as an array
     * @param ejModel the EJ model instance
     * @return {EJ2COMPONENT[]} an array of all the EJ2 instances i(or a blank array, never null)
     */
    public static ejInstances<EJ2COMPONENT extends (Component<HTMLElement> | HTMLElement | any) >(ejModel:any): EJ2COMPONENT[] {
        return (ejModel && ejModel[EJINSTANCES] || [] )as EJ2COMPONENT[];
    }

    /**
     * Returns the first EJ2 instance in the model passed in or null if there are none
     * @param ejModel EJ model instance
     * @return {EJ2COMPONENT} the first EJ2 instance in the model passed in or null if there are none
     */
    public static ejInstance<EJ2COMPONENT extends (Component<HTMLElement> | HTMLElement | any) >(ejModel:any): EJ2COMPONENT {
        let array = N2Ej.ejInstances(ejModel);
        return (array && array.length > 0 ? array[0] : null) as EJ2COMPONENT;
    }
}