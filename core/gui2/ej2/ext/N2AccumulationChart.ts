import {AccumulationChart, AccumulationChartModel} from '@syncfusion/ej2-charts';
import {AccumulationAnnotation} from '@syncfusion/ej2-charts/src/accumulation-chart/annotation/annotation';
import {AccumulationDataLabel} from '@syncfusion/ej2-charts/src/accumulation-chart/renderer/dataLabel';
import {FunnelSeries} from '@syncfusion/ej2-charts/src/accumulation-chart/renderer/funnel-series';
import {AccumulationLegend} from '@syncfusion/ej2-charts/src/accumulation-chart/renderer/legend';
import {PieSeries} from '@syncfusion/ej2-charts/src/accumulation-chart/renderer/pie-series';
import {PyramidSeries} from '@syncfusion/ej2-charts/src/accumulation-chart/renderer/pyramid-series';
import {AccumulationHighlight} from '@syncfusion/ej2-charts/src/accumulation-chart/user-interaction/high-light';
import {AccumulationSelection} from '@syncfusion/ej2-charts/src/accumulation-chart/user-interaction/selection';
import {AccumulationTooltip} from '@syncfusion/ej2-charts/src/accumulation-chart/user-interaction/tooltip';
import {Export} from '@syncfusion/ej2-charts/src/chart/print-export/export';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';

AccumulationChart.Inject(
     PieSeries, FunnelSeries, PyramidSeries,AccumulationLegend,AccumulationDataLabel,
    AccumulationTooltip,AccumulationSelection, AccumulationHighlight,AccumulationAnnotation,Export
);
export interface StateN2AccumulationChartRef extends StateN2EjBasicRef {
    widget?: N2AccumulationChart;
}

export interface StateN2AccumulationChart<WIDGET_LIBRARY_MODEL extends AccumulationChartModel = AccumulationChartModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2AccumulationChartRef;
}

export class N2AccumulationChart<STATE extends StateN2AccumulationChart = StateN2AccumulationChart> extends N2EjBasic<STATE, AccumulationChart> {
    static readonly CLASS_IDENTIFIER:string = 'N2AccumulationChart'
    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2AccumulationChart.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }

    createEjObj(): void {
        this.obj = new AccumulationChart(this.state.ej);
    }


    get classIdentifier() {
        return N2AccumulationChart.CLASS_IDENTIFIER;
    }

}