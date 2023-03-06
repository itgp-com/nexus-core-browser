import {Nx2EjBasic} from "../ej2/Nx2EjBasic";
import {Nx2Evt_OnHtml} from "../Nx2";
import {StateNx2, StateNx2Ref} from "../StateNx2";

export interface StateNx2FormRef extends StateNx2Ref{
    widget ?: Nx2Form;
}

export interface StateNx2Form extends StateNx2 {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateNx2FormRef;
}

export class Nx2Form<STATE extends StateNx2Form = StateNx2Form> extends Nx2EjBasic<STATE> {
    constructor(state: STATE) {
        super(state);
    }

    onHtml(args: Nx2Evt_OnHtml): HTMLElement {
        let state = this.state;
        state.deco.tag = 'form';
        return super.onHtml(args);
    } // onHtml

}