import {ComboBox, ComboBoxModel} from "@syncfusion/ej2-dropdowns";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2ComboBoxRef extends StateNx2EjBasicRef {
    widget?: N2ComboBox;
}

export interface StateN2ComboBox<WIDGET_LIBRARY_MODEL extends ComboBoxModel = ComboBoxModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ComboBoxRef;
}

export class N2ComboBox<STATE extends StateN2ComboBox = StateN2ComboBox> extends Nx2EjBasic<STATE, ComboBox> {
    static readonly CLASS_IDENTIFIER: string = "N2ComboBox"

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2ComboBox.CLASS_IDENTIFIER);
    }


    protected onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        state.deco.otherAttr.type = 'text';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new ComboBox(this.state.ej);
    }

    get classIdentifier() {
        return N2ComboBox.CLASS_IDENTIFIER;
    }


}