import {QRCodeGenerator, QRCodeGeneratorModel} from "@syncfusion/ej2-barcode-generator";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2QRCodeRef extends StateNx2EjBasicRef {
    widget?: N2QRCode;
}

export interface StateN2QRCode<WIDGET_LIBRARY_MODEL extends QRCodeGeneratorModel = QRCodeGeneratorModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2QRCodeRef;
}

export class N2QRCode<STATE extends StateN2QRCode = StateN2QRCode> extends Nx2EjBasic<STATE, QRCodeGenerator> {
    static readonly CLASS_IDENTIFIER: string = "N2QRCode";

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2QRCode.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new QRCodeGenerator(this.state.ej);
    }

    get classIdentifier(): string { return N2QRCode.CLASS_IDENTIFIER; }

}