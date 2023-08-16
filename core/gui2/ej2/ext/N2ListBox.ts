import {ListBox, ListBoxModel} from "@syncfusion/ej2-dropdowns";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2ListBoxRef extends StateNx2EjBasicRef {
    widget?: N2ListBox;
}

export interface StateN2ListBox extends StateNx2EjBasic<ListBoxModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ListBoxRef;
} // state class

export class N2ListBox<STATE extends StateN2ListBox = StateN2ListBox> extends Nx2EjBasic<STATE, ListBox> {
    static readonly CLASS_IDENTIFIER: string = 'N2ListBox';

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2ListBox.CLASS_IDENTIFIER);
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new ListBox(this.state.ej);
    }

    get classIdentifier(): string { return N2ListBox.CLASS_IDENTIFIER; }

} // main class