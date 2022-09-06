import {AnyWidgetStandard}             from "../AnyWidgetStandard";
import {RadioButton, RadioButtonModel} from "@syncfusion/ej2-buttons";
import {Args_AnyWidget}                from "../AnyWidget";
import {IArgs_HtmlTag_Utils}           from "../../BaseUtils";
import {addWidgetClass}                from "../AbstractWidget";
import {ChangeArgs}                    from "@syncfusion/ej2-buttons/src/radio-button/radio-button";
import {AbstractRadioButtonGroup}      from "./AbstractRadioButtonGroup";


export class Args_AbstractRadioButton extends Args_AnyWidget<RadioButtonModel> {

}

export abstract class AbstractRadioButton extends AnyWidgetStandard<RadioButton, Args_AbstractRadioButton, any> {

   /**
    * This variable is set during {@link set value} so that if the developer implements a change method on the radiobutton
    * they also have this extra information to know that the change occurred by a call to set value.
    *
    * This variable is ALWAYS reset to false after the execution of the change method.
    */
   isSetValueInProgress: boolean;

   protected constructor() {
      super();
   }

   protected async initialize_AbstractRadioButton(args: Args_AbstractRadioButton) {
      args    = IArgs_HtmlTag_Utils.init(args) as any;
      args.ej = args.ej || {};
      // if (!args.ej.name) {
      //    console.error(`AbstractRadioButton arguments must contain args.ej.name property! Current args are:\n${JSON.stringify(this.initArgs, null, 2)} `);
      //    args.ej.name = args.propertyName || 'defaultRadioButtonName'; // attempt a fix
      // }
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
      let thisX  = this;
      let anchor = this.hgetInput;
      if (anchor) {


         // Wrap any change method so that the isSetValueInProgress can be reset at the end of any change
         let existingChangeMethod = this.initArgs.ej.change;
         this.initArgs.ej.change  = (ev: ChangeArgs) => {

            try {

               let group: AbstractRadioButtonGroup = thisX.findAncestor(instance => {
                  return instance instanceof AbstractRadioButtonGroup;
               });
               if (group) {
                  group.value = ev.value;
               }
               if (existingChangeMethod)
                  existingChangeMethod.call(this, ev);
            } finally {
            }
         }

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

   get value(): boolean {
      if (this.obj) {
         return this.obj.checked;
      }
      return false;
   }

   /** Sets, unsets checked property */
   set value(val: boolean | any) {
      if (this.obj) {
         let checked: boolean = val;
         if (val == null)
            checked = false;

         this.isSetValueInProgress = true;
         try {
            this.obj.checked             = checked;
            let radioButtonValue: string = this.initArgs?.ej?.value; // update dataset with actual value of the radiobutton
            if (checked) {
               // update the underlying dataProvider
               super.value = radioButtonValue;
            } else {
               super.valueNoDataProvider = radioButtonValue;
            }
         } finally {
            this.isSetValueInProgress = false;
         }

      } // if this.obj
   } // set value


   convertValueBeforeSet(val: any): string {
      if (val == null)
         val = ''; // default null, undefined to ''
      return val.toString();
   }


} //main