import {IArgs_HtmlTag_Utils, StringArg, stringArgVal} from "../../BaseUtils";
import {Args_AnyWidget}                               from "../AnyWidget";
import {AnyWidgetStandard}                            from "../AnyWidgetStandard";
import {Button, ButtonModel}                          from '@syncfusion/ej2-buttons';
import {isFunction, isString}                         from "lodash";
import {addWidgetClass}                               from "../AbstractWidget";


export enum ButtonIconPosition {
   Left   = "Left",
   Right  = "Right",
   Bottom = "Bottom",
   Top    = "Top"
}

export abstract class Args_AbstractButton extends Args_AnyWidget<ButtonModel> {

   /**
    * function or string yielding the text or HTML that will overwrite the 'content' value of the ButtonModel
    */
   label ?: StringArg;

   /**
    * implement the onClick behavior of the button
    */
   onClick ?: (ev: MouseEvent) => void;

}


export abstract class AbstractButton extends AnyWidgetStandard<Button> {

   protected constructor() {
      super();
   }

   /**
    * Override this method to change arguments in extending classes
    * @param args
    */
   customizeArgs(args: Args_AbstractButton): Args_AbstractButton {
      return args;
   }

   async initialize_AbstractButton(args ?: Args_AbstractButton) {
      args = IArgs_HtmlTag_Utils.init(args);
      args.ej = args.ej ||{};
      addWidgetClass(args, 'AbstractButton');
      this.initArgs = args; // needed for setting this.value

      args = this.customizeArgs(args); // give extending classes a chance to modify

      if (!args.label)
         args.label = '';


      if (args.label || args.label == '')
         this.value = args.label; // set value takes care of functions or strings

      if (args.id)
         args.id = stringArgVal(args.id);

      // if (args.children)
      //    args.children = args.children;

      args.htmlTagType           = 'button';
      args.htmlOtherAttr['type'] = 'button';

      await this.initialize_AnyWidgetStandard(args);

   }


   async localLogicImplementation() {
      let args = this.initArgs as Args_AbstractButton;


      if (args.label)
         args.ej.content = stringArgVal(args.label);

      this.obj = new Button(args.ej);
      this.obj.appendTo(this.hgetButton);

      if (args.onClick) {
         this.hgetButton.onclick = args.onClick;
      }
   }

   async localRefreshImplementation() {
      let args = this.initArgs as Args_AbstractButton
      if (args.label && isFunction(args.label))
         this.value = args.label; // trigger the function and button repaint
      await super.localRefreshImplementation();
   }

   /**
    * Returns the StringArg that will become the content of the button
    */
   get value(): StringArg| any {
      return super.value;
   }

   /**
    * Will change the content of the button.
    * @param value StringArg value
    */
   set value(value: StringArg | any) {
      let existingValue = this.value;
      if (existingValue == null && value == null)
         return; // no change
      if (value != null && isString(value)) {
         // only if string, because if it's a function, that comparison would be invalid
         if (existingValue == value)
            return; // no changes
      }

      let args: Args_AbstractButton = this.initArgs as Args_AbstractButton;
      if (isFunction(value) || isString(value)) {
         try {
            args.label = value;
         } catch (e) {
            console.error(e);
         }
      }

      if (this.obj) {
         // this is the button content
         let val = this.convertValueBeforeSet(value);
         let val2 = stringArgVal(val);
         this.obj.content = val2;
         super.value = val2;
      }
   }

} // class WButton