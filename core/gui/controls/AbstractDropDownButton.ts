import {DropDownButton, DropDownButtonModel, ItemModel} from '@syncfusion/ej2-splitbuttons';
import {AnyWidgetStandard}                              from "../AnyWidgetStandard";
import {Args_AnyWidget}                                 from "../AnyWidget";
import {addWidgetClass}                                 from "../AbstractWidget";
import {IArgs_HtmlTag_Utils}                            from "../../BaseUtils";

export class Args_AbstractDropDownButton extends Args_AnyWidget<DropDownButtonModel>{}

export class AbstractDropDownButton extends AnyWidgetStandard<DropDownButton>{

   protected constructor() {
      super();
   }

   protected async initialize_AbstractDropDownButton(args:Args_AbstractDropDownButton){
      if (!args)
         args = new Args_AbstractDropDownButton();
      IArgs_HtmlTag_Utils.init(args);
      args.ej = args.ej ||{};
      args.htmlTagType = 'ul'; // DropDownButton needs a ul tag
      addWidgetClass(args, 'AbstractDropDownButton');
      await this.initialize_AnyWidgetStandard(args);
   }

   async localLogicImplementation(): Promise<void> {
      this.obj = new DropDownButton(this.initArgs.ej);
      this.obj.appendTo(this.hget);
   }

   get value(): any {
      if (this.obj)
         return this.obj.items;
   }

   /**
    *
    * @param value Must be of type {@link ItemModel[]}
    */
   set value(value: any | ItemModel[]) {
      if (this.obj) {
         this.obj.items = value;
         this.value = value;
      }
   }

}