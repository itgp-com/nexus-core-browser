import {Component} from '@syncfusion/ej2-base';
import {Nx2Evt_Destroy, Nx2Evt_OnHtml, Nx2Evt_OnLogic} from "../Nx2";
import {createNx2HtmlBasic} from "../Nx2Utils";
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
}


export abstract class Nx2EjBasic<STATE extends StateNx2EjBasic = StateNx2EjBasic, EJ2COMPONENT extends (Component<HTMLElement> | HTMLElement | any) = any> extends Nx2Ej<STATE, EJ2COMPONENT> {

    protected constructor(state: STATE) {
        super(state);
    }


    onHtml(args: Nx2Evt_OnHtml): HTMLElement {
        return createNx2HtmlBasic<StateNx2EjBasic>(this.state);
    }


    // onClear(args:Nx2Evt_OnClear): void {
    // }

    onDestroy(args: Nx2Evt_Destroy): void {
    }

    onLogic(args : Nx2Evt_OnLogic): void {
    }
    //
    // onRefresh(args:Nx2Evt_Refresh): void {
    // }


}