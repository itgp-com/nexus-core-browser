import {DashboardLayout, DashboardLayoutModel, PanelModel} from '@syncfusion/ej2-layouts';
import {AbstractWidget, addWidgetClass}                    from "../../AbstractWidget";
import {AnyWidgetStandard}                                 from "../../AnyWidgetStandard";
import {IArgs_HtmlTag_Utils}                               from "../../../BaseUtils";
import {Args_AnyWidget}                                    from "../../AnyWidget";

// export class WxDashboardLayout2 extends DashboardLayout implements BaseWidget {
//    // @ts-ignore
//    public setState: (state: any) => void;
//
//    constructor(options: DashboardLayoutModel, element: string | HTMLInputElement) {
//       super(options, element);
//       this.setState = (state: any) => {
//          if (state) {
//             // @ts-ignore
//             this.setProperties(state);
//          }
//       };
//    }
// }

export interface WxPanelModel extends PanelModel {
   /**
    * If present, its content will overwrite the 'content' property of the PanelModel.
    */
   contentWidget?: AbstractWidget | Promise<AbstractWidget>
   /**
    * If present, its content will overwrite the 'header' property of the PanelModel.
    */
   headerWidget?: AbstractWidget | Promise<AbstractWidget>

}

export interface WxDashboardLayoutModel extends DashboardLayoutModel {
   /**
    *
    * Defines the panels property of the DashboardLayout component.
    * Overwrites the original property from DashboardLayoutModel (of type PanelModel[]) with a new type (WxPanelModel[]).
    *
    * @default null
    */panels?: WxPanelModel[]
}

export class Args_WxDashboardLayout extends Args_AnyWidget<WxDashboardLayoutModel> {
}


export class WxDashboardLayout extends AnyWidgetStandard<DashboardLayout, Args_WxDashboardLayout, any> {
   static readonly CLASS_NAME: string = 'WxDashboardLayout';

   protected constructor() {
      super();
   }

   static async create(model: Args_WxDashboardLayout): Promise<WxDashboardLayout> {
      let wx = new WxDashboardLayout();
      await wx._initialize(model);
      return wx;
   }

   protected async _initialize(model: Args_WxDashboardLayout) {
      model           = IArgs_HtmlTag_Utils.init(model) as Args_WxDashboardLayout;
      model.ej        = model.ej || {};
      model.ej.panels = model.ej.panels || [];

      this.initArgs = model;
      addWidgetClass(model, WxDashboardLayout.CLASS_NAME);

      for (let i = 0; i < model.ej.panels.length; i++) {
         const extPanel: WxPanelModel = model.ej.panels[i];

         // resolve any Promises
         let widget             = await extPanel.contentWidget;
         extPanel.contentWidget = widget;

         if (widget instanceof AbstractWidget) {
            extPanel.content = await widget.initContent();
         } else {
            console.error('WxDashboardLayout: panel.widget is not an AbstractWidget');
         }
      } // for

      await this.initialize_AnyWidgetStandard(model);

   } // _initialize


   async localLogicImplementation() {
      let thisX = this;

      let widgetModel = this.initArgs?.ej;
      if (widgetModel == null)
         widgetModel = {};
      widgetModel.panels = this.initArgs.ej.panels;
      this.obj           = new DashboardLayout(widgetModel);
      this.obj.appendTo(this.hget);

      setTimeout(async () => {

         let extPanels: WxPanelModel[] = thisX.initArgs.ej.panels || [];
         for (let i = 0; i < extPanels.length; i++) {
            const extPanel = extPanels[i];

            try {
               if (extPanel.headerWidget instanceof AbstractWidget)
                  await extPanel.headerWidget.initLogic();
            } catch (e) {
               console.error('WxDashboardLayout: error initializing headerWidget', e);
            }

            try {
               if (extPanel.contentWidget instanceof AbstractWidget)
                  await extPanel.contentWidget.initLogic();

            } catch (e) {
               console.error('WxDashboardLayout: error initializing contentWidget', e);
            }


         } // for

      });

   } // localLogicImplementation


} // main class