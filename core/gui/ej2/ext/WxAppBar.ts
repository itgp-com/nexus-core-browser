import {AppBar, AppBarModel} from '@syncfusion/ej2-navigations';
import {AnyWidgetStandard}   from "../../AnyWidgetStandard";
import {Args_AnyWidget}      from "../../AnyWidget";
import {IArgs_HtmlTag_Utils} from "../../../BaseUtils";
import {addWidgetClass}      from "../../AbstractWidget";

export class Args_WxAppBar extends Args_AnyWidget<AppBarModel> {
}


export class WxAppBar extends AnyWidgetStandard<AppBar, Args_WxAppBar, any> {
   static readonly CLASS_NAME: string = 'WxAppBar';

   protected constructor() {
      super();
   }

   static async create(args: Args_WxAppBar): Promise<WxAppBar> {
      let wx = new WxAppBar();
      await wx._initialize(args);
      return wx;
   }

   protected async _initialize(args: Args_WxAppBar) {
      args          = IArgs_HtmlTag_Utils.init(args);
      this.initArgs = args;
      addWidgetClass(args, WxAppBar.CLASS_NAME);
      await this.initialize_AnyWidgetStandard(args);
   } //  initialize_WxAppBar_Orca01

   async localLogicImplementation() {
      let widgetModel = this.initArgs?.ej;
      if (widgetModel == null)
         widgetModel = {};

      let thisX = this;

      thisX.obj = new AppBar(widgetModel);
      thisX.obj.appendTo(thisX.hget);

   } // localLogicImplementation

} // WxDiagram