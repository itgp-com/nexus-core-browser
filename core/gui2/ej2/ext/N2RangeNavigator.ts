import {RangeNavigator, RangeNavigatorModel} from '@syncfusion/ej2-charts';
import {DateTime} from '@syncfusion/ej2-charts/src/chart/axis/date-time-axis';
import {Double} from '@syncfusion/ej2-charts/src/chart/axis/double-axis';
import {Logarithmic} from '@syncfusion/ej2-charts/src/chart/axis/logarithmic-axis';
import {AreaSeries} from '@syncfusion/ej2-charts/src/chart/series/area-series';
import {LineSeries} from '@syncfusion/ej2-charts/src/chart/series/line-series';
import {StepLineSeries} from '@syncfusion/ej2-charts/src/chart/series/step-line-series';
import {PeriodSelector} from '@syncfusion/ej2-charts/src/common/period-selector/period-selector';
import {RangeTooltip} from '@syncfusion/ej2-charts/src/range-navigator/user-interaction/tooltip';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';

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

export interface StateN2RangeNavigatorRef extends StateN2EjBasicRef {
    widget?: N2RangeNavigator;
}

export interface StateN2RangeNavigator<WIDGET_LIBRARY_MODEL extends RangeNavigatorModel = RangeNavigatorModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2RangeNavigatorRef;
}

export class N2RangeNavigator<STATE extends StateN2RangeNavigator = StateN2RangeNavigator> extends N2EjBasic<STATE, RangeNavigator> {
    static readonly CLASS_IDENTIFIER: string = 'N2RangeNavigator';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2RangeNavigator.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }


    createEjObj(): void {
        this.obj = new RangeNavigator(this.state.ej);
    }

    get classIdentifier(): string { return N2RangeNavigator.CLASS_IDENTIFIER; }

}