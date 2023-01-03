import {addWidgetClass}          from "../../AbstractWidget";
import {Args_WxButton, WxButton} from "./WxButton";

export class Args_WxButtonPrimary extends Args_WxButton {
}

/**
 *
 * Refreshes button label and icon on parent refresh
 */
export class WxButtonPrimary extends WxButton {
   static readonly CLASS_NAME:string = 'WxButtonPrimary';

   protected constructor() {
      super();
   }

   static async create(args?: Args_WxButtonPrimary): Promise<WxButtonPrimary> {
      let instance = new WxButtonPrimary();
      await instance._initialize(args);
      return instance;
   }

   protected async _initialize(args: Args_WxButtonPrimary){
      if (!args)
         args = new Args_WxButtonPrimary();
      args.ej = args.ej || {};
      addWidgetClass(args, WxButtonPrimary.CLASS_NAME);
      args.ej.isPrimary = true;
      await super._initialize(args);
   }

}