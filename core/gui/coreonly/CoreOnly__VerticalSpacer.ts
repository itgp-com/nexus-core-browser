import {Args_AnyWidget}      from "../AnyWidget";
import {IArgs_HtmlTag_Utils} from "../../BaseUtils";
import {AnyWidgetStandard}   from "../AnyWidgetStandard";
import {addWidgetClass}      from "../AbstractWidget";
import {css_vertical_spacer} from "../../CoreCSS";
import {cssStyleToString}    from "../../CoreUtils";

export class Args_CoreOnly__VerticalSpacer extends Args_AnyWidget { // does not extend Args_AnyWidget on purpose, it's too simple
   pixels ?: number;
}

/**
 * This class is for the EXCLUSIVE use of other core components.
 *
 * *** Do not use in application development as it can and will be modified without notice ***
 *
 */

export class CoreOnly__VerticalSpacer extends AnyWidgetStandard {


   protected constructor(args?: Args_CoreOnly__VerticalSpacer) {
      super();
      args          = IArgs_HtmlTag_Utils.init(args)
      this.initArgs = args;

      if (!args.id)
         args.id = 'CoreOnly__VerticalSpacer';

      if (args.pixels) {
         args.htmlTagStyle = { ...args.htmlTagStyle , "padding-bottom":`${args.pixels}px`} ;
      } else {
         addWidgetClass(args, css_vertical_spacer)
      }


      this.initialize_AnyWidget(args);
   }

   static async create(args?: Args_CoreOnly__VerticalSpacer): Promise<CoreOnly__VerticalSpacer> {
      return new CoreOnly__VerticalSpacer(args);
   }


}