import {RadioButton, RadioButtonModel}            from '@syncfusion/ej2-buttons';
import {enableRipple}                             from '@syncfusion/ej2-base';
import {Args_WgtSimple, WgtSimple}                from "./WgtSimple";
import {Args_AnyWidget, IArgs_HtmlTag_Utils}      from "../Args_AnyWidget";
import {getRandomString, StringArg, stringArgVal} from "../../CoreUtils";
import {ChangeArgs}                               from "@syncfusion/ej2-buttons/src/radio-button/radio-button";
import {DataProvider, IDataProviderSimple}        from "../../data/DataProvider";
import {getErrorHandler}                          from "../../CoreErrorHandling";

export class Args_WgtRadioButton extends Args_WgtSimple<RadioButtonModel> {

   records: any[];
   valueFieldName ?: StringArg;
   /**
    * Takes precedence over valueFieldName
    */
   valueFunction ?:((record:any)=>string);

   labelFieldName ?: StringArg;

   /**
    * Takes precedence over labelFieldName
    */
   labelFunction ?:((record:any)=>string);

   change ?: ((evt: ChangeArgs) => void);
   horizontalLayout ?:boolean;
   cssButtonClass ?:string;
   cssButtonClassFunction ?: ((record:any)=>string);


   starting_choice ?: string;  // defaults to null
   not_selected_value ?: string; // defaults to null
}

/**
 * Abstract implementation of a group of Syncfusion radio buttons
 */
export abstract class WgtRadioButton<ARG_CLASS extends Args_WgtRadioButton = Args_WgtRadioButton> extends WgtSimple<Map<string, RadioButton>, Args_AnyWidget, string> {
   private _args: Args_WgtRadioButton;
   private _value: string;
   private _label: string
   private _radioButton: RadioButton;

   protected constructor() {
      super();
   }


   initialize_WgtRadioButton(args: ARG_CLASS) {
      let thisX = this;
      this.obj  = new Map<string, RadioButton>();

      if (!args)
         throw "There are no args in call to initialize_WgtDropDown(args) !";

      if (!args.ej)
         args.ej = {};

      this.wrapperTagID = (args.propertyName == null ? getRandomString('radioButtonGroup') : getRandomString(args.propertyName));

      this._args = args;

      this.initialize_WgtSimple(args);
   }

   async localContentBegin(): Promise<string> {
      let x: string = "";

      x += `<div id="${this.wrapperTagID}"${IArgs_HtmlTag_Utils.all(this._args.wrapper)}>`;

      if (this._args.records != null && this._args.records.length > 0) {

         if ( ! this.args.horizontalLayout){
            x += `<ul>`
         }

         let n = this._args.records.length;
         for (let i = 0; i < n; i++) {
            let record = this.args.records[i];

            let extraClasses: string = '';
            if (this.args.cssButtonClass != null &&this.args.cssButtonClass.length > 0){
               extraClasses += this.args.cssButtonClass;
            }

            try {
               if (this.args.cssButtonClassFunction != null){
                  let s:string = this.args.cssButtonClassFunction(record);
                  if ( s != null && s.length > 0){
                     if (extraClasses.length  == 0){
                        extraClasses += s;
                     } else {
                        extraClasses += ' ';
                        extraClasses += s;
                     }
                  }
               }

            }catch(ex) {
               console.log(ex);
            }


            if ( ! this.args.horizontalLayout){
               x += `<li class="wgt-radiobutton-li ${extraClasses}">`
               extraClasses = ''
            }
            x += `<input type='radio' id='${this.buttonId(i)}' name="${this.wrapperTagID}" ${(extraClasses.length == 0 ? '' : 'classes="' + extraClasses +'" ')}/>`;

            if ( ! this.args.horizontalLayout){
               x += `</li>`
            }

         } // for

         if ( ! this.args.horizontalLayout){
            x += `</ul>`
         }
      }
      x += "</div>";
      return x;
   }

   private buttonId(i: number): string {
      return `${this.wrapperTagID}_${i}`;
   }

   async localLogicImplementation(): Promise<void> {
      await super.localLogicImplementation();

      let args = this._args;
      args.ej  = args.ej || {};
      let ej   = args.ej;

      if (this._args.records != null && this._args.records.length > 0) {
         let n = this._args.records.length;
         for (let i = 0; i < n; i++) {
            let rec                    = this._args.records[i];
            let val:string  = null;
            let label:string  = null

            if ( this._args.valueFunction != null){
               try {
                  val = this._args.valueFunction(rec);
               } catch(t){
                  this.handleError(t)
               }
            } else {
               let valueFieldName: string = stringArgVal(this._args.valueFieldName);
               val   = rec[valueFieldName] as string;
            }

            if ( this._args.labelFunction != null){
               try {
                  label = this._args.labelFunction(rec);
               } catch(t){
                  this.handleError(t)
               }
            } else {
               let labelFieldName: string = stringArgVal(this._args.labelFieldName);
               label                      = rec[labelFieldName] as string;
            }

            let model: RadioButtonModel = {...this._args.ej}
            model.label                 = label;
            model.value                 = val;

            model.change = evt => {

               this.previousValue = this.value;
               this.value         = evt.value

               if (args.change) {
                  args.change(evt);
               }
            }

            let radio = new RadioButton(model)
            radio.appendTo(`#${this.buttonId(i)}`)

            this.obj.set(model.value.toString(), radio);

         } // for

         if ( this.args.starting_choice != null ){
            this.value = this.args.starting_choice;
            if (this.value == this.args.starting_choice){
               this.previousValue = this.value; // if the value is actually set, also change the previous value initially
            }
         }
      }
   } // logic


   async localDestroyImplementation() {
      await super.localDestroyImplementation();
      this._args        = null;
      this._radioButton = null;
      this._label       = null;
      this._value        = null;
   }

   getDataProviderSimple(): IDataProviderSimple {
      let dataProvider = DataProvider.dataProviderByName(this, this._args.dataProviderName);
      return dataProvider;
   }


   get value(): string {
      return this._value;
   }


   set value(value: string) {
      let stringValue = (value == null? null : value.toString());
      if (stringValue == this.args.not_selected_value) {
         if (this._radioButton)
            this._radioButton.checked = false; // turn the currently checked button to not-checked
         this.previousValue = this._value;
         this._value       = stringValue;
         this._label       = null;
         this._radioButton = null;
      } else {
         let radioButton: RadioButton = this.obj.get(stringValue);
         if (radioButton) {
            this.previousValue = this._value;
            this._value       = stringValue;
            this._label       = radioButton.label;
            this._radioButton = radioButton;
            this._radioButton.checked = true;
         } else {
            getErrorHandler().displayErrorMessageToUser(`Value "${stringValue}" set to the following radiobutton: ${JSON.stringify(this.args, null, 2)}`)
         }
      }
   }


   get args(): Args_WgtRadioButton {
      return this._args;
   }

   get label(): string {
      return this._label;
   }


   get radioButton(): RadioButton {
      return this._radioButton;
   }
} // WgtRadioButton