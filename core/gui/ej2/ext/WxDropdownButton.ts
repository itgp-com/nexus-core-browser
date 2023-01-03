import {addWidgetClass}                                      from "../../AbstractWidget";
import {AbstractDropDownButton, Args_AbstractDropDownButton} from "../abstract/AbstractDropDownButton";

export class Args_WxDropdownButton extends Args_AbstractDropDownButton {}

export class WxDropdownButton extends AbstractDropDownButton<Args_WxDropdownButton, any> {
static readonly CLASS_NAME:string = 'WxDropdownButton';
   protected constructor() {
      super();
   }

   static async create(args: Args_WxDropdownButton): Promise<WxDropdownButton> {
      let wx = new WxDropdownButton();
      await wx._initialize(args);
      return wx;
   }

   protected async _initialize(args: Args_WxDropdownButton) {
      if (!args)
         args = new Args_WxDropdownButton()
      args.ej   = args.ej || {};
      addWidgetClass(args, WxDropdownButton.CLASS_NAME);
      await super._initialize(args);
   } // _initialize

} // WxDropdownButton