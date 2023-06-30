import {DataMatrixGenerator, DataMatrixGeneratorModel} from "@syncfusion/ej2-barcode-generator";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjDataMatrixRef extends StateNx2EjBasicRef {
    widget?: Nx2EjDataMatrix;
}

export interface StateNx2EjDataMatrix<WIDGET_LIBRARY_MODEL extends DataMatrixGeneratorModel = DataMatrixGeneratorModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjDataMatrixRef;
}

export class Nx2EjDataMatrix<STATE extends StateNx2EjDataMatrix = StateNx2EjDataMatrix> extends Nx2EjBasic<STATE, DataMatrixGenerator> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjDataMatrix');
    }

    protected createEjObj(): void {
        this.obj = new DataMatrixGenerator(this.state.ej);
    }

    protected appendEjToHtmlElement(): void {
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }

}