import {Chart, ChartModel, ColumnSeries, Legend, LineSeries, Logarithmic} from "@syncfusion/ej2-charts";
import {ChartAnnotation} from '@syncfusion/ej2-charts/src/chart/annotation/annotation';
import {Category} from '@syncfusion/ej2-charts/src/chart/axis/category-axis';
import {DateTime} from '@syncfusion/ej2-charts/src/chart/axis/date-time-axis';
import {MultiLevelLabel} from '@syncfusion/ej2-charts/src/chart/axis/multi-level-labels';
import {StripLine} from '@syncfusion/ej2-charts/src/chart/axis/strip-line';
import {Export} from '@syncfusion/ej2-charts/src/chart/print-export/export';
import {AreaSeries} from '@syncfusion/ej2-charts/src/chart/series/area-series';
import {BarSeries} from '@syncfusion/ej2-charts/src/chart/series/bar-series';
import {BoxAndWhiskerSeries} from '@syncfusion/ej2-charts/src/chart/series/box-and-whisker-series';
import {BubbleSeries} from '@syncfusion/ej2-charts/src/chart/series/bubble-series';
import {CandleSeries} from '@syncfusion/ej2-charts/src/chart/series/candle-series';
import {DataLabel} from '@syncfusion/ej2-charts/src/chart/series/data-label';
import {ErrorBar} from '@syncfusion/ej2-charts/src/chart/series/error-bar';
import {HiloOpenCloseSeries} from '@syncfusion/ej2-charts/src/chart/series/hilo-open-close-series';
import {HiloSeries} from '@syncfusion/ej2-charts/src/chart/series/hilo-series';
import {HistogramSeries} from '@syncfusion/ej2-charts/src/chart/series/histogram-series';
import {MultiColoredAreaSeries} from '@syncfusion/ej2-charts/src/chart/series/multi-colored-area-series';
import {MultiColoredLineSeries} from '@syncfusion/ej2-charts/src/chart/series/multi-colored-line-series';
import {ParetoSeries} from '@syncfusion/ej2-charts/src/chart/series/pareto-series';
import {PolarSeries} from '@syncfusion/ej2-charts/src/chart/series/polar-series';
import {RadarSeries} from '@syncfusion/ej2-charts/src/chart/series/radar-series';
import {RangeAreaSeries} from '@syncfusion/ej2-charts/src/chart/series/range-area-series';
import {RangeColumnSeries} from '@syncfusion/ej2-charts/src/chart/series/range-column-series';
import {RangeStepAreaSeries} from '@syncfusion/ej2-charts/src/chart/series/range-step-area-series';
import {ScatterSeries} from '@syncfusion/ej2-charts/src/chart/series/scatter-series';
import {SplineAreaSeries} from '@syncfusion/ej2-charts/src/chart/series/spline-area-series';
import {SplineRangeAreaSeries} from '@syncfusion/ej2-charts/src/chart/series/spline-range-area-series';
import {SplineSeries} from '@syncfusion/ej2-charts/src/chart/series/spline-series';
import {StackingAreaSeries} from '@syncfusion/ej2-charts/src/chart/series/stacking-area-series';
import {StackingBarSeries} from '@syncfusion/ej2-charts/src/chart/series/stacking-bar-series';
import {StackingColumnSeries} from '@syncfusion/ej2-charts/src/chart/series/stacking-column-series';
import {StackingLineSeries} from '@syncfusion/ej2-charts/src/chart/series/stacking-line-series';
import {StackingStepAreaSeries} from '@syncfusion/ej2-charts/src/chart/series/stacking-step-area-series';
import {StepAreaSeries} from '@syncfusion/ej2-charts/src/chart/series/step-area-series';
import {StepLineSeries} from '@syncfusion/ej2-charts/src/chart/series/step-line-series';
import {WaterfallSeries} from '@syncfusion/ej2-charts/src/chart/series/waterfall-series';
import {AccumulationDistributionIndicator} from '@syncfusion/ej2-charts/src/chart/technical-indicators/ad-indicator';
import {AtrIndicator} from '@syncfusion/ej2-charts/src/chart/technical-indicators/atr-indicator';
import {BollingerBands} from '@syncfusion/ej2-charts/src/chart/technical-indicators/bollinger-bands';
import {EmaIndicator} from '@syncfusion/ej2-charts/src/chart/technical-indicators/ema-indicator';
import {MacdIndicator} from '@syncfusion/ej2-charts/src/chart/technical-indicators/macd-indicator';
import {MomentumIndicator} from '@syncfusion/ej2-charts/src/chart/technical-indicators/momentum-indicator';
import {RsiIndicator} from '@syncfusion/ej2-charts/src/chart/technical-indicators/rsi-indicator';
import {SmaIndicator} from '@syncfusion/ej2-charts/src/chart/technical-indicators/sma-indicator';
import {StochasticIndicator} from '@syncfusion/ej2-charts/src/chart/technical-indicators/stochastic-indicator';
import {TmaIndicator} from '@syncfusion/ej2-charts/src/chart/technical-indicators/tma-indicator';
import {Trendlines} from '@syncfusion/ej2-charts/src/chart/trend-lines/trend-line';
import {Crosshair} from '@syncfusion/ej2-charts/src/chart/user-interaction/crosshair';
import {DataEditing} from '@syncfusion/ej2-charts/src/chart/user-interaction/data-editing';
import {Highlight} from '@syncfusion/ej2-charts/src/chart/user-interaction/high-light';
import {Selection} from '@syncfusion/ej2-charts/src/chart/user-interaction/selection';
import {Tooltip} from '@syncfusion/ej2-charts/src/chart/user-interaction/tooltip';
import {Zoom} from '@syncfusion/ej2-charts/src/chart/user-interaction/zooming';
import {ScrollBar} from '@syncfusion/ej2-charts/src/common/scrollbar/scrollbar';
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

