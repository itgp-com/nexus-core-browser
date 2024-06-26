nexusMain.UIStartedListeners.add((ev:any)=>{
    link_widget_dataSource_NexusDataManager(BulletChart.prototype);
}); // normal priority

export interface StateN2BulletChartRef extends StateN2EjBasicRef {
    widget?: N2BulletChart;
}

export interface StateN2BulletChart<WIDGET_LIBRARY_MODEL extends BulletChartModel = BulletChartModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2BulletChartRef;
}

export class N2BulletChart<STATE extends StateN2BulletChart = StateN2BulletChart> extends N2EjBasic<STATE, BulletChart> {
    static readonly CLASS_IDENTIFIER:string = 'N2BulletChart'
    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2BulletChart.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }

    createEjObj(): void {
        this.obj = new BulletChart(this.state.ej);
    }

    get classIdentifier() {
        return N2BulletChart.CLASS_IDENTIFIER;
    }

} // N2BulletChart

import {BulletChart, BulletChartModel} from '@syncfusion/ej2-charts';
import {BulletChartLegend} from '@syncfusion/ej2-charts/src/bullet-chart/legend/legend';
import {BulletTooltip} from '@syncfusion/ej2-charts/src/bullet-chart/user-interaction/tooltip';
import {nexusMain} from '../../../NexusMain';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';
import {link_widget_dataSource_NexusDataManager} from './util/N2Wrapper_dataSource';

BulletChart.Inject( BulletTooltip, BulletChartLegend);