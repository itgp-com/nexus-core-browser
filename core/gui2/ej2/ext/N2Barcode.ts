import {BarcodeGenerator, BarcodeGeneratorModel} from '@syncfusion/ej2-barcode-generator';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2BarcodeRef extends StateN2EjBasicRef {
    widget?: N2Barcode;
}

export interface StateN2Barcode<WIDGET_LIBRARY_MODEL extends BarcodeGeneratorModel = BarcodeGeneratorModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2BarcodeRef;
}

export class N2Barcode<STATE extends StateN2Barcode = StateN2Barcode> extends N2EjBasic<STATE, BarcodeGenerator> {
    static readonly CLASS_IDENTIFIER:string = 'N2Barcode'
    constructor(state ?: STATE) {
        super(state);
        addN2Class(this.state.deco, N2Barcode.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new BarcodeGenerator(this.state.ej);
    }


    get classIdentifier() {
        return N2Barcode.CLASS_IDENTIFIER;
    }

}