Chart.Inject(LineSeries, MultiColoredLineSeries, MultiColoredAreaSeries, ColumnSeries, ParetoSeries,
    AreaSeries, BarSeries, StackingColumnSeries, StackingAreaSeries, StackingStepAreaSeries,
    StackingLineSeries, CandleSeries, StackingBarSeries, StepLineSeries, StepAreaSeries,
    PolarSeries, RadarSeries, SplineSeries, SplineAreaSeries, ScatterSeries,
    BoxAndWhiskerSeries, RangeColumnSeries, HistogramSeries, HiloSeries, HiloOpenCloseSeries,
    WaterfallSeries, BubbleSeries, RangeAreaSeries, RangeStepAreaSeries, SplineRangeAreaSeries,
    Tooltip, Crosshair, ErrorBar, DataLabel, DateTime, Category, Logarithmic,
    Legend, Zoom, DataEditing, Selection, Highlight, ChartAnnotation, StripLine,
    MultiLevelLabel, Trendlines, SmaIndicator, EmaIndicator, TmaIndicator,
    AccumulationDistributionIndicator, AtrIndicator, RsiIndicator, MacdIndicator, StochasticIndicator,
    MomentumIndicator, BollingerBands, ScrollBar, Export);


export interface StateN2ChartRef extends StateNx2EjBasicRef {
    widget?: N2Chart;
}

export interface StateN2Chart<WIDGET_LIBRARY_MODEL extends ChartModel = ChartModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ChartRef;
}

export class N2Chart<STATE extends StateN2Chart = StateN2Chart> extends Nx2EjBasic<STATE, Chart> {
    static readonly CLASS_IDENTIFIER: string = 'N2Chart';

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2Chart.CLASS_IDENTIFIER);
    }


    createEjObj(): void {
        this.obj = new Chart(this.state.ej);
    }


    get classIdentifier() { return N2Chart.CLASS_IDENTIFIER; }

}