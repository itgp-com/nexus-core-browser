import {Component} from '@syncfusion/ej2-base';
import * as _ from 'lodash';
import {Nx2Evt_Destroy, Nx2Evt_OnHtml, Nx2Evt_OnLogic} from "../Nx2";
import {addNx2Class} from '../Nx2HtmlDecorator';
import {createNx2HtmlBasic, isNx2} from "../Nx2Utils";
import {isEj2HtmlElement} from './Ej2Utils';
import {Nx2Ej, StateNx2Ej, StateNx2EjRef} from "./Nx2Ej";

export interface StateNx2EjBasicRef extends StateNx2EjRef{
    widget ?: Nx2EjBasic;
}

export interface StateNx2EjBasic< WIDGET_LIBRARY_MODEL = any> extends StateNx2Ej<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?:StateNx2EjBasicRef


    /**
     * Allows the disabling of automatic appendTo call after instantiation an Ej2 Component
     * If false (default), appendEjToHtmlElement will be called automatically from inside onLogic(args)
     * If true, that call must be made manually by the developer
     */
    skipAppendEjToHtmlElement ?: boolean;
}


export abstract class Nx2EjBasic<STATE extends StateNx2EjBasic = StateNx2EjBasic, EJ2COMPONENT extends (Component<HTMLElement> | HTMLElement | any) = any> extends Nx2Ej<STATE, EJ2COMPONENT> {

    protected constructor(state?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjBasic');
    }


    onHtml(args: Nx2Evt_OnHtml): HTMLElement {
        return createNx2HtmlBasic<StateNx2EjBasic>(this.state);
    }


    // onClear(args:Nx2Evt_OnClear): void {
    // }

    onDestroy(args: Nx2Evt_Destroy): void {
        if (this.state.children) {
            this.state.children.forEach(child => {
                try {
                    if (child && isNx2(child))
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

    onLogic(args : Nx2Evt_OnLogic): void {
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
            called = isEj2HtmlElement(this.htmlElementAnchor); // if there's an nx2 in htmlElementAnchor, appendTo was called
        } // if ( this.htmlElementAnchor && this.obj)
        return called;
    } // isAppendToCalled

}