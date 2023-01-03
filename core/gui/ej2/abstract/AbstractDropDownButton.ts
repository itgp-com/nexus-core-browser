import {DropDownButton, DropDownButtonModel, ItemModel} from '@syncfusion/ej2-splitbuttons';
import {AnyWidgetStandard}                              from "../../AnyWidgetStandard";
import {Args_AnyWidget}                                 from "../../AnyWidget";
import {addWidgetClass}                                 from "../../AbstractWidget";
import {IArgs_HtmlTag_Utils}                            from "../../../BaseUtils";

export class Args_AbstractDropDownButton extends Args_AnyWidget<DropDownButtonModel>{}

export class AbstractDropDownButton<ARGS_ANY_WIDGET extends Args_AbstractDropDownButton = Args_AbstractDropDownButton, DATA_TYPE = any>
   extends AnyWidgetStandard<DropDownButton, ARGS_ANY_WIDGET, DATA_TYPE>{

   protected constructor() {
      super();
   }

   protected async _initialize(args:ARGS_ANY_WIDGET){
      IArgs_HtmlTag_Utils.init(args);
      args.ej = args.ej ||{};
      args.htmlTagType = 'ul'; // DropDownButton needs a ul tag
      addWidgetClass(args, 'AbstractDropDownButton');
      await super.initialize_AnyWidgetStandard(args);
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