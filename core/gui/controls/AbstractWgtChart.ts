import {AnyWidget, Args_AnyWidget, Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener} from "../AnyWidget";

import {
   // AccumulationDistributionIndicator,
   AreaSeries,
   // AtrIndicator,
   BarSeries,
   // BollingerBands,
   // BoxAndWhiskerSeries,
   // BubbleSeries,
   // CandleSeries,
   Category,
   Chart,
   ChartAnnotation,
   ChartModel,
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
}                                           from '@syncfusion/ej2-charts';
import {Args_AbstractWidget}                from "../AbstractWidget";
import {IArgs_HtmlTag, IArgs_HtmlTag_Utils} from "../../BaseUtils";

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

export class Args_WgtChart extends Args_AnyWidget<ChartModel> {
} // Args_WgtChart

// noinspection JSUnusedGlobalSymbols
export abstract class AbstractWgtChart extends AnyWidget<Chart, Args_WgtChart, any> {
   args: Args_WgtChart;

   //---- should move from WgtSimple to AnyWidget -------
   wrapperTagID: string;

   //----

   protected constructor() {
      super();
   }


   initialize_AbstractWgtChart(args: Args_WgtChart) {
      let thisX = this;
      if (!args)
         args = {}

      if (!args.ej) {
         args.ej = {};
      }
      this.args = args;

      this.initialize_AnyWidget(args);

      //--------------- implement Args_AnyWidget_Initialized_Listener ------------- /
      this.args_AnyWidgetInitializedListeners.addListener(
         new class extends Args_AnyWidget_Initialized_Listener {
            argsAnyWidgetInitialized(evt: Args_AnyWidget_Initialized_Event): void {

               // initialize the tags so they available in initContentBegin/End
               thisX.wrapperTagID = `wrapper_${evt.widget.tagId}`;

            }
         }
      );

   } // initialize_WgtChart

   async localContentBegin(): Promise<string> {
      let x: string = "";
      if (this.args?.wrapper) {
         this.args.wrapper = IArgs_HtmlTag_Utils.init(this.args.wrapper);
         x += `<${this.args.wrapper.htmlTagType} id="${this.wrapperTagID}" ${IArgs_HtmlTag_Utils.all(this.args.wrapper)}>`;
      }


      let classString = Args_AbstractWidget.combineAllWidgetClassesAsString(this.args, true);
      x += `<div id="${this.tagId}" ${classString}></div>`; // NEVER use <div />

      if (this.args?.wrapper) {
         x += `</${this.args.wrapper.htmlTagType}>`; // <!-- id="${this.wrapperTagID}" -->
      }
      return x; // no call to super
   } // localContentBegin


   async localLogicImplementation() {
      let anchor = this.hget;
      this.obj   = new Chart(this.args?.ej, anchor);
   } // localLogicImplementation


   async localClearImplementation() {
      await super.localClearImplementation();
      if (this.obj) {
         this.obj.clearSeries();
      }
   } // localClearImplementation

   async localRefreshImplementation() {
      if (this.obj) {
         this.obj.refresh();
      }
   } // localRefreshImplementation

   get value(): any {
      if (this.obj)
         return this.obj.dataSource;
   }

   set value(value: any) {
      if (this.obj) {
         this.obj.dataSource = value;
      }
   }
} // main