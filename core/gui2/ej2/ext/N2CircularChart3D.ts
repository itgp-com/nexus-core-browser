nexusMain.UIStartedListeners.add((ev: any) => {
    link_widget_dataSource_NexusDataManager(CircularChart3D.prototype);
}); // normal priority

export interface StateN2ChartRef extends StateN2EjBasicRef {
    widget?: N2CircularChart3D;
}

export interface StateN2CircularChart3D<WIDGET_LIBRARY_MODEL extends CircularChart3DModel = CircularChart3DModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ChartRef;
}

export class N2CircularChart3D<STATE extends StateN2CircularChart3D = StateN2CircularChart3D> extends N2EjBasic<STATE, CircularChart3D> {
    static readonly CLASS_IDENTIFIER: string = 'N2CircularChart3D';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2CircularChart3D.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }

    createEjObj(): void {
        this.obj = new CircularChart3D(this.state.ej);
    }


    get classIdentifier() { return N2CircularChart3D.CLASS_IDENTIFIER; }

}


import {
    BarSeries3D,
    Category3D,
    CircularChart3D,
    CircularChart3DModel,
    CircularChartDataLabel3D,
    CircularChartLegend3D,
    CircularChartTooltip3D,
    ColumnSeries3D,
    DataLabel3D,
    DateTime3D,
    Highlight3D,
    Legend3D,
    Logarithmic3D,
    PieSeries3D,
    Selection3D,
    StackingBarSeries3D,
    StackingColumnSeries3D,
    Tooltip3D
} from '@syncfusion/ej2-charts';
import {nexusMain} from '../../../NexusMain';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';
import {link_widget_dataSource_NexusDataManager} from './util/N2Wrapper_dataSource';

CircularChart3D.Inject(BarSeries3D, Category3D,
    CircularChartDataLabel3D,
    CircularChartLegend3D,CircularChartTooltip3D, ColumnSeries3D, DataLabel3D, DateTime3D, Highlight3D, Legend3D, Logarithmic3D,PieSeries3D, Selection3D, StackingBarSeries3D, StackingColumnSeries3D, Tooltip3D);