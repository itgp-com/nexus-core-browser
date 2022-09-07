import {Args_AnyWidget}                                                                                                                              from "../AnyWidget";
import {AnyWidgetStandard}                                                                                                                           from "../AnyWidgetStandard";
import {IArgs_HtmlTag_Utils}                                                                                                                         from "../../BaseUtils";
import {AccumulationChart, AccumulationChartModel, AccumulationDataLabel, AccumulationLegend, AccumulationSelection, AccumulationTooltip, PieSeries} from '@syncfusion/ej2-charts';

AccumulationChart.Inject(
   AccumulationLegend,
   PieSeries,
   AccumulationDataLabel,
   AccumulationTooltip,
   AccumulationSelection,

);

export abstract class Args_AbstractAccumulationChart extends Args_AnyWidget<AccumulationChartModel> {
} // Args_WgtAccumulationChart

// noinspection JSUnusedGlobalSymbols
export abstract class AbstractAccumulationChart extends AnyWidgetStandard<AccumulationChart, Args_AbstractAccumulationChart, any> {

   protected constructor() {
      super();
   }

   protected async initialize_AbstractAccumulationChart(args: Args_AbstractAccumulationChart) {
      args = IArgs_HtmlTag_Utils.init(args);

      await this.initialize_AnyWidgetStandard(args);

   } // initialize_WgtAccumulationChart
   async localLogicImplementation() {
      let anchor = this.hget;
      this.obj   = new AccumulationChart(this.initArgs?.ej);
      this.obj.appendTo(anchor);
   } // localLogicImplementation


   async localClearImplementation() {
      await super.localClearImplementation();
      if (this.obj) {
         this.obj.dataSource=[];
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