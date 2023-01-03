import {addWidgetClass}                                      from "../../AbstractWidget";
import {AbstractRichTextEditor, Args_AbstractRichTextEditor} from "../abstract/AbstractRichTextEditor";

export class Args_WxRichTextEditor extends Args_AbstractRichTextEditor {
}

// noinspection JSUnusedGlobalSymbols
export class WxRichTextEditor extends AbstractRichTextEditor {
static readonly CLASS_NAME:string = 'WxRichTextEditor';
   protected constructor() {
      super();
   }


   public static async create(args: Args_WxRichTextEditor) : Promise<WxRichTextEditor>{
      let instance = new WxRichTextEditor();
      await instance.initialize_WxRichTextEditor(args);
      return instance;
   }

   protected async initialize_WxRichTextEditor(args: Args_WxRichTextEditor) {
      if (!args)
         args = new Args_WxRichTextEditor();
      args.ej = args.ej || {};
      addWidgetClass(args, WxRichTextEditor.CLASS_NAME);
      await super.initialize_AbstractRichTextEditor(args);
   }
} // main