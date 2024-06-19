import {OtpInput, OtpInputModel} from '@syncfusion/ej2-inputs';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2OtpInputRef extends StateN2EjBasicRef {
    widget?: N2OtpInput;
}

export interface StateN2OtpInput extends StateN2EjBasic<OtpInputModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2OtpInputRef;
} // state class

export class N2OtpInput<STATE extends StateN2OtpInput = StateN2OtpInput> extends N2EjBasic<STATE, OtpInput> {
    static readonly CLASS_IDENTIFIER: string = 'N2OtpInput';

    constructor(state ?: STATE) {
        super(state);
    }

    onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2OtpInput.CLASS_IDENTIFIER);
        state.deco.tag = 'input';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new OtpInput(this.state.ej);
    }

    get classIdentifier(): string { return N2OtpInput.CLASS_IDENTIFIER; }

} // main class