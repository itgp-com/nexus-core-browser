import {RadioButton, RadioButtonModel} from "@syncfusion/ej2-buttons";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjRadioButtonRef extends StateNx2EjBasicRef {
    widget?: Nx2EjRadioButton;
}

export interface StateNx2EjRadioButton extends StateNx2EjBasic<RadioButtonModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjRadioButtonRef;
} // state class

export class Nx2EjRadioButton<STATE extends StateNx2EjRadioButton = StateNx2EjRadioButton> extends Nx2EjBasic<STATE, RadioButton> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjRadioButton');
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        state.deco.otherAttr['type'] = 'radio';
        super.onStateInitialized(state);
    }

    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new RadioButton(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor);

    }
} // main class