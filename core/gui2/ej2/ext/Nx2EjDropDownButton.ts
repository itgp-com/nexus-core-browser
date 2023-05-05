import {DropDownButton, DropDownButtonModel} from "@syncfusion/ej2-splitbuttons";
import {StringArg, stringArgVal} from "../../../BaseUtils";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjDropDownButtonRef extends StateNx2EjBasicRef {
    widget?: Nx2EjDropDownButton;
}

export interface StateNx2EjDropDownButton extends StateNx2EjBasic<DropDownButtonModel> {

    /**
     * function or string yielding the text or HTML that will overwrite the 'content' value of the DropDownButtonModel
     */
    label?: StringArg;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjDropDownButtonRef;
}

export class Nx2EjDropDownButton<STATE extends StateNx2EjDropDownButton = StateNx2EjDropDownButton> extends Nx2EjBasic<STATE, DropDownButton> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjDropDownButton');
    }


    onStateInitialized(state: STATE) {
        state.deco.tag = 'button';
        super.onStateInitialized(state);
    }

    onLogic(args: Nx2Evt_OnLogic) {
        let state = this.state;
        if (state.label)
            state.ej.content = stringArgVal(state.label); // DropDownButton content label/ html

        this.obj = new DropDownButton(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor);


    }

}