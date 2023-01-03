import {addWidgetClass}                                from "../../AbstractWidget";
import {AbstractRadioButton, Args_AbstractRadioButton} from "../abstract/AbstractRadioButton";

export class Args_WxRadioButton extends Args_AbstractRadioButton {
}

export class WxRadioButton extends AbstractRadioButton {
   static readonly CLASS_NAME:string = 'WxRadioButton';
   protected constructor() {
      super();
   }

   public static async create(args?: Args_WxRadioButton): Promise<WxRadioButton> {
      if (!args)
         args = new Args_WxRadioButton()
      addWidgetClass(args, WxRadioButton.CLASS_NAME);

      let instance = new WxRadioButton();
      await instance._initialize(args);
      return instance;
   }

   protected async _initialize(args: Args_WxRadioButton) {
      await super.initialize_AbstractRadioButton(args);
   }

}