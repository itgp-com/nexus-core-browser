import {Fab, FabModel} from "@syncfusion/ej2-buttons";
import {StringArg, stringArgVal} from "../../../BaseUtils";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjFabRef extends StateNx2EjBasicRef {
    widget?: Nx2EjFab;
}

export interface StateNx2EjFab extends StateNx2EjBasic<FabModel> {

    /**
     * function or string yielding the text or HTML that will overwrite the 'content' value of the FabModel
     */
    label?: StringArg;

    /**
     * implement the onClick behavior of the button
     */
    onclick?: (ev: MouseEvent) => void;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjFabRef;
}

export class Nx2EjFab<STATE extends StateNx2EjFab = StateNx2EjFab> extends Nx2EjBasic<STATE, Fab> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjFab');
    }


    onStateInitialized(state: STATE) {
        state.deco.tag = 'button';
        super.onStateInitialized(state);
    }

    onLogic(ev: Nx2Evt_OnLogic) {
        let state = this.state;
        if (state.label)
            state.ej.content = stringArgVal(state.label); // Fab content label/ html

        super.onLogic(ev);

        // attach the onclick event to the htmlElementAnchor
        if (this.state.onclick)
            this.htmlElementAnchor.onclick = this.state.onclick;

    }

    createEjObj(): void {
        this.obj = new Fab(this.state.ej);
    }




}