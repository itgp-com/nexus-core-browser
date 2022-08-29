import {IArgs_HtmlTag_Utils}                 from "../../BaseUtils";
import {Args_AnyWidget}                      from "../AnyWidget";
import {AnyWidgetStandard}                   from "../AnyWidgetStandard";
import {RangeNavigator, RangeNavigatorModel} from '@syncfusion/ej2-charts';


export class Args_AbstractRangeSelector extends Args_AnyWidget<RangeNavigatorModel> {
   native ?: RangeNavigatorModel;

}

export abstract class AbstractRangeSelector extends AnyWidgetStandard<RangeNavigator, Args_AbstractRangeSelector, any> {
   protected constructor() {
      super();
   }


   protected async initialize_AbstractRangeSelector(args: Args_AbstractRangeSelector) {
      args = IArgs_HtmlTag_Utils.init(args)
      this.descriptor = args;

      if ( !args.native)
         args.native = {};

      await this.initialize_AnyWidgetStandard(args);

   }


   async localLogicImplementation() {
      let anchor = this.hget;
      this.obj   = new RangeNavigator(this.descriptor?.native, anchor);
   } // localLogicImplementation


   async localClearImplementation() {
      await super.localClearImplementation();
      if (this.obj) {
         this.obj.value = [];
      }
   } // localClearImplementation


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