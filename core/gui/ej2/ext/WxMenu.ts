import {addWidgetClass}                  from "../../AbstractWidget";
import {AbstractMenu, Args_AbstractMenu} from "../abstract/AbstractMenu";

export class Args_WxMenu extends Args_AbstractMenu{}

export class WxMenu extends AbstractMenu {
   static readonly CLASS_NAME:string = 'WxMenu';
   protected constructor() {
      super();
   }

   static async create(args: Args_WxMenu):Promise<WxMenu> {
      let instance = new WxMenu();
      await instance._initialize(args);
      return instance;
   }

   protected async _initialize(args:Args_WxMenu){

      if (!args)
         args = new Args_WxMenu()
      args.ej = args.ej ||{};
      addWidgetClass(args,    WxMenu.CLASS_NAME);
      await super.initialize_AbstractMenu(args);
   }
}