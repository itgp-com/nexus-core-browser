import {addWidgetClass}                                from "../../AbstractWidget";
import {AbstractColorPicker, Args_AbstractColorPicker} from "../abstract/AbstractColorPicker";

export class Args_WxColorPicker extends Args_AbstractColorPicker {
}

export class WxColorPicker extends AbstractColorPicker {
static readonly CLASS_NAME:string = 'WxColorPicker';
   protected constructor() {
      super();
   }

   static async create(args: Args_WxColorPicker) {
      let instance = new WxColorPicker();
      await instance._initialize(args);
      return instance;
   }

   protected async _initialize(args: Args_WxColorPicker) {
      if (!args)
         args = new Args_WxColorPicker();
      args.ej = args.ej || {};
      addWidgetClass(args, WxColorPicker.CLASS_NAME);
      await super.initialize_AbstractColorPicker(args);
   }
} 