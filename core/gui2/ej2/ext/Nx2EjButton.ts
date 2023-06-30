import {Button, ButtonModel} from "@syncfusion/ej2-buttons";
import {StringArg, stringArgVal} from "../../../BaseUtils";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjButtonRef extends StateNx2EjBasicRef {
    widget?: Nx2EjButton;
}

export interface StateNx2EjButton extends StateNx2EjBasic<ButtonModel> {

    /**
     * function or string yielding the text or HTML that will overwrite the 'content' value of the ButtonModel
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
    ref?: StateNx2EjButtonRef;
}

export class Nx2EjButton<STATE extends StateNx2EjButton = StateNx2EjButton> extends Nx2EjBasic<STATE, Button> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjButton');
    }


    onStateInitialized(state: STATE) {
        state.deco.tag = 'button';
        state.deco.otherAttr['type'] = 'button';
        super.onStateInitialized(state);
    }

    onLogic(ev: Nx2Evt_OnLogic) {
        let state = this.state;
        if (state.label)
            state.ej.content = stringArgVal(state.label); // Button content label/ html

        super.onLogic(ev);

        // attach the onclick event to the htmlElementAnchor
        if (this.state.onclick)
            this.htmlElementAnchor.onclick = this.state.onclick;

    }

    protected createEjObj(): void {
        this.obj = new Button(this.state.ej);
    }

    protected appendEjToHtmlElement(): void {
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }


}