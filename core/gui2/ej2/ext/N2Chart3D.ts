nexusMain.UIStartedListeners.add((ev: any) => {
    link_widget_dataSource_NexusDataManager(Chart3D.prototype);
}); // normal priority

export interface StateN2ChartRef extends StateN2EjBasicRef {
    widget?: N2Chart3D;
}

export interface StateN2Chart3D<WIDGET_LIBRARY_MODEL extends Chart3DModel = Chart3DModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ChartRef;
}

export class N2Chart3D<STATE extends StateN2Chart3D = StateN2Chart3D> extends N2EjBasic<STATE, Chart3D> {
    static readonly CLASS_IDENTIFIER: string = 'N2Chart3D';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2Chart3D.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }

    createEjObj(): void {
        this.obj = new Chart3D(this.state.ej);
    }


    get classIdentifier() { return N2Chart3D.CLASS_IDENTIFIER; }

}


import {
    BarSeries3D,
    Category3D,
    Chart3D,
    Chart3DModel,
    ColumnSeries3D,
    DataLabel3D,
    DateTime3D,
    Highlight3D,
    Legend3D,
    Logarithmic3D,
    Selection3D,
    StackingBarSeries3D,
    StackingColumnSeries3D,
    Tooltip3D
} from '@syncfusion/ej2-charts';
import {nexusMain} from '../../../NexusMain';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';
import {link_widget_dataSource_NexusDataManager} from './util/N2Wrapper_dataSource';

Chart3D.Inject(BarSeries3D, Category3D, ColumnSeries3D, DataLabel3D, DateTime3D, Highlight3D, Legend3D, Logarithmic3D, Selection3D, StackingBarSeries3D, StackingColumnSeries3D, Tooltip3D);