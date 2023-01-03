import {SpeedDial, SpeedDialModel} from '@syncfusion/ej2-buttons';
import {AnyWidgetStandard}         from "../../AnyWidgetStandard";
import {Args_AnyWidget}            from "../../AnyWidget";
import {addWidgetClass}            from "../../AbstractWidget";
import {IArgs_HtmlTag_Utils}       from "../../../BaseUtils";

export class Args_WxSpeedDial extends Args_AnyWidget<SpeedDialModel> {
}


export class WxSpeedDial extends AnyWidgetStandard<SpeedDial, Args_WxSpeedDial, any> {
   static readonly CLASS_NAME: string = 'WxSpeedDial';

   protected constructor() {
      super();
   }

   static async create(args: Args_WxSpeedDial): Promise<WxSpeedDial> {
      let wx = new WxSpeedDial();
      await wx.initialize_WxSpeedDial_O1(args);
      return wx;
   }

   protected async initialize_WxSpeedDial_O1(args: Args_WxSpeedDial) {
      args          = IArgs_HtmlTag_Utils.init(args);
      this.initArgs = args;
      addWidgetClass(args, WxSpeedDial.CLASS_NAME);
      await this.initialize_AnyWidgetStandard(args);
   } // initialize_WWxSpeedDial_O1

   async localLogicImplementation() {
      let widgetModel = this.initArgs?.ej;
      if (widgetModel == null)
         widgetModel = {};

      let thisX = this;

      thisX.obj = new SpeedDial(widgetModel);
      thisX.obj.appendTo(thisX.hget);

   } // localLogicImplementation

} // WxDiagram