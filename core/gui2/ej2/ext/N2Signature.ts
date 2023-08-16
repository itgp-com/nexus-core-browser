import {Signature, SignatureModel} from "@syncfusion/ej2-inputs";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2SignatureRef extends StateNx2EjBasicRef {
    widget?: N2Signature;
}

export interface StateN2Signature<WIDGET_LIBRARY_MODEL extends SignatureModel = SignatureModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2SignatureRef;
}

export class N2Signature<STATE extends StateN2Signature = StateN2Signature> extends Nx2EjBasic<STATE, Signature> {
    static readonly CLASS_IDENTIFIER: string = "N2Signature";

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2Signature.CLASS_IDENTIFIER);
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'canvas';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new Signature(this.state.ej);
    }

    get classIdentifier(): string { return N2Signature.CLASS_IDENTIFIER; }

}