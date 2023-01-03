import {addWidgetClass}                                    from "../../AbstractWidget";
import {AbstractRangeSelector, Args_AbstractRangeSelector} from "../abstract/AbstractRangeSelector";

export class Args_WxRangeSelector extends Args_AbstractRangeSelector {
}

export class WxRangeSelector extends AbstractRangeSelector {
static readonly CLASS_NAME:string = 'WxRangeSelector';
   protected constructor() {
      super();
   }

   public static async create(args: Args_WxRangeSelector) : Promise<WxRangeSelector>{
      let instance = new WxRangeSelector();
      await instance.initialize_WxRangeSelector(args);
      return instance;
   }

   protected async initialize_WxRangeSelector(args: Args_WxRangeSelector) {
      if (!args)
         args = new Args_WxRangeSelector();

      args.ej = args.ej || {};
      addWidgetClass(args, WxRangeSelector.CLASS_NAME);
      await super.initialize_AbstractRangeSelector(args);
   }
}