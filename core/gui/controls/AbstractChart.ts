import {Args_AnyWidget}                                                                                                                                                                                                                                                                                                      from "../AnyWidget";
import {AreaSeries, BarSeries, Category, Chart, ChartAnnotation, ChartModel, ColumnSeries, DataLabel, DateTime, DateTimeCategory, ErrorBar, Export, Highlight, Legend, LineSeries, Logarithmic, MultiColoredAreaSeries, MultiColoredLineSeries, MultiLevelLabel, ScrollBar, Selection, StripLine, Tooltip, Trendlines, Zoom} from '@syncfusion/ej2-charts';
import {AnyWidgetStandard}                                                                                                                                                                                                                                                                                                   from "../AnyWidgetStandard";
import {IArgs_HtmlTag_Utils}                                                                                                                                                                                                                                                                                                 from "../../BaseUtils";

Chart.Inject(
   // AccumulationDistributionIndicator,
   AreaSeries,
   // AtrIndicator,
   BarSeries,
   // BollingerBands,
   // BoxAndWhiskerSeries,
   // BubbleSeries,
   // CandleSeries,
   ChartAnnotation,
   Category,
   ColumnSeries,
   // Crosshair,
   // DataEditing,
   DataLabel,
   DateTime,
   DateTimeCategory,
   // EmaIndicator,
   ErrorBar,
   Export,
   Highlight,
   // HiloOpenCloseSeries,
   // HistogramSeries,
   Legend,
   LineSeries,
   Logarithmic,
   // MacdIndicator,
   // MomentumIndicator,
   MultiColoredAreaSeries,
   MultiColoredLineSeries,
   MultiLevelLabel,
   // ParetoSeries,
   // PolarSeries,
   // RadarSeries,
   // RangeAreaSeries,
   // RangeColumnSeries,
   // RsiIndicator,
   // ScatterSeries,
   ScrollBar,
   Selection,
   // SmaIndicator,
   // SplineAreaSeries,
   // SplineSeries,
   // StackingAreaSeries,
   // StackingBarSeries,
   // StackingColumnSeries,
   // StackingLineSeries,
   // StackingStepAreaSeries,
   // StepAreaSeries,
   // StepLineSeries,
   // StochasticIndicator,
   StripLine,
   // TmaIndicator,
   Tooltip,
   Trendlines,
   // WaterfallSeries,
   Zoom
);

export abstract class Args_AbstractChart extends Args_AnyWidget<ChartModel> {
} // Args_WgtChart

// noinspection JSUnusedGlobalSymbols
export abstract class AbstractChart extends AnyWidgetStandard<Chart, Args_AbstractChart, any> {

   protected constructor() {
      super();
   }

   protected async initialize_AbstractChart(args: Args_AbstractChart) {
      args = IArgs_HtmlTag_Utils.init(args);

      await this.initialize_AnyWidgetStandard(args);

   } // initialize_WgtChart
   async localLogicImplementation() {
      let anchor = this.hget;
      this.obj   = new Chart(this.initArgs?.ej);
      this.obj.appendTo(anchor);
   } // localLogicImplementation


   async localClearImplementation() {
      await super.localClearImplementation();
      if (this.obj) {
         this.obj.clearSeries();
      }
   } // localClearImplementation

   get value(): any {
      if (this.obj)
         return this.obj.dataSource;
   }

   set value(value: any) {
      if (this.obj) {
         this.obj.dataSource = value;
         super.value = value;
      }
   }
} // main