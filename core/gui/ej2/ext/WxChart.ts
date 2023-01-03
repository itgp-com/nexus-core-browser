import {addWidgetClass}                    from "../../AbstractWidget";
import {AbstractChart, Args_AbstractChart} from "../abstract/AbstractChart";

export class Args_WxChart extends Args_AbstractChart {
}

export class WxChart extends AbstractChart {
   static readonly CLASS_NAME:string = 'WxChart';

   protected constructor() {
      super();
   }

   public static async create(args?: Args_WxChart): Promise<WxChart> {

      let instance = new WxChart();
      await instance._initialize(args);
      return instance;
   } // create

   protected async _initialize(args: Args_WxChart) {
      if (!args)
         args = new Args_WxChart()
      addWidgetClass(args, WxChart.CLASS_NAME);
      await super._initialize(args);
   } // initialize_WxChart


}