import {SplitButton, SplitButtonModel} from "@syncfusion/ej2-splitbuttons";
import {StringArg, stringArgVal} from "../../../BaseUtils";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjSplitButtonRef extends StateNx2EjBasicRef {
    widget?: Nx2EjSplitButton;
}

export interface StateNx2EjSplitButton extends StateNx2EjBasic<SplitButtonModel> {

    /**
     * function or string yielding the text or HTML that will overwrite the 'content' value of the SplitButtonModel
     */
    label?: StringArg;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjSplitButtonRef;
}

export class Nx2EjSplitButton<STATE extends StateNx2EjSplitButton = StateNx2EjSplitButton> extends Nx2EjBasic<STATE, SplitButton> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjSplitButton');
    }


    onStateInitialized(state: STATE) {
        state.deco.tag = 'button';
        super.onStateInitialized(state);
    }

    onLogic(ev: Nx2Evt_OnLogic) {
        let state = this.state;
        if (state.label)
            state.ej.content = stringArgVal(state.label); // SplitButton content label/ html

        super.onLogic(ev);


    }
    createEjObj(): void {
        this.obj = new SplitButton(this.state.ej);
    }




}