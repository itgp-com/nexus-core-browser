import {BulletChart, BulletChartModel} from "@syncfusion/ej2-charts";
import {BulletChartLegend} from '@syncfusion/ej2-charts/src/bullet-chart/legend/legend';
import {BulletTooltip} from '@syncfusion/ej2-charts/src/bullet-chart/user-interaction/tooltip';
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

BulletChart.Inject( BulletTooltip, BulletChartLegend);
export interface StateNx2EjBulletChartRef extends StateNx2EjBasicRef {
    widget?: Nx2EjBulletChart;
}

export interface StateNx2EjBulletChart<WIDGET_LIBRARY_MODEL extends BulletChartModel = BulletChartModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjBulletChartRef;
}

export class Nx2EjBulletChart<STATE extends StateNx2EjBulletChart = StateNx2EjBulletChart> extends Nx2EjBasic<STATE, BulletChart> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjBulletChart');
    }


    createEjObj(): void {
        this.obj = new BulletChart(this.state.ej);
    }



}