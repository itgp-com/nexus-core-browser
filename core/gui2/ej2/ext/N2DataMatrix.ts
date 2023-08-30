import {DataMatrixGenerator, DataMatrixGeneratorModel} from '@syncfusion/ej2-barcode-generator';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2DataMatrixRef extends StateN2EjBasicRef {
    widget?: N2DataMatrix;
}

export interface StateN2DataMatrix<WIDGET_LIBRARY_MODEL extends DataMatrixGeneratorModel = DataMatrixGeneratorModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2DataMatrixRef;
}

export class N2DataMatrix<STATE extends StateN2DataMatrix = StateN2DataMatrix> extends N2EjBasic<STATE, DataMatrixGenerator> {
    static readonly CLASS_IDENTIFIER: string = 'N2DataMatrix'

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2DataMatrix.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }

    createEjObj(): void {
        this.obj = new DataMatrixGenerator(this.state.ej);
    }

    get classIdentifier() { return N2DataMatrix.CLASS_IDENTIFIER; }


}