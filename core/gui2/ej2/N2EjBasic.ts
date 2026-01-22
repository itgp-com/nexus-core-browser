import {Component} from '@syncfusion/ej2-base';
import {N2Evt_OnHtml} from "../N2";
import {addN2Class} from '../N2HtmlDecorator';
import {createN2HtmlBasic} from "../N2Utils";
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
}


export abstract class N2EjBasic<STATE extends StateN2EjBasic = StateN2EjBasic, EJ2COMPONENT extends (Component<HTMLElement> | HTMLElement | any) = any>
    extends N2Ej<STATE, EJ2COMPONENT> {

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

    get classIdentifier(): string {         return N2EjBasic.CLASS_IDENTIFIER;     }

}