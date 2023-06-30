import {ComboBox, ComboBoxModel} from "@syncfusion/ej2-dropdowns";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjComboBoxRef extends StateNx2EjBasicRef {
  widget ?: Nx2EjComboBox;
}

export interface StateNx2EjComboBox<WIDGET_LIBRARY_MODEL extends ComboBoxModel = ComboBoxModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateNx2EjComboBoxRef;
}

export class Nx2EjComboBox<STATE extends StateNx2EjComboBox = StateNx2EjComboBox> extends Nx2EjBasic<STATE,ComboBox> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjComboBox');
    }


    protected onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        state.deco.otherAttr.type = 'text';
        super.onStateInitialized(state);
    }

    protected createEjObj(): void {
        this.obj = new ComboBox(this.state.ej);
    }

    protected appendEjToHtmlElement(): void {
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }

}