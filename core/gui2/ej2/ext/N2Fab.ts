import {Fab, FabModel} from "@syncfusion/ej2-buttons";
import {StringArg, stringArgVal} from "../../../BaseUtils";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2FabRef extends StateNx2EjBasicRef {
    widget?: N2Fab;
}

export interface StateN2Fab extends StateNx2EjBasic<FabModel> {

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
    ref?: StateN2FabRef;
}

export class N2Fab<STATE extends StateN2Fab = StateN2Fab> extends Nx2EjBasic<STATE, Fab> {
    static readonly CLASS_IDENTIFIER: string = "N2Fab"

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2Fab.CLASS_IDENTIFIER);
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

    get classIdentifier() { return N2Fab.CLASS_IDENTIFIER; }

}