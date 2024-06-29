nexusMain.UIStartedListeners.add((ev:any)=>{
    link_widget_dataSource_NexusDataManager(StockChart.prototype);
}); // normal priority

export interface StateN2StockChartRef extends StateN2EjBasicRef {
    widget?: N2StockChart;
}

export interface StateN2StockChart<WIDGET_LIBRARY_MODEL extends StockChartModel = StockChartModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2StockChartRef;
}

export class N2StockChart<STATE extends StateN2StockChart = StateN2StockChart> extends N2EjBasic<STATE, StockChart> {
    static readonly CLASS_IDENTIFIER: string = 'N2StockChart';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2StockChart.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }


    createEjObj(): void {
        this.obj = new StockChart(this.state.ej);
    }

    get classIdentifier(): string { return N2StockChart.CLASS_IDENTIFIER; }

} // N2StockChart

import {StockChart, StockChartModel} from '@syncfusion/ej2-charts';
import {StockLegend} from '@syncfusion/ej2-charts/src/stock-chart/legend/legend';
import {nexusMain} from '../../../NexusMain';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';
import {link_widget_dataSource_NexusDataManager} from './util/N2Wrapper_dataSource';

StockChart.Inject(StockLegend);