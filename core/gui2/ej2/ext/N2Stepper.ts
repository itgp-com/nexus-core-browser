
export interface StateN2StepperRef extends StateN2EjBasicRef {
    widget?: N2Stepper;
}

export interface StateN2Stepper extends StateN2EjBasic<StepperModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2StepperRef;
} // state class

export class N2Stepper<STATE extends StateN2Stepper = StateN2Stepper> extends N2EjBasic<STATE, Stepper> {
    static readonly CLASS_IDENTIFIER: string = 'N2Stepper';

    constructor(state ?: STATE) {
        super(state);
    }

    onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2Stepper.CLASS_IDENTIFIER);
        state.deco.tag = 'nav';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new Stepper(this.state.ej);
    }

    get classIdentifier(): string { return N2Stepper.CLASS_IDENTIFIER; }

} // main class

import {Stepper, StepperModel} from '@syncfusion/ej2-navigations';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';