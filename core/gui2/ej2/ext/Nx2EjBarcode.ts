import {BarcodeGenerator, BarcodeGeneratorModel} from "@syncfusion/ej2-barcode-generator";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjBarcodeRef extends StateNx2EjBasicRef {
    widget?: Nx2EjBarcode;
}

export interface StateNx2EjBarcode<WIDGET_LIBRARY_MODEL extends BarcodeGeneratorModel = BarcodeGeneratorModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjBarcodeRef;
}

export class Nx2EjBarcode<STATE extends StateNx2EjBarcode = StateNx2EjBarcode> extends Nx2EjBasic<STATE, BarcodeGenerator> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjBarcode');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new BarcodeGenerator(this.state.ej);
        this.obj.appendTo(this.htmlElement); // this will initialize the htmlElement if needed
        // this.htmlElement.classList.add('Nx2EjBarcode');
    }
}