import {Component} from '@syncfusion/ej2-base';
import * as _ from 'lodash';
import {N2Evt_Destroy, N2Evt_OnHtml, N2Evt_OnLogic} from "../N2";
import {addN2Class} from '../N2HtmlDecorator';
import {createN2HtmlBasic, isN2} from "../N2Utils";
import {isEj2HtmlElement} from './Ej2Utils';
import {N2Ej, StateN2Ej, StateN2EjRef} from "./N2Ej";

export interface StateN2EjBasicRef extends StateN2EjRef{
    widget ?: N2EjBasic;
}

export interface StateN2EjBasic< WIDGET_LIBRARY_MODEL = any> extends StateN2Ej<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?:StateN2EjBasicRef


    /**
     * Allows the disabling of automatic appendTo call after instantiation an Ej2 Component
     * If false (default), appendEjToHtmlElement will be called automatically from inside onLogic(args)
     * If true, that call must be made manually by the developer
     */
    skipAppendEjToHtmlElement ?: boolean;
}


export abstract class N2EjBasic<STATE extends StateN2EjBasic = StateN2EjBasic, EJ2COMPONENT extends (Component<HTMLElement> | HTMLElement | any) = any> extends N2Ej<STATE, EJ2COMPONENT> {
    static readonly CLASS_IDENTIFIER: string = 'N2EjBasic';

    protected constructor(state?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2EjBasic.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }



    onHtml(args: N2Evt_OnHtml): HTMLElement {
        return createN2HtmlBasic<StateN2EjBasic>(this.state);
    }


    // onClear(args:N2Evt_OnClear): void {
    // }

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

        if ( this.obj && this.state.ej) {
            try {
                if ( (this.obj as any).destroy && typeof (this.obj as any).destroy === 'function')
                    (this.obj as any).destroy();
            } catch (_ignore) { }
        }

    } // onDestroy

    onLogic(args : N2Evt_OnLogic): void {
        this.createEjObj();
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
        if ( !this.htmlElementAnchor)
            return;
        if ( !this.obj)
            return;

        let fn = (this.obj as any).appendTo;
        if (_.isFunction(fn)) {
                //call the appendTo method of the ej2 component
                fn.call(this.obj, this.htmlElementAnchor); // this will initialize the htmlElement if needed
        }
    }

    /**
     * Returns true if appendTo was called (if there's at least an Ej2 component in htmlElementAnchor)
     * @return {boolean} true if appendTo was called
     */
    isAppendToCalled(): boolean {
        let called:boolean = false;
        if ( this.htmlElementAnchor && this.obj) {
            called = isEj2HtmlElement(this.htmlElementAnchor); // if there's an n2 in htmlElementAnchor, appendTo was called
        } // if ( this.htmlElementAnchor && this.obj)
        return called;
    } // isAppendToCalled

    get classIdentifier(): string {         return N2EjBasic.CLASS_IDENTIFIER;     }

}