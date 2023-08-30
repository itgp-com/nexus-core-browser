import {QRCodeGenerator, QRCodeGeneratorModel} from '@syncfusion/ej2-barcode-generator';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2QRCodeRef extends StateN2EjBasicRef {
    widget?: N2QRCode;
}

export interface StateN2QRCode<WIDGET_LIBRARY_MODEL extends QRCodeGeneratorModel = QRCodeGeneratorModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2QRCodeRef;
}

export class N2QRCode<STATE extends StateN2QRCode = StateN2QRCode> extends N2EjBasic<STATE, QRCodeGenerator> {
    static readonly CLASS_IDENTIFIER: string = 'N2QRCode';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2QRCode.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }


    createEjObj(): void {
        this.obj = new QRCodeGenerator(this.state.ej);
    }

    get classIdentifier(): string { return N2QRCode.CLASS_IDENTIFIER; }

}