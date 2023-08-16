import {BulletChart, BulletChartModel} from "@syncfusion/ej2-charts";
import {BulletChartLegend} from '@syncfusion/ej2-charts/src/bullet-chart/legend/legend';
import {BulletTooltip} from '@syncfusion/ej2-charts/src/bullet-chart/user-interaction/tooltip';
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

BulletChart.Inject( BulletTooltip, BulletChartLegend);

export interface StateN2BulletChartRef extends StateNx2EjBasicRef {
    widget?: N2BulletChart;
}

export interface StateN2BulletChart<WIDGET_LIBRARY_MODEL extends BulletChartModel = BulletChartModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2BulletChartRef;
}

export class N2BulletChart<STATE extends StateN2BulletChart = StateN2BulletChart> extends Nx2EjBasic<STATE, BulletChart> {
    static readonly CLASS_IDENTIFIER:string = "N2BulletChart"
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2BulletChart.CLASS_IDENTIFIER);
    }


    createEjObj(): void {
        this.obj = new BulletChart(this.state.ej);
    }

    get classIdentifier() {
        return N2BulletChart.CLASS_IDENTIFIER;
    }

}