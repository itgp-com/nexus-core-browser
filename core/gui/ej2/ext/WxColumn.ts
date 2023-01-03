import {addWidgetClass}         from "../../AbstractWidget";
import {CSS_FLEX_COL_DIRECTION} from "../../../CoreCSS";
import {Args_AnyWidget}         from "../../AnyWidget";
import {AnyWidgetStandard}      from "../../AnyWidgetStandard";

export class Args_WxColumn extends Args_AnyWidget {}

export class WxColumn extends AnyWidgetStandard {
static readonly CLASS_NAME:string = 'WxColumn';
   static async create(args ?: Args_WxColumn): Promise<WxColumn> {
      let instance = new WxColumn();
      await instance._initialize(args);
      return instance;
   }

   async _initialize(args: Args_WxColumn){
      if (!args)
         args = new Args_WxColumn();
      args         = addWidgetClass(args, [WxColumn.CLASS_NAME, CSS_FLEX_COL_DIRECTION]);
      await super.initialize_AnyWidgetStandard(args);
   }
}