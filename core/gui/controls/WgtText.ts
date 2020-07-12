import {Args_WgtText, WgtText_Abstract} from "./WgtText_Abstract";

/**
 * Textbox that defaults the following TextboxModel properties to the following values that are different than the EJ defaults:
 *
 * autocomplete: 'off'
 * floatLabelType: "Always"
 */
export class WgtText extends WgtText_Abstract {

   protected constructor() {
      super();
   }

   static create(args: Args_WgtText): WgtText {
      let t = new WgtText();
      t.initialize_WgtText(args);
      return t;
   }

} // main class