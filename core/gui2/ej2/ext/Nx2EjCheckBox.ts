import {CheckBox, CheckBoxModel} from "@syncfusion/ej2-buttons";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjCheckBoxRef extends StateNx2EjBasicRef {
    widget?: Nx2EjCheckBox;
}

export interface StateNx2EjCheckBox extends StateNx2EjBasic<CheckBoxModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjCheckBoxRef;
} // state class

export class Nx2EjCheckBox<STATE extends StateNx2EjCheckBox = StateNx2EjCheckBox> extends Nx2EjBasic<STATE, CheckBox> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjCheckBox');
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        state.deco.otherAttr['type'] = 'checkbox';
        if (!state.wrapper) {
            state.wrapper = {}; // must have a wrapper or else EJ2 will not work
        }
        super.onStateInitialized(state);
    }

    protected createEjObj(): void {
        this.obj = new CheckBox(this.state.ej);
    }

    protected appendEjToHtmlElement(): void {
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }

} // main class