import {IArgs_HtmlTag_Utils}                   from "../../../BaseUtils";
import {addWidgetClass}                        from "../../AbstractWidget";
import {AbstractDiagram, Args_AbstractDiagram} from "../abstract/AbstractDiagram";

export class Args_WxDiagram extends Args_AbstractDiagram {
}


export class WxDiagram extends AbstractDiagram<Args_WxDiagram> {
   static readonly CLASS_NAME: string = 'WxDiagram';

   protected constructor() {
      super();
   }

   static async create(args: Args_WxDiagram): Promise<WxDiagram> {
      let wx = new WxDiagram();
      await wx._initialize(args);
      return wx;
   }

   protected async _initialize(args: Args_WxDiagram) {
      if (!args)
         args = new Args_WxDiagram();
      args.ej = args.ej || {};
      args    = IArgs_HtmlTag_Utils.init(args);
      addWidgetClass(args, WxDiagram.CLASS_NAME);
      await super._initialize(args);
   } // initialize_WxDiagram2


} // WxDiagram