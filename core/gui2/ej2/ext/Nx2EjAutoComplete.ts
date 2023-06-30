import {AutoComplete, AutoCompleteModel} from "@syncfusion/ej2-dropdowns";
import {addNx2Class} from '../../Nx2HtmlDecorator';
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
        addNx2Class(this.state.deco, 'Nx2EjAutoComplete');
    }

    protected onStateInitialized(state: STATE) {
        state.deco.tag = 'input'; // AutoComplete requires a header tag
        super.onStateInitialized(state);
    }

    protected createEjObj(): void {
        this.obj = new AutoComplete(this.state.ej);
    }

    protected appendEjToHtmlElement(): void {
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }

}