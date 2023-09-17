import {Args_AnyWidget}        from "../../AnyWidget";
import {addWidgetClass}        from "../../AbstractWidget";
import {AnyWidgetStandard}     from "../../AnyWidgetStandard";
import {CSS_CLASS_horizontal_spacer} from "../../../gui2/scss/core";

export class Args_WxSpacer_Horizontal extends Args_AnyWidget<any> {
   pixels ?: number = 0;
}

export class WxSpacer_Horizontal extends AnyWidgetStandard<any> {


   protected constructor() {
      super();
   }

   static async create(args?: Args_WxSpacer_Horizontal): Promise<WxSpacer_Horizontal> {
      let instance =  new WxSpacer_Horizontal();

      if (!args)
         args = new Args_WxSpacer_Horizontal();
      addWidgetClass(args,'WxSpacer_Horizontal');

      if (args.pixels) {
         Object.assign(args.htmlTagStyle,  {"margin-right":`${args.pixels}px;`});
      } else {
         addWidgetClass(args, CSS_CLASS_horizontal_spacer)
      }

      await instance.initialize_AnyWidgetStandard(args)
      return instance;
   }

}