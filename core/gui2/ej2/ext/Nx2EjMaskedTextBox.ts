import {MaskedTextBox, MaskedTextBoxModel} from "@syncfusion/ej2-inputs";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjMaskedTextBoxRef extends StateNx2EjBasicRef {
  widget ?: Nx2EjMaskedTextBox;
}

export interface StateNx2EjMaskedTextBox<WIDGET_LIBRARY_MODEL extends MaskedTextBoxModel = MaskedTextBoxModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateNx2EjMaskedTextBoxRef;
}

export class Nx2EjMaskedTextBox<STATE extends StateNx2EjMaskedTextBox = StateNx2EjMaskedTextBox> extends Nx2EjBasic<STATE,MaskedTextBox> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjMaskedTextBox');
    }


    protected onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        state.deco.otherAttr.type = 'text';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new MaskedTextBox(this.state.ej);
    }



}