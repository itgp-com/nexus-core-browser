import {DataMatrixGenerator, DataMatrixGeneratorModel} from "@syncfusion/ej2-barcode-generator";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2DataMatrixRef extends StateNx2EjBasicRef {
    widget?: N2DataMatrix;
}

export interface StateN2DataMatrix<WIDGET_LIBRARY_MODEL extends DataMatrixGeneratorModel = DataMatrixGeneratorModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2DataMatrixRef;
}

export class N2DataMatrix<STATE extends StateN2DataMatrix = StateN2DataMatrix> extends Nx2EjBasic<STATE, DataMatrixGenerator> {
    static readonly CLASS_IDENTIFIER: string = "N2DataMatrix"

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2DataMatrix.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new DataMatrixGenerator(this.state.ej);
    }

    get classIdentifier() { return N2DataMatrix.CLASS_IDENTIFIER; }


}