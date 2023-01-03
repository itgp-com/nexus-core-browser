import {addWidgetClass}                      from "../../AbstractWidget";
import {AbstractUpload, Args_AbstractUpload} from "../abstract/AbstractUpload";

export class Args_WxUpload extends Args_AbstractUpload {
}

export class WxUpload extends AbstractUpload {
   static readonly CLASS_NAME: string = 'WxUpload';

   protected constructor() {
      super();
   }

   public static async create(args: Args_WxUpload): Promise<WxUpload> {
      let instance = new WxUpload();
      await instance.initialize_WxUpload(args);
      return instance;
   }

   protected async initialize_WxUpload(args: Args_WxUpload) {
      if (!args)
         args = new Args_WxUpload();

      args.ej = args.ej || {};
      addWidgetClass(args, WxUpload.CLASS_NAME);
      await super.initialize_AbstractUpload(args);
   }
}