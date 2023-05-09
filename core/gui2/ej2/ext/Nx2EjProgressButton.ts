import {ProgressButton, ProgressButtonModel} from "@syncfusion/ej2-splitbuttons";
import {StringArg, stringArgVal} from "../../../BaseUtils";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjProgressButtonRef extends StateNx2EjBasicRef {
    widget?: Nx2EjProgressButton;
}

export interface StateNx2EjProgressButton extends StateNx2EjBasic<ProgressButtonModel> {

    /**
     * function or string yielding the text or HTML that will overwrite the 'content' value of the ProgressButtonModel
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
    ref?: StateNx2EjProgressButtonRef;
}

export class Nx2EjProgressButton<STATE extends StateNx2EjProgressButton = StateNx2EjProgressButton> extends Nx2EjBasic<STATE, ProgressButton> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjProgressButton');
    }


    onStateInitialized(state: STATE) {
        state.deco.tag = 'button';
        super.onStateInitialized(state);
    }

    onLogic(args: Nx2Evt_OnLogic) {
        let state = this.state;
        if (state.label)
            state.ej.content = stringArgVal(state.label); // ProgressButton content label/ html

        this.obj = new ProgressButton(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor);

        // attach the onclick event to the htmlElementAnchor
        if (this.state.onclick)
            this.htmlElementAnchor.onclick = this.state.onclick;


    }

}