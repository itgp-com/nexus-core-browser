import {AutoComplete, AutoCompleteModel} from "@syncfusion/ej2-dropdowns";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjAutoCompleteRef extends StateNx2EjBasicRef {
    widget?: Nx2EjAutoComplete;
}

export interface StateNx2EjAutoComplete<WIDGET_LIBRARY_MODEL extends AutoCompleteModel = AutoCompleteModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjAutoCompleteRef;
}

export class Nx2EjAutoComplete<STATE extends StateNx2EjAutoComplete = StateNx2EjAutoComplete> extends Nx2EjBasic<STATE, AutoComplete> {
    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        state.deco.tag = 'input'; // AutoComplete requires a header tag
        super.onStateInitialized(state);
    }

    onLogic(args: Nx2Evt_OnLogic) {

        super.onLogic(args);

        this.obj = new AutoComplete(this.state.ej);
        this.obj.appendTo(this.htmlElement); // this will initialize the htmlElement if needed
        this.htmlElement.classList.add('Nx2EjAutoComplete');
    }
}