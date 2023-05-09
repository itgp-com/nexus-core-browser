import {ListBox, ListBoxModel} from "@syncfusion/ej2-dropdowns";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjListBoxRef extends StateNx2EjBasicRef {
    widget?: Nx2EjListBox;
}

export interface StateNx2EjListBox extends StateNx2EjBasic<ListBoxModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjListBoxRef;
} // state class

export class Nx2EjListBox<STATE extends StateNx2EjListBox = StateNx2EjListBox> extends Nx2EjBasic<STATE, ListBox> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjListBox');
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        super.onStateInitialized(state);
    }

    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new ListBox(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor);

    }
} // main class