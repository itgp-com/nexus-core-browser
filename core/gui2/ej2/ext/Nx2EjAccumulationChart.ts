import {AccumulationChart, AccumulationChartModel} from "@syncfusion/ej2-charts";
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
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

AccumulationChart.Inject(
     PieSeries, FunnelSeries, PyramidSeries,AccumulationLegend,AccumulationDataLabel,
    AccumulationTooltip,AccumulationSelection, AccumulationHighlight,AccumulationAnnotation,Export
);
export interface StateNx2EjAccumulationChartRef extends StateNx2EjBasicRef {
    widget?: Nx2EjAccumulationChart;
}

export interface StateNx2EjAccumulationChart<WIDGET_LIBRARY_MODEL extends AccumulationChartModel = AccumulationChartModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjAccumulationChartRef;
}

export class Nx2EjAccumulationChart<STATE extends StateNx2EjAccumulationChart = StateNx2EjAccumulationChart> extends Nx2EjBasic<STATE, AccumulationChart> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjAccumulationChart');
    }

    protected createEjObj(): void {
        this.obj = new AccumulationChart(this.state.ej);
    }

    protected appendEjToHtmlElement(): void {
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }

}