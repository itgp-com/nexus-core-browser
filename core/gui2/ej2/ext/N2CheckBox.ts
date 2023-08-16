import {CheckBox, CheckBoxModel} from "@syncfusion/ej2-buttons";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2CheckBoxRef extends StateNx2EjBasicRef {
    widget?: N2CheckBox;
}

export interface StateN2CheckBox extends StateNx2EjBasic<CheckBoxModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2CheckBoxRef;
} // state class

export class N2CheckBox<STATE extends StateN2CheckBox = StateN2CheckBox> extends Nx2EjBasic<STATE, CheckBox> {
    static readonly CLASS_IDENTIFIER: string = "N2CheckBox"
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2CheckBox.CLASS_IDENTIFIER);
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        state.deco.otherAttr['type'] = 'checkbox';
        if (!state.wrapper) {
            state.wrapper = {}; // must have a wrapper or else EJ2 will not work
        }
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new CheckBox(this.state.ej);
    }

    get classIdentifier() {
        return N2CheckBox.CLASS_IDENTIFIER;
    }


} // main class