import {addWidgetClass}              from "../../AbstractWidget";
import {Args_WxButtonFA, WxButtonFA} from "./WxButtonFA";

export class Args_WxButton_AddIcon extends Args_WxButtonFA {
}

export class WxButtonPlusIcon extends WxButtonFA {

   protected constructor() {
      super();
   }

   static async create(args?: Args_WxButton_AddIcon): Promise<WxButtonPlusIcon> {
      let instance = new WxButtonPlusIcon();
      await instance._initialize(args);
      return instance;
   }

   protected async _initialize(args: Args_WxButton_AddIcon) {
      if (!args)
         args = new Args_WxButton_AddIcon();
      // args.ej = args.ej || {};
      addWidgetClass(args, 'WxButton_AddIcon')

      if (!args.fontAwesomeHTML)
         args.fontAwesomeHTML = `<i class="fa-solid fa-plus"></i>`; // default to this html

      args.ej.isPrimary = true;

      await super._initialize(args);
   }
} //main