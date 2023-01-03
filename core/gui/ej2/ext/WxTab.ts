import {addWidgetClass}                from "../../AbstractWidget";
import {AbstractTab, Args_AbstractTab} from "../abstract/AbstractTab";

export class Args_WxTab extends Args_AbstractTab {
}

export class WxTab extends AbstractTab {
   static readonly CLASS_NAME: string = 'WxTab';

   protected constructor() {
      super();
   }

   public static async create(args: Args_WxTab): Promise<WxTab> {
      let instance = new WxTab();
      await instance.initialize_WxTab(args);
      return instance;
   }

   protected async initialize_WxTab(args: Args_WxTab) {
      if (!args)
         args = new Args_WxTab()
      addWidgetClass(args, WxTab.CLASS_NAME);

      await super.initialize_AbstractTab(args);
   }
}