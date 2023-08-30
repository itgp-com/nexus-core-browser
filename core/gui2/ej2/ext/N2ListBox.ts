import {ListBox, ListBoxModel} from '@syncfusion/ej2-dropdowns';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2ListBoxRef extends StateN2EjBasicRef {
    widget?: N2ListBox;
}

export interface StateN2ListBox extends StateN2EjBasic<ListBoxModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ListBoxRef;
} // state class

export class N2ListBox<STATE extends StateN2ListBox = StateN2ListBox> extends N2EjBasic<STATE, ListBox> {
    static readonly CLASS_IDENTIFIER: string = 'N2ListBox';

    constructor(state ?: STATE) {
        super(state);
    }

    onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2ListBox.CLASS_IDENTIFIER);
        state.deco.tag = 'input';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new ListBox(this.state.ej);
    }

    get classIdentifier(): string { return N2ListBox.CLASS_IDENTIFIER; }

} // main class