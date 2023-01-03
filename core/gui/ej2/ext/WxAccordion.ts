import {addWidgetClass}                            from "../../AbstractWidget";
import {AbstractAccordion, Args_AbstractAccordion} from "../abstract/AbstractAccordion";

export class Args_WxAccordion extends Args_AbstractAccordion {
}

export class WxAccordion extends AbstractAccordion {
static readonly CLASS_NAME:string = 'WxAccordion';
   protected constructor() {
      super();
   }

   public static async create(args: Args_WxAccordion) : Promise<WxAccordion>{
      let instance = new WxAccordion();
      await instance.initialize_WxAccordion(args);
      return instance;
   }

   protected async initialize_WxAccordion(args: Args_WxAccordion) {
      if (!args)
         args = new Args_WxAccordion();

      args.ej = args.ej || {};
      addWidgetClass(args, WxAccordion.CLASS_NAME);
      await super.initialize_AbstractAccordion(args);
   }
}