import {QRCodeGenerator, QRCodeGeneratorModel} from "@syncfusion/ej2-barcode-generator";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjQRCodeRef extends StateNx2EjBasicRef {
    widget?: Nx2EjQRCode;
}

export interface StateNx2EjQRCode<WIDGET_LIBRARY_MODEL extends QRCodeGeneratorModel = QRCodeGeneratorModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjQRCodeRef;
}

export class Nx2EjQRCode<STATE extends StateNx2EjQRCode = StateNx2EjQRCode> extends Nx2EjBasic<STATE, QRCodeGenerator> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjQRCode');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new QRCodeGenerator(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}