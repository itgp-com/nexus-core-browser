import {SpeedDial, SpeedDialModel} from "@syncfusion/ej2-buttons";
import {StringArg, stringArgVal} from "../../../BaseUtils";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2SpeedDialRef extends StateNx2EjBasicRef {
    widget?: N2SpeedDial;
}

export interface StateN2SpeedDial extends StateNx2EjBasic<SpeedDialModel> {

    /**
     * function or string yielding the text or HTML that will overwrite the 'content' value of the SpeedDialModel
     */
    label?: StringArg;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2SpeedDialRef;
}

export class N2SpeedDial<STATE extends StateN2SpeedDial = StateN2SpeedDial> extends Nx2EjBasic<STATE, SpeedDial> {
    static readonly CLASS_IDENTIFIER: string = "N2SpeedDial";

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2SpeedDial.CLASS_IDENTIFIER);
    }


    onStateInitialized(state: STATE) {
        state.deco.tag = 'button';
        super.onStateInitialized(state);
    }

    onLogic(ev: Nx2Evt_OnLogic) {
        let state = this.state;
        if (state.label)
            state.ej.content = stringArgVal(state.label); // SpeedDial content label/ html

        super.onLogic(ev);


    }

    createEjObj(): void {
        this.obj = new SpeedDial(this.state.ej);
    }

    get classIdentifier(): string { return N2SpeedDial.CLASS_IDENTIFIER; }

}