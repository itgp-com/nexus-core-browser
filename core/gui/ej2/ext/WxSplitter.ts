import {addWidgetClass}                          from "../../AbstractWidget";
import {AbstractSplitter, Args_AbstractSplitter} from "../abstract/AbstractSplitter";

export class Args_WxSplitter extends Args_AbstractSplitter {
}

export class WxSplitter extends AbstractSplitter {
   static readonly CLASS_NAME: string = 'WxSplitter';

   protected constructor() {
      super();
   }

   static async create(args: Args_WxSplitter): Promise<WxSplitter> {
      let instance = new WxSplitter();
      await instance.initialize_WxSplitter(args);
      return instance;
   }

   protected async initialize_WxSplitter(args: Args_WxSplitter) {

      if (!args)
         args = new Args_WxSplitter()
      args.ej = args.ej || {};
      addWidgetClass(args, WxSplitter.CLASS_NAME);
      await super.initialize_AbstractSplitter(args);
   }
}