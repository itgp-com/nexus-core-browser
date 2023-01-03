import {addWidgetClass}                          from "../../AbstractWidget";
import {AbstractCheckBox, Args_AbstractCheckBox} from "../abstract/AbstractCheckBox";

export class Args_WxCheckBox extends Args_AbstractCheckBox{}

export class WxCheckBox extends AbstractCheckBox {
   static readonly CLASS_NAME:string = 'WxCheckBox';

   protected constructor() {
      super();
   }

   static async create(args: Args_WxCheckBox):Promise<WxCheckBox> {
      let instance = new WxCheckBox();
      await instance._initialize(args);
      return instance;
   }

   protected async _initialize(args:Args_WxCheckBox){

      if (!args)
         args = new Args_WxCheckBox()
      args.ej = args.ej ||{};
      addWidgetClass(args, WxCheckBox.CLASS_NAME);

      if (args.modelTrueValue == undefined)
         args.modelTrueValue = 'Yes';

      if (args.modelFalseValue == undefined)
         args.modelFalseValue = 'No';

      if (args.modelTrueValueAlternates == undefined)
         args.modelTrueValueAlternates = ['1', 'True', 'true', 'yes'];

      await this.initialize_AbstractCheckBox(args);
   }
}