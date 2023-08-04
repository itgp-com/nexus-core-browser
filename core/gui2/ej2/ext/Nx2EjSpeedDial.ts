import {SpeedDial, SpeedDialModel} from "@syncfusion/ej2-buttons";
import {StringArg, stringArgVal} from "../../../BaseUtils";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjSpeedDialRef extends StateNx2EjBasicRef {
    widget?: Nx2EjSpeedDial;
}

export interface StateNx2EjSpeedDial extends StateNx2EjBasic<SpeedDialModel> {

    /**
     * function or string yielding the text or HTML that will overwrite the 'content' value of the SpeedDialModel
     */
    label?: StringArg;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjSpeedDialRef;
}

export class Nx2EjSpeedDial<STATE extends StateNx2EjSpeedDial = StateNx2EjSpeedDial> extends Nx2EjBasic<STATE, SpeedDial> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjSpeedDial');
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




}