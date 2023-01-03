import {addWidgetClass}                        from "../../AbstractWidget";
import {AbstractSidebar, Args_AbstractSidebar} from "../abstract/AbstractSidebar";

export class Args_WxSidebar extends Args_AbstractSidebar{}

export class WxSidebar extends AbstractSidebar {
   static readonly CLASS_NAME:string = 'WxSidebar';


   protected constructor() {
      super();
   }

   static async create(args: Args_WxSidebar):Promise<WxSidebar> {
      let instance = new WxSidebar();
      await instance.initialize_WxSidebar(args);
      return instance;
   }

   protected async initialize_WxSidebar(args:Args_WxSidebar){

      if (!args)
         args = new Args_WxSidebar()
      args.ej = args.ej ||{};
      addWidgetClass(args, WxSidebar.CLASS_NAME);
      await super.initialize_AbstractSidebar(args);
   }
}