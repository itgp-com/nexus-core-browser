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

export interface StateN2Ej<WIDGET_LIBRARY_MODEL = any> extends StateN2 {
    ej?: WIDGET_LIBRARY_MODEL;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2EjRef


    /**
     * Allows the disabling of automatic appendTo call after instantiation an Ej2 Component
     * If false (default), appendEjToHtmlElement will be called automatically from inside onLogic(args)
     * If true, that call must be made manually by the developer
     */
    skipAppendEjToHtmlElement?: boolean;
}

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
    }

    get classIdentifier(): string { return N2Ej.CLASS_IDENTIFIER; }


    onLogic(args: N2Evt_OnLogic): void {
        this.createEjObj();
        if (this.obj)
            this.obj[N2_CLASS] = this; // tag the object with the N2 instance
        if (!this.state.skipAppendEjToHtmlElement) {
            this.appendEjToHtmlElement();
        }
    }


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
                this.obj[N2_CLASS] = null; // untag the object with the N2 instance
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
            if (!ejInstances)
                return; // nothing to untag

            // At this point state.ej.ejInstances is an array that is guaranteed to exist (empty or not)

            const index = ejInstances.indexOf(ejInstance);
            if (index !== -1) {
                ejInstances.splice(index, 1); // actually remove the instance from the array
            }

        } catch (e) {
            console.error('Error tagging ej2 component', e);
        }
    } // untagEjWithEJComponent

}