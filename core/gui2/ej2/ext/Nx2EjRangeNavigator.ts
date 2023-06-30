import {RangeNavigator, RangeNavigatorModel} from "@syncfusion/ej2-charts";
import {DateTime} from '@syncfusion/ej2-charts/src/chart/axis/date-time-axis';
import {Double} from '@syncfusion/ej2-charts/src/chart/axis/double-axis';
import {Logarithmic} from '@syncfusion/ej2-charts/src/chart/axis/logarithmic-axis';
import {AreaSeries} from '@syncfusion/ej2-charts/src/chart/series/area-series';
import {LineSeries} from '@syncfusion/ej2-charts/src/chart/series/line-series';
import {StepLineSeries} from '@syncfusion/ej2-charts/src/chart/series/step-line-series';
import {PeriodSelector} from '@syncfusion/ej2-charts/src/common/period-selector/period-selector';
import {RangeTooltip} from '@syncfusion/ej2-charts/src/range-navigator/user-interaction/tooltip';
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

RangeNavigator.Inject(
    AreaSeries,
    DateTime,
    Double,
    LineSeries,
    Logarithmic,
    PeriodSelector,
    RangeTooltip,
    StepLineSeries,
);

export interface StateNx2EjRangeNavigatorRef extends StateNx2EjBasicRef {
    widget?: Nx2EjRangeNavigator;
}

export interface StateNx2EjRangeNavigator<WIDGET_LIBRARY_MODEL extends RangeNavigatorModel = RangeNavigatorModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjRangeNavigatorRef;
}

export class Nx2EjRangeNavigator<STATE extends StateNx2EjRangeNavigator = StateNx2EjRangeNavigator> extends Nx2EjBasic<STATE, RangeNavigator> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjRangeNavigator');
    }

    protected createEjObj(): void {
        this.obj = new RangeNavigator(this.state.ej);
    }

    protected appendEjToHtmlElement(): void {
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }

}