import {addWidgetClass}                  from "../../AbstractWidget";
import {AbstractText, Args_AbstractText} from "../abstract/AbstractText";

export class Args_WxText extends Args_AbstractText {
}

export class WxText extends AbstractText {
   static readonly CLASS_NAME: string = 'WxText';

   protected constructor() {
      super();
   }


   public static async create(args: Args_WxText): Promise<WxText> {
      let instance = new WxText();
      await instance.initialize_WxText(args);
      return instance;
   }

   protected async initialize_WxText(args: Args_WxText) {
      if (!args)
         args = new Args_WxText();
      args.ej = args.ej || {};
      addWidgetClass(args, WxText.CLASS_NAME);
      await super.initialize_AbstractText(args);
   }

} // WgtText_App