import {AbstractDateTimePicker, Args_AbstractDateTimePicker} from "../abstract/AbstractDateTimePicker";
import {addWidgetClass}                                      from "../../AbstractWidget";

export class Args_WxDateTimePicker extends Args_AbstractDateTimePicker {

}

export class WxDateTimePicker extends AbstractDateTimePicker {
static readonly CLASS_NAME:string = 'WxDateTimePicker';
   protected constructor() {
      super();
   }

   static async create(args: Args_WxDateTimePicker) {
      let instance = new WxDateTimePicker();
      await instance._initialize(args);
      return instance;
   }

   protected async _initialize(args: Args_WxDateTimePicker) {
      if (!args)
         args = new Args_WxDateTimePicker();
      args.ej = args.ej || {};
      addWidgetClass(args, WxDateTimePicker.CLASS_NAME);
      await super.initialize_AbstractDateTimePicker(args);
   }
}