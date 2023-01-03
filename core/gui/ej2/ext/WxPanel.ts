import {addWidgetClass}    from "../../AbstractWidget";
import {Args_AnyWidget}    from "../../AnyWidget";
import {AnyWidgetStandard} from "../../AnyWidgetStandard";

export class Args_WxPanel extends Args_AnyWidget {
}

export class WxPanel extends AnyWidgetStandard {
   protected constructor() {
      super();
   }

   public static async create(args?: Args_WxPanel): Promise<WxPanel> {
      if (!args)
         args = new Args_WxPanel()
      addWidgetClass(args, 'WxPanel');

      let instance = new WxPanel();
      await instance.initialize_WgtPanel(args);
      return instance;
   }

   protected async initialize_WgtPanel(args: Args_WxPanel){
      await super.initialize_AnyWidgetStandard(args);
   }

}