import {addWidgetClass}                              from "../../AbstractWidget";
import {AbstractDatePicker, Args_AbstractDatePicker} from "../abstract/AbstractDatePicker";

export class Args_WxDatePicker extends Args_AbstractDatePicker {
}

export class WxDatePicker extends AbstractDatePicker {
static readonly CLASS_NAME:string = 'WxDatePicker';
   protected constructor() {
      super();
   }

   static async create(args: Args_WxDatePicker) {
      let instance = new WxDatePicker();
      await instance.initialize_Wej2DatePicker(args);
      return instance;
   }

   protected async initialize_Wej2DatePicker(args: Args_WxDatePicker) {
      if (!args)
         args = new Args_WxDatePicker();
      args.ej = args.ej || {};
      addWidgetClass(args, WxDatePicker.CLASS_NAME);
      await super.initialize_AbstractDatePicker(args);
   }
}