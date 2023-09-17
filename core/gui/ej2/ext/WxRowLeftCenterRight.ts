import {CSS_FLEX_CONTAINER, CSS_FLEX_CONTAINER_CENTERING, CSS_FLEX_CONTAINER_LEFT_JUSTIFIED, CSS_FLEX_CONTAINER_RIGHT_JUSTIFIED} from "../../../gui2/scss/core";
import {Args_AnyWidget}                                                                                                          from "../../AnyWidget";
import {IArgs_HtmlTag_Utils}                                                                                                     from "../../../BaseUtils";
import {AbstractWidget, addWidgetClass}                                                                                          from "../../AbstractWidget";
import {AnyWidgetStandard}                                                                                                       from "../../AnyWidgetStandard";
import {WxPanel}                                                                                                                 from "./WxPanel";

export class Args_WxRowLeftCenterRight extends Args_AnyWidget {
   left ?: AbstractWidget | Promise<AbstractWidget>;
   center ?: AbstractWidget | Promise<AbstractWidget>;
   right ?: AbstractWidget | Promise<AbstractWidget>;
}

/**
 * 3 equally spaced horizontal panels
 */
export class WxRowLeftCenterRight extends AnyWidgetStandard {

   protected constructor() {
      super();
   }

   static async create(args: Args_WxRowLeftCenterRight) {
      let instance = new WxRowLeftCenterRight();
      await instance.initialize_WxRowLeftCenterRight(args);
      return instance;
   } // create


   protected async initialize_WxRowLeftCenterRight(args: Args_WxRowLeftCenterRight) {
      args          = IArgs_HtmlTag_Utils.init(args)
      this.initArgs = args;

      addWidgetClass(args, ['WxRowLeftCenterRight', CSS_FLEX_CONTAINER])

      if (!args.left)
         args.left = WxPanel.create();
      if (!args.center)
         args.center = WxPanel.create();
      if (!args.right)
         args.right = WxPanel.create();

      // see https://stackoverflow.com/questions/32551291/in-css-flexbox-why-are-there-no-justify-items-and-justify-self-properties/33856609#33856609
      let leftBox: AbstractWidget   = await WxPanel.create({
                                                              htmlTagClass: `${CSS_FLEX_CONTAINER_CENTERING} ${CSS_FLEX_CONTAINER_LEFT_JUSTIFIED}`,
                                                              children:     [await args.left]
                                                           });
      let centerBox: AbstractWidget = await WxPanel.create({
                                                              htmlTagClass: `${CSS_FLEX_CONTAINER_CENTERING}`,
                                                              children:     [await args.center]
                                                           });

      let rightBox: AbstractWidget = await WxPanel.create({
                                                             htmlTagClass: `${CSS_FLEX_CONTAINER_CENTERING} ${CSS_FLEX_CONTAINER_RIGHT_JUSTIFIED}`,
                                                             children:     [await args.right]
                                                          });
      args.children                = [leftBox, centerBox, rightBox];
      await this.initialize_AnyWidgetStandard(args);

   } // initialize_WgtRow_LeftCenterRight_App


} // main