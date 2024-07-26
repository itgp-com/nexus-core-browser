import {CssStyle} from '../../../CssUtils';
import {AnyWidgetStandard}        from "../../AnyWidgetStandard";
import {Args_AnyWidget}           from "../../AnyWidget";
import {AbstractWidget} from "../../AbstractWidget";
import {WxSkeleton}               from "../../ej2/ext/WxSkeleton";
import {cloneDeep}                from "lodash";
import {resolveWidgetArray}       from "../../WidgetUtils";
import {htmlToElement}            from "../../../BaseUtils";

export class Args_WxPanelSkeleton2 extends Args_AnyWidget {
   timeoutDelayAfterSkeletonInitialization?: number;
}

/**
 * Skeleton panel that automatically hides the skeleton.
 * Can handle multiple
 */
export class WxPanelSkeleton2 extends AnyWidgetStandard {

   skeletonPanel: WxSkeleton;
   originalChildren: (AbstractWidget | Promise<AbstractWidget>)[];
   originalStyle: CssStyle;

   protected constructor() {
      super();
   }

   static async create(args: Args_WxPanelSkeleton2): Promise<WxPanelSkeleton2> {
      let instance = new WxPanelSkeleton2();
      await instance.initialize_WxSkeletonPanel_2(args);
      return instance;
   }

   async initialize_WxSkeletonPanel_2(args: Args_WxPanelSkeleton2) {
      if (!args)
         throw 'Arguments are required!';
      let thisX = this;


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

      thisX.originalChildren = args.children;
      args.children          = [
         WxSkeleton.create({
                                     onInitialized: (widget) => thisX.skeletonPanel = widget,
                                     ej:            {
                                        width:  '100%',
                                        height: '100%',

                                     }
                                  }),


      ];

      let user_onChildrenInitialized = args.onChildrenInitialized;
      args.onChildrenInitialized     = async (wx:WxPanelSkeleton2) => {
         // this gets called after the skeleton panel is initialized
         // it sets up a delayed repaint of the children components

         let timeoutDelay:number = args.timeoutDelayAfterSkeletonInitialization || 30;// the 30ms delay is needed to allow the browser to render the skeleton panel before we remove it. Why 30ms? Trial and error
         setTimeout(async () => {
            wx.removeChild(thisX.skeletonPanel)
            wx.children = await resolveWidgetArray(thisX.originalChildren);
            await repaintChildren({
                                     widget: wx,
                                  });

            if (user_onChildrenInitialized) {
               try {
                  await user_onChildrenInitialized(wx);
               } catch (e) {
                  console.error(e);
               }
            } // if user_onChildrenInitialized

         }, timeoutDelay);
      }


      await this.initialize_AnyWidgetStandard(args);
   } // initialize_WxSkeletonPanel_2
} // WxPanelSkeleton2


export type ArgsRepaintChildren = {
   widget: AbstractWidget;
}
async function repaintChildren(args: ArgsRepaintChildren) {
   let widget = args.widget;
   if (!widget)
      return;
   let children: AbstractWidget[] = widget.children;

   let widgetElement = widget.hget;
   if (widgetElement) {
      // https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
      widgetElement.textContent = ''; // remove ALL child element of this HTMLElement
      // textContent is VERY different from innerText. It contains all HTML, but when using innerHTML
      // the browser has to reparse the DOM. With textContent it does not, so it's much faster.
   } // if (widgetElement)


   // Add all the HTML elements back in
   for (let i = 0; i < children.length; i++) {
      const childWidget = children[i];
      childWidget.resetInitialize(); // mark as not initialized

      try {
         let htmlString: string       = await childWidget.initContent();
         let htmlElement: HTMLElement = htmlToElement(htmlString);
         widgetElement.appendChild(htmlElement);

         await childWidget.initLogic(); //TODO investigate possible parallel initialization
      } catch (e) {
         console.error(e);
      }
   } // for (let i = 0; i < children.length; i++)

} // repaintChildren