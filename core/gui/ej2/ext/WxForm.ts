import {addWidgetClass}                  from "../../AbstractWidget";
import {AbstractForm, Args_AbstractForm} from "../abstract/AbstractForm";

export class Args_WxForm extends Args_AbstractForm {
}

export class WxForm extends AbstractForm {
static readonly CLASS_NAME:string = 'WxForm';
   protected constructor() {
      super();
   }

   public static async create(args: Args_WxForm): Promise<WxForm> {
      let instance = new WxForm();
      await instance._initialize(args);
      return instance;
   }

   protected async _initialize(args: Args_WxForm) {
      if (!args)
         args = new Args_WxForm();

      args.ej = args.ej || {};
      addWidgetClass(args, WxForm.CLASS_NAME);
      await super.initialize_AbstractForm(args);
   }
}