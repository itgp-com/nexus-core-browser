import {Splitter, SplitterModel} from "@syncfusion/ej2-layouts";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjSplitterRef extends StateNx2EjBasicRef {
    widget?: Nx2EjSplitter;
}

export interface StateNx2EjSplitter extends StateNx2EjBasic<SplitterModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjSplitterRef;
} // state class

export class Nx2EjSplitter<STATE extends StateNx2EjSplitter = StateNx2EjSplitter> extends Nx2EjBasic<STATE, Splitter> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjSplitter');
    }

    onStateInitialized(state: STATE) {
        // if (!state.wrapper) {
        //     state.wrapper = {}; // must have a wrapper or else EJ2 will not work
        // }
        super.onStateInitialized(state);
    }

    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Splitter(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor);

    }
} // main class