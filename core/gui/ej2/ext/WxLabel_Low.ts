import {IArgs_HtmlTag_Utils}       from "../../../BaseUtils";
import {Args_WxLabel, WxLabel} from "../../ej2/ext/WxLabel";
import {CssStyle}              from "../../AbstractWidget";


export class Args_WgtLbl_App_Low extends Args_WxLabel {
   /**
    * If true, the default style text of the component will not be used. You can then use completely custom styles by specifying the <code>htmlTagType</code> contents
    */
   no_default_style?: boolean;

   default_margin_top_pixels?: number;
   default_margin_right_pixels?: number;
   default_align_self?: string;

} // Args_WgtLbl

/**
 * The text of this label is lined up to the low part of the control
 * for best alignment with other components like dropdowns, textfields, etc in horizontal
 * layouts
 */
export class WxLabel_Low extends WxLabel {

   protected constructor() {
      super();
   }

   static async create(args: Args_WgtLbl_App_Low): Promise<WxLabel_Low> {
      let instance: WxLabel_Low = new WxLabel_Low();
      await instance.initialize_WxLabel_Low(args);
      return instance;
   }

   async initialize_WxLabel_Low(args: Args_WgtLbl_App_Low) {
      args = IArgs_HtmlTag_Utils.init(args) as Args_WgtLbl_App_Low;
      if (!args.ej)
         args.ej = {};

      let style: CssStyle = {};
      if (args?.no_default_style) {
         style = {}; // no default style
      } else {

         let default_align_self = args?.default_align_self;
         if (!default_align_self) {
            default_align_self = 'center';
         }

         let default_margin_top_pixels = args?.default_margin_top_pixels;
         if (!default_margin_top_pixels)
            default_margin_top_pixels = -8;


         let default_margin_right_pixels = args?.default_margin_right_pixels;
         if (!default_margin_right_pixels) {
            default_margin_right_pixels = 10;
         }
         style = {
            display:        `flex`,
            "align-self":   `${default_align_self}`,
            "margin-top":   `${default_margin_top_pixels}px`,
            "margin-right": `${default_margin_right_pixels}px`,

         };
      } // if default style

      if (args?.htmlTagStyle)
         Object.assign(style, args.htmlTagStyle);

      args.htmlTagStyle = style; // new style to be applied to the component

      await super.initialize_WxLabel(args)
   } // initialize_WgtLbl
}