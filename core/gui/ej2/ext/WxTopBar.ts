import {AnyWidgetStandard}                               from "../../AnyWidgetStandard";
import {Args_AnyWidget}                                  from "../../AnyWidget";
import {resolveWidgetArray}                              from "../../WidgetUtils";
import {AbstractWidget}                                  from "../../AbstractWidget";
import {Args_WxRowLeftCenterRight, WxRowLeftCenterRight} from "./WxRowLeftCenterRight";

export class Args_WxTopBar extends Args_AnyWidget {
   preBarChildren?: (AbstractWidget | Promise<AbstractWidget>)[];
   barArgs ?: Args_WxRowLeftCenterRight;
   postBarChildren ?: (AbstractWidget | Promise<AbstractWidget>)[];
}


export class WxTopBar extends AnyWidgetStandard {
   protected constructor() {
      super();
   }

   static async create(args: Args_WxTopBar): Promise<WxTopBar> {
      let instance: WxTopBar = new WxTopBar();
      await instance.initialize_WgtPanel_TopBar_App(args);
      return instance;
   }

   async initialize_WgtPanel_TopBar_App(args: Args_WxTopBar) {
      if (!args)
         args = new Args_WxTopBar();
      let barArgs = args.barArgs || {};

      args = {...barArgs, ...args};

      args.preBarChildren           = args.preBarChildren || [];
      args.postBarChildren          = args.postBarChildren || [];
      let bar: WxRowLeftCenterRight = await WxRowLeftCenterRight.create(args.barArgs);

      let otherChildren = args.children || [];
      args.children     = [
         ...await resolveWidgetArray(args.preBarChildren),
         bar,
         ...await resolveWidgetArray(args.postBarChildren),
         ...otherChildren,
      ]
      await super.initialize_AnyWidgetStandard(args);
   }


}