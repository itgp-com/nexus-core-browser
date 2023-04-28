import {AccumulationChart, AccumulationChartModel} from "@syncfusion/ej2-charts";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


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


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new AccumulationChart(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}