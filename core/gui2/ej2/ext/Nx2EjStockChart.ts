import {StockChart, StockChartModel} from "@syncfusion/ej2-charts";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjStockChartRef extends StateNx2EjBasicRef {
    widget?: Nx2EjStockChart;
}

export interface StateNx2EjStockChart<WIDGET_LIBRARY_MODEL extends StockChartModel = StockChartModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjStockChartRef;
}

export class Nx2EjStockChart<STATE extends StateNx2EjStockChart = StateNx2EjStockChart> extends Nx2EjBasic<STATE, StockChart> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjStockChart');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new StockChart(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}