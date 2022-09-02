import {Menu, MenuModel, MenuItemModel}     from '@syncfusion/ej2-navigations';
import {AnyWidgetStandard}   from "../AnyWidgetStandard";
import {Args_AnyWidget}      from "../AnyWidget";
import {addWidgetClass}      from "../AbstractWidget";
import {IArgs_HtmlTag_Utils} from "../../BaseUtils";

export class Args_AbstractMenu extends Args_AnyWidget<MenuModel>{}

export class AbstractMenu extends AnyWidgetStandard<Menu>{

   protected constructor() {
      super();
   }

   protected async initialize_AbstractMenu(args:Args_AbstractMenu){
      if (!args)
         args = new Args_AbstractMenu();
      IArgs_HtmlTag_Utils.init(args);
      args.ej = args.ej ||{};
      args.htmlTagType = 'ul'; // menu needs a ul tag
      addWidgetClass(args, 'AbstractMenu');
      await this.initialize_AnyWidgetStandard(args);
   }

   async localLogicImplementation(): Promise<void> {
      this.obj = new Menu(this.initArgs.ej);
      this.obj.appendTo(this.hget);
   }

   get value(): any {
      if (this.obj)
         return this.obj.items;
   }

   /**
    *
    * @param value Must be of type {@link MenuItemModel[]}
    */
   set value(value: any | MenuItemModel[]) {
      if (this.obj) {
         this.obj.items = value;
         super.value = value;
      }
   }

}