import {Signature, SignatureModel} from '@syncfusion/ej2-inputs';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2SignatureRef extends StateN2EjBasicRef {
    widget?: N2Signature;
}

export interface StateN2Signature<WIDGET_LIBRARY_MODEL extends SignatureModel = SignatureModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2SignatureRef;
}

export class N2Signature<STATE extends StateN2Signature = StateN2Signature> extends N2EjBasic<STATE, Signature> {
    static readonly CLASS_IDENTIFIER: string = 'N2Signature';

    constructor(state ?: STATE) {
        super(state);
    }

    onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2Signature.CLASS_IDENTIFIER);
        state.deco.tag = 'canvas';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new Signature(this.state.ej);
    }

    get classIdentifier(): string { return N2Signature.CLASS_IDENTIFIER; }

}