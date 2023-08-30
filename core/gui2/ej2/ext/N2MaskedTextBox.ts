import {MaskedTextBox, MaskedTextBoxModel} from '@syncfusion/ej2-inputs';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2MaskedTextBoxRef extends StateN2EjBasicRef {
    widget?: N2MaskedTextBox;
}

export interface StateN2MaskedTextBox<WIDGET_LIBRARY_MODEL extends MaskedTextBoxModel = MaskedTextBoxModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2MaskedTextBoxRef;
}

export class N2MaskedTextBox<STATE extends StateN2MaskedTextBox = StateN2MaskedTextBox> extends N2EjBasic<STATE, MaskedTextBox> {
    static readonly CLASS_IDENTIFIER: string = 'N2MaskedTextBox';

    constructor(state ?: STATE) {
        super(state);
    }


    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2MaskedTextBox.CLASS_IDENTIFIER);
        state.deco.tag = 'input';
        state.deco.otherAttr.type = 'text';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new MaskedTextBox(this.state.ej);
    }

    get classIdentifier(): string { return N2MaskedTextBox.CLASS_IDENTIFIER; }


}