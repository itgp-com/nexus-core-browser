import {AnyWidget, Args_AnyWidget} from "../AnyWidget";
import {addWidgetClass}            from "../AbstractWidget";
import {CSS_CLASS_horizontal_spacer}     from "../../gui2/scss/core";
import {cssStyleToString}          from "../../CoreUtils";

export class Args_CoreOnly_HorizontalSpacer extends Args_AnyWidget { // does not extend Args_AnyWidget on purpose, it's too simple
   pixels ?: number = 0;
}

/**
 * This class is for the EXCLUSIVE use of other core components.
 *
 * *** Do not use in application development as it can and will be modified without notice ***
 *
 */

export class CoreOnly_SpacerHorizontal extends AnyWidget {


   protected constructor() {
      super();
   }

   static async create(args?: Args_CoreOnly_HorizontalSpacer): Promise<CoreOnly_SpacerHorizontal> {
      let instance =  new CoreOnly_SpacerHorizontal();

      if (!args)
         args = new Args_CoreOnly_HorizontalSpacer();
      addWidgetClass(args,'WxSpacer_Horizontal');

      if (args.pixels) {
         Object.assign(args.htmlTagStyle  , {"margin-right":`${args.pixels}px`})
      } else {
         addWidgetClass(args, CSS_CLASS_horizontal_spacer)
      }

      await instance.initialize_AnyWidget()
      return instance;
   }

}