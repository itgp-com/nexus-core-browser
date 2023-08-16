import {AutoComplete, AutoCompleteModel} from "@syncfusion/ej2-dropdowns";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2AutoCompleteRef extends StateNx2EjBasicRef {
    widget?: N2AutoComplete;
}

export interface StateN2AutoComplete<WIDGET_LIBRARY_MODEL extends AutoCompleteModel = AutoCompleteModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2AutoCompleteRef;
}

export class N2AutoComplete<STATE extends StateN2AutoComplete = StateN2AutoComplete> extends Nx2EjBasic<STATE, AutoComplete> {
    static readonly CLASS_IDENTIFIER:string = "N2AutoComplete"
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2AutoComplete.CLASS_IDENTIFIER);
    }

    protected onStateInitialized(state: STATE) {
        state.deco.tag = 'input'; // AutoComplete requires a header tag
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new AutoComplete(this.state.ej);
    }

    get classIdentifier() {
        return N2AutoComplete.CLASS_IDENTIFIER;
    }


}