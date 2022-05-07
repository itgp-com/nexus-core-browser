import {Args_WgtText, Base_WgtText} from "./Base_WgtText";

/**
 * Textbox that defaults the following TextboxModel properties to the following values that are different than the EJ defaults:
 *
 * autocomplete: 'off'
 * floatLabelType: "Always"
 */
export class WgtText extends Base_WgtText {

   protected constructor() {
      super();
   }

   static create(args: Args_WgtText): WgtText {
      let t = new WgtText();
      t.initialize_WgtText(args);
      return t;
   }

   initialize_WgtText(args:Args_WgtText){
      super.initialize_Base_WgtText(args);
   }

} // main class