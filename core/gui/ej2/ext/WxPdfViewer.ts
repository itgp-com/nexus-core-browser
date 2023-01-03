import {addWidgetClass}                            from "../../AbstractWidget";
import {AbstractPdfViewer, Args_AbstractPdfViewer} from "../abstract/AbstractPdfViewer";

export class Args_WxPdfViewer extends Args_AbstractPdfViewer {
}

export class WxPdfViewer extends AbstractPdfViewer {
   static readonly CLASS_NAME:string = 'WxPdfViewer';
   protected constructor() {
      super();
   }

   public static async create(args: Args_WxPdfViewer) {
      let instance = new WxPdfViewer();
      await instance._initialize(args);
      return instance;
   }

   protected async _initialize(args: Args_WxPdfViewer) {
      if (!args)
         args = new Args_WxPdfViewer();
      args.ej = args.ej || {};
      addWidgetClass(args, WxPdfViewer.CLASS_NAME);

      await super.initialize_AbstractPdfViewer(args);
   }


}