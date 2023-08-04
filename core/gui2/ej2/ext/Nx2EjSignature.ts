import {Signature, SignatureModel} from "@syncfusion/ej2-inputs";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjSignatureRef extends StateNx2EjBasicRef {
    widget?: Nx2EjSignature;
}

export interface StateNx2EjSignature<WIDGET_LIBRARY_MODEL extends SignatureModel = SignatureModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjSignatureRef;
}

export class Nx2EjSignature<STATE extends StateNx2EjSignature = StateNx2EjSignature> extends Nx2EjBasic<STATE, Signature> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjSignature');
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'canvas';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new Signature(this.state.ej);
    }



}