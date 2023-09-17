import {Args_AnyWidget}      from "../../AnyWidget";
import {addWidgetClass}      from "../../AbstractWidget";
import {AnyWidgetStandard}   from "../../AnyWidgetStandard";
import {CSS_CLASS_vertical_spacer} from "../../../gui2/scss/core";

export class Args_WxSpacer_Vertical extends Args_AnyWidget {
   pixels ?: number = 0;
}

export class WxSpacer_Vertical extends AnyWidgetStandard {


   protected constructor() {
      super();
   }

   static async create(args?: Args_WxSpacer_Vertical): Promise<WxSpacer_Vertical> {
      let instance: WxSpacer_Vertical = new WxSpacer_Vertical();

      if (!args)
         args = new Args_WxSpacer_Vertical();

      addWidgetClass(args,'WxSpacer_Vertical');

      if (args.pixels) {
        Object.assign(args.htmlTagStyle , {"margin-top":`${args.pixels}px;`});
      } else {
         addWidgetClass(args, CSS_CLASS_vertical_spacer)
      }

      await instance.initialize_AnyWidgetStandard(args);

      return instance;
   }

}