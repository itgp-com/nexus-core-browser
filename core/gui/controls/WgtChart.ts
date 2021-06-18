import {Args_AnyWidget, IArgs_HtmlTag, IArgs_HtmlTag_Utils}                    from "../Args_AnyWidget";
import {AnyWidget}                                                             from "../AnyWidget";
import {Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener} from "../Args_AnyWidget_Initialized_Listener";

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
} from '@syncfusion/ej2-charts';

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

export class Args_WgtChart extends Args_AnyWidget {
   //---- should move from Args_WgtSimple to Args_AnyWidget -------
   /**
    * If this is present,  a new wrapper div is created around the actual input element.
    */
   wrapper           ?: IArgs_HtmlTag;
   ej ?: ChartModel;
} // Args_WgtChart

// noinspection JSUnusedGlobalSymbols
export class WgtChart extends AnyWidget<Chart, Args_WgtChart, any> {
   args: Args_WgtChart;

   //---- should move from WgtSimple to AnyWidget -------
   wrapperTagID: string;

   //----

   protected constructor() {
      super();
   }


   initialize_WgtChart(args: Args_WgtChart) {
      let thisX = this;
      if (!args)
         args = {}

      if (!args.ej) {
         args.ej = {};
      }
      this.args = args;

      this.initialize_AnyWidget(args);

      //--------------- implement Args_AnyWidget_Initialized_Listener ------------- /
      this.args_AnyWidgetInitializedListeners.add(
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

      x += `<div id="${this.tagId}"></div>`; // NEVER use <div />

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