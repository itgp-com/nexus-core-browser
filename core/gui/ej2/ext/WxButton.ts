import {addWidgetClass}                      from "../../AbstractWidget";
import {Args_WxButtonPrimary}                from "../../ej2/ext/WxButtonPrimary";
import {AbstractButton, Args_AbstractButton} from "../abstract/AbstractButton";

export class Args_WxButton extends Args_AbstractButton {
   enterKeyEnabled ?: boolean;
}

export class WxButton extends AbstractButton {

   protected constructor() {
      super();
   }

   public static async create(args: Args_WxButton) : Promise<WxButton>{
      let instance = new WxButton();
      await instance._initialize(args);
      return instance;
   }

   protected async _initialize(args: Args_WxButton) {
      if (!args)
         args = new Args_WxButton();

      args.ej = args.ej || {};
      addWidgetClass(args, 'WxButton')
      await super.initialize_AbstractButton(args);
   }
   async localLogicImplementation(): Promise<void> {
      await super.localLogicImplementation();

      if (!(this.initArgs as Args_WxButtonPrimary).enterKeyEnabled) {
         //Do not respond to enter Key
         this.hgetButton.onkeydown = (ev) => {
            if (ev.key === 'Enter' && !ev.ctrlKey && !ev.altKey && !ev.metaKey && !ev.shiftKey) {
               ev.preventDefault();
            }
         };
      }

   }
}