import {Args_AnyWidget}         from "../../AnyWidget";
import {addWidgetClass}         from "../../AbstractWidget";
import {CSS_FLEX_ROW_DIRECTION} from "../../../gui2/scss/core";
import {AnyWidgetStandard}      from "../../AnyWidgetStandard";

export class Args_WxRow extends Args_AnyWidget {
}

export class WxRow extends AnyWidgetStandard {
   static async create(args ?: Args_WxRow): Promise<WxRow> {
      let instance = new WxRow();
      await instance.initialize_WgtRowFlex_App(args);
      return instance;
   }

   async initialize_WgtRowFlex_App(args: Args_WxRow) {
      if (!args)
         args = new Args_WxRow();
      addWidgetClass(args, [ CSS_FLEX_ROW_DIRECTION,'WxRow']);
      await super.initialize_AnyWidgetStandard(args);
   }
}