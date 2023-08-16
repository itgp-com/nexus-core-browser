import {StockChart, StockChartModel} from "@syncfusion/ej2-charts";
import {StockLegend} from '@syncfusion/ej2-charts/src/stock-chart/legend/legend';
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

StockChart.Inject(StockLegend);

export interface StateN2StockChartRef extends StateNx2EjBasicRef {
    widget?: N2StockChart;
}

export interface StateN2StockChart<WIDGET_LIBRARY_MODEL extends StockChartModel = StockChartModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2StockChartRef;
}

export class N2StockChart<STATE extends StateN2StockChart = StateN2StockChart> extends Nx2EjBasic<STATE, StockChart> {
    static readonly CLASS_IDENTIFIER: string = "N2StockChart";

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2StockChart.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new StockChart(this.state.ej);
    }

    get classIdentifier(): string { return N2StockChart.CLASS_IDENTIFIER; }

}