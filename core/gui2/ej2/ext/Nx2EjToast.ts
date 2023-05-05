import {Toast, ToastModel} from "@syncfusion/ej2-notifications";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjToastRef extends StateNx2EjBasicRef {
    widget?: Nx2EjToast;
}

export interface StateNx2EjToast<WIDGET_LIBRARY_MODEL extends ToastModel = ToastModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjToastRef;
}

export class Nx2EjToast<STATE extends StateNx2EjToast = StateNx2EjToast> extends Nx2EjBasic<STATE, Toast> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjToast');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Toast(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}