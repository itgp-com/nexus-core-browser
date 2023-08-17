import {RadioButton, RadioButtonModel} from '@syncfusion/ej2-buttons';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2RadioButtonRef extends StateN2EjBasicRef {
    widget?: N2RadioButton;
}

export interface StateN2RadioButton extends StateN2EjBasic<RadioButtonModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2RadioButtonRef;
} // state class

export class N2RadioButton<STATE extends StateN2RadioButton = StateN2RadioButton> extends N2EjBasic<STATE, RadioButton> {
    static readonly CLASS_IDENTIFIER: string = 'N2RadioButton';

    constructor(state ?: STATE) {
        super(state);
        addN2Class(this.state.deco, N2RadioButton.CLASS_IDENTIFIER);
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        state.deco.otherAttr['type'] = 'radio';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new RadioButton(this.state.ej);
    }

    get classIdentifier(): string { return N2RadioButton.CLASS_IDENTIFIER; }

} // main class