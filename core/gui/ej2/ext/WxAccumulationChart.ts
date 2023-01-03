import {addWidgetClass}                                            from "../../AbstractWidget";
import {AbstractAccumulationChart, Args_AbstractAccumulationChart} from "../abstract/AbstractAccumulationChart";

export class Args_WxAccumulationChart extends Args_AbstractAccumulationChart {
}

export class WxAccumulationChart extends AbstractAccumulationChart {
   static readonly CLASS_NAME:string = 'WxAccumulationChart';

   protected constructor() {
      super();
   }

   public static async create(args?: Args_WxAccumulationChart): Promise<WxAccumulationChart> {
      let instance = new WxAccumulationChart();
      await instance._initialize(args);
      return instance;
   }  // create

   protected async _initialize(args: Args_WxAccumulationChart) {
      if (!args)
         args = new Args_WxAccumulationChart()
      addWidgetClass(args, WxAccumulationChart.CLASS_NAME);
      await super._initialize(args);
   } // initialize_WxAccumulationChart



}