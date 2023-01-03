import {SplitButton, SplitButtonModel, ItemModel, MenuEventArgs} from '@syncfusion/ej2-splitbuttons';
import {AnyWidgetStandard}                                       from "../../AnyWidgetStandard";
import {Args_AnyWidget}                                          from "../../AnyWidget";
import {addWidgetClass}                                          from "../../AbstractWidget";
import {IArgs_HtmlTag_Utils}                                     from "../../../BaseUtils";

export class Args_WxSpeedDial extends Args_AnyWidget<SplitButtonModel> {
}


export class WxSplitButton extends AnyWidgetStandard<SplitButton, Args_WxSpeedDial, any> {
   static readonly CLASS_NAME: string = 'WxSplitButton';

   protected constructor() {
      super();
   }

   static async create(args: Args_WxSpeedDial): Promise<WxSplitButton> {
      let wx = new WxSplitButton();
      await wx.initialize_WWxSpeedDial_O1(args);
      return wx;
   }

   protected async initialize_WWxSpeedDial_O1(args: Args_WxSpeedDial) {
      args          = IArgs_HtmlTag_Utils.init(args);
      this.initArgs = args;
      addWidgetClass(args, WxSplitButton.CLASS_NAME);
      await this.initialize_AnyWidgetStandard(args);
   } // initialize_WWxSpeedDial_O1

   async localLogicImplementation() {
      let widgetModel = this.initArgs?.ej;
      if (widgetModel == null)
         widgetModel = {};

      this.obj = new SplitButton(widgetModel);
      this.obj.appendTo(this.hget);

   } // localLogicImplementation

} // WxDiagram