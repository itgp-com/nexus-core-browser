import {Category, Chart, ChartModel, ColumnSeries, DateTime, LineSeries} from "@syncfusion/ej2-charts";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

// Chart.Inject(ColumnSeries,Category, DateTime, LineSeries);


// enum ChartInjections {
//     ColumnSeries,
//     Category,
//     DateTime ,
//     LineSeries
//
// }
//
// function inject(injectionList: ChartInjections[]) {
//     let chartInjections: Function[] = [];
//     for (let injection of injectionList) {
//         switch (injection) {
//             case ChartInjections.ColumnSeries:
//                 chartInjections.push(ColumnSeries);
//                 break;
//             case ChartInjections.Category:
//                 chartInjections.push(Category);
//                 break;
//             case ChartInjections.DateTime:
//                 chartInjections.push(DateTime);
//                 break;
//             case ChartInjections.LineSeries:
//                 chartInjections.push(LineSeries);
//                 break;
//
//         }
//     } // for
// }


export interface StateNx2EjChartRef extends StateNx2EjBasicRef {
    widget?: Nx2EjChart;
}

export interface StateNx2EjChart<WIDGET_LIBRARY_MODEL extends ChartModel = ChartModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjChartRef;
}

export class Nx2EjChart<STATE extends StateNx2EjChart = StateNx2EjChart> extends Nx2EjBasic<STATE, Chart> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjChart');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Chart(this.state.ej);
        this.obj.appendTo(this.htmlElement); // this will initialize the htmlElement if needed
    }
}