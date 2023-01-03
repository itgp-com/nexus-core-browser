import {addWidgetClass}          from "../../AbstractWidget";
import {Args_WxButton, WxButton} from "../../ej2/ext/WxButton";
import {stringArgVal}            from "../../../BaseUtils";

export class Args_WxButtonFA extends Args_WxButton {
   /**
    * The Font Awesome HTML
    * Ex: <i class="fa-solid fa-plus"></i>
    */
   fontAwesomeHTML ?: string;
}

/**
 * Button that uses the Font Awesome icon set.
 */
export class WxButtonFA extends WxButton {
   protected constructor() {
      super();
   }

   static async create(args?: Args_WxButtonFA): Promise<WxButtonFA> {
      let instance = new WxButtonFA();
      await instance._initialize(args);
      return instance;
   }


   protected async _initialize(args: Args_WxButtonFA) {
      if (!args)
         args = new Args_WxButtonFA();
      args.ej = args.ej || {};
      addWidgetClass(args, 'WxButton_FontAwesome')

      let fontAwesomeHTML: string = args.fontAwesomeHTML
      if (fontAwesomeHTML == null)
         fontAwesomeHTML = '';
      if (fontAwesomeHTML.length > 0)
         fontAwesomeHTML += '&nbsp;' // add a space if not blank


      let originalLabel = args.label;
      args.label        = () => {
         let originalValue: string = stringArgVal(originalLabel);
         return `${fontAwesomeHTML}${originalValue}`
      }
      await super._initialize(args);
   }

}