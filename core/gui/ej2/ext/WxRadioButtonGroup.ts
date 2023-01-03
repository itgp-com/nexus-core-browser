import {addWidgetClass}                                          from "../../AbstractWidget";
import {AbstractRadioButtonGroup, Args_AbstractRadioButtonGroup} from "../abstract/AbstractRadioButtonGroup";

export class Args_WxRadioButtonGroup extends Args_AbstractRadioButtonGroup {
}

export class WxRadioButtonGroup extends AbstractRadioButtonGroup {
static readonly CLASS_NAME:string = 'WxRadioButtonGroup';
   protected constructor() {
      super();
   }

   static async create<T>(args: Args_WxRadioButtonGroup):Promise<WxRadioButtonGroup> {
      let instance = new WxRadioButtonGroup()
      await instance.initialize_WxRadioButtonGroup(args);
      return instance;
   }

   protected async initialize_WxRadioButtonGroup(args: Args_WxRadioButtonGroup) {
      if (!args)
         args = new Args_WxRadioButtonGroup(); // so defaults are in place
      args.ej = args.ej || {};
      addWidgetClass(args, WxRadioButtonGroup.CLASS_NAME);

      await this.initialize_AbstractRadioButtonGroup(args);
   }
}