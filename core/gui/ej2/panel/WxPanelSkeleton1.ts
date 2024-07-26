import {CssStyle} from '../../../CssUtils';
import {AnyWidgetStandard}        from "../../AnyWidgetStandard";
import {Args_AnyWidget}           from "../../AnyWidget";
import {AbstractWidget} from "../../AbstractWidget";
import {WxPanel}                  from "../../ej2/ext/WxPanel";
import {WxSkeleton}               from "../../ej2/ext/WxSkeleton";
import {cloneDeep}                from "lodash";

export class Args_WxPanelSkeleton1 extends Args_AnyWidget {
   widget: (AbstractWidget | Promise<AbstractWidget>);
}


export class WxPanelSkeleton1 extends AnyWidgetStandard {

   skeletonPanel: WxSkeleton;
   widget: AbstractWidget;
   originalStyle: CssStyle;

   protected constructor() {
      super();
   }

   static async create(args: Args_WxPanelSkeleton1): Promise<WxPanelSkeleton1> {
      let instance = new WxPanelSkeleton1();
      await instance.initialize_WxSkeletonPanel_1(args);
      return instance;
   }


   async initialize_WxSkeletonPanel_1(args: Args_WxPanelSkeleton1) {
      if (!args)
         throw 'Arguments are required!';
      let thisX = this;

      thisX.widget = await args.widget;

      args.htmlTagStyle   = args.htmlTagStyle || {};
      thisX.originalStyle = cloneDeep(args.htmlTagStyle);
      // overwrite the style attributes we care about
      args.htmlTagStyle   = {width: '100%', height: '100%'};
      Object.assign(
         args.htmlTagStyle,
         thisX.originalStyle,
         {
            position: 'relative', // needed for z-order
         });

      args.children = [
         WxSkeleton.create({
                                     onInitialized: (widget) => thisX.skeletonPanel = widget,
                                     ej:            {
                                        width:  '100%',
                                        height: '100%',
                                     }
                                  }),
         WxPanel.create({
                           htmlTagStyle: {
                              position:  'absolute',
                              "z-index": -1,

                           },
                           children:     [
                              thisX.widget
                           ],
                        }),

      ];


      await this.initialize_AnyWidgetStandard(args);
   } // initialize_WxSkeletonPanel_1

   hideSkeleton() {
      if (!this.skeletonPanel)
         return;


      let widgetElem = this.widget.hget;

      this.skeletonPanel.hget.remove();
      this.skeletonPanel = null;

      let hElem = this.hget;

      // remove all children
      hElem.childNodes.forEach((child) => {
         hElem.removeChild(child);
      });


      hElem.style.position = (this.originalStyle.position ? this.originalStyle.position : null);
      hElem.style.width    = (this.originalStyle.width ? this.originalStyle.width : null);
      hElem.style.height   = (this.originalStyle.height ? this.originalStyle.height : null);

      hElem.appendChild(widgetElem);
   }


} // WxSkeletonPanel_1