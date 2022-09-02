import {AnyWidgetStandard}             from "../AnyWidgetStandard";
import {RadioButton, RadioButtonModel} from "@syncfusion/ej2-buttons";
import {Args_AnyWidget}                from "../AnyWidget";
import {IArgs_HtmlTag_Utils}           from "../../BaseUtils";
import {addWidgetClass}                from "../AbstractWidget";


export class Args_AbstractRadioButton extends Args_AnyWidget<RadioButtonModel> {

}

export abstract class AbstractRadioButton extends AnyWidgetStandard<RadioButton, Args_AbstractRadioButton, any> {

   protected constructor() {
      super();
   }

   protected async initialize_AbstractRadioButton(args: Args_AbstractRadioButton) {
      args    = IArgs_HtmlTag_Utils.init(args) as any;
      args.ej = args.ej || {};
      if (!args.ej.name) {
         console.error(`AbstractRadioButton arguments must contain args.ej.name property! Current args are:\n${JSON.stringify(this.initArgs, null, 2)} `);
         args.ej.name = args.propertyName || 'defaultRadioButtonName'; // attempt a fix
      }
      args.htmlTagType           = 'input'
      args.htmlOtherAttr['type'] = 'radio'; // must be input tag with type = 'radio'
      args.htmlOtherAttr['name'] = args.ej.name; // 'name' attribute must exist

      addWidgetClass(args, 'AbstractRadioButton');
      await this.initialize_AnyWidgetStandard(args);
   } // initialize_


   async localContentBegin(): Promise<string> {
      return super.localContentBegin();
   }

   async localLogicImplementation(): Promise<void> {
      let anchor = this.hgetInput;
      if (anchor) {
         this.obj = new RadioButton(this.initArgs.ej);
         this.obj.appendTo(anchor);
      } else {
         console.error(`No input HTMLElement for AbstractRadioButton with following args:\n${JSON.stringify(this.initArgs, null, 2)} `);
      }
      return super.localLogicImplementation();
   }

   async localClearImplementation(): Promise<void> {
      if (this.obj) {
         this.obj.checked = false;
      }
   }

   get value(): string {
      if (this.obj) {
         return this.obj.value;
      }
      return '';
   }

   set value(val: string | any) {
      if (this.obj) {
         val            = this.convertValueBeforeSet(val);
         this.obj.value = val;
         super.value    = val;
      }
   }


   convertValueBeforeSet(val: any): string {
      if (val == null)
         val = ''; // default null, undefined to ''
      return val.toString();
   }


} //main