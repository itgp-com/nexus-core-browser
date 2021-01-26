import {AreaSeries, Category, Chart, ChartModel, ColumnSeries, DataLabel, DateTime, DateTimeCategory, Legend, ScatterSeries, Tooltip, Zoom} from '@syncfusion/ej2-charts';
import {Args_AnyWidget, IArgs_HtmlTag, IArgs_HtmlTag_Utils}                                                                                 from "../Args_AnyWidget";
import {AnyWidget}                                                                                                                          from "../AnyWidget";
import {Args_AnyWidget_Initialized_Event, Args_AnyWidget_Initialized_Listener}                                                              from "../Args_AnyWidget_Initialized_Listener";

Chart.Inject(ScatterSeries, AreaSeries, Zoom, ColumnSeries, DataLabel, Category, Legend, Tooltip, DateTime, DateTimeCategory, Zoom);

export class Args_WgtChart extends Args_AnyWidget {
} // Args_WgtChart

export class WgtChart extends AnyWidget<Chart, Args_WgtChart, any> {
   args: Args_WgtChart;


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

      // //--------------- implement Args_AnyWidget_Initialized_Listener ------------- /
      // this.args_AnyWidgetInitializedListeners.add(
      //    new class extends Args_AnyWidget_Initialized_Listener {
      //       argsAnyWidgetInitialized(evt: Args_AnyWidget_Initialized_Event): void {
      //
      //          // initialize the tags so they available in initContentBegin/End
      //          thisX.wrapperTagID = `wrapper_${evt.widget.tagId}`;
      //
      //       }
      //    }
      // );

   } // initialize_WgtChart

   async localContentBegin(): Promise<string> {
      let x: string = "";
      if (this.args?.wrapper) {
         this.args.wrapper = IArgs_HtmlTag_Utils.init(this.args.wrapper);
         x += `<${this.args.wrapper.htmlTagType} id="${this.wrapperTagID}" ${IArgs_HtmlTag_Utils.all(this.args.wrapper)}>`;
      }

      x += `<div id="${this.tagId}"/>`;

      if (this.args?.wrapper) {
         x += `</${this.args.wrapper.htmlTagType}>`; // <!-- id="${this.wrapperTagID}" -->
      }
      return x; // no call to super
   } // localContentBegin


   async localLogicImplementation() {
      this.obj = new Chart(this.args?.ej, this.hget);
      this.args.ej.dataSource
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
} // main