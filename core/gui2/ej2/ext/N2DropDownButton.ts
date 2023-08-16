import {DropDownButton, DropDownButtonModel} from "@syncfusion/ej2-splitbuttons";
import {StringArg, stringArgVal} from "../../../BaseUtils";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2DropDownButtonRef extends StateNx2EjBasicRef {
    widget?: N2DropDownButton;
}

export interface StateN2DropDownButton extends StateNx2EjBasic<DropDownButtonModel> {

    /**
     * function or string yielding the text or HTML that will overwrite the 'content' value of the DropDownButtonModel
     */
    label?: StringArg;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2DropDownButtonRef;
}

export class N2DropDownButton<STATE extends StateN2DropDownButton = StateN2DropDownButton> extends Nx2EjBasic<STATE, DropDownButton> {
    static readonly CLASS_IDENTIFIER: string = "N2DropDownButton"

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2DropDownButton.CLASS_IDENTIFIER);
    }


    onStateInitialized(state: STATE) {
        state.deco.tag = 'button';
        super.onStateInitialized(state);
    }

    onLogic(ev: Nx2Evt_OnLogic) {
        let state = this.state;
        if (state.label)
            state.ej.content = stringArgVal(state.label); // DropDownButton content label/ html

        super.onLogic(ev);
    }

    createEjObj(): void {
        this.obj = new DropDownButton(this.state.ej);
    }

    get classIdentifier() { return N2DropDownButton.CLASS_IDENTIFIER; }


}