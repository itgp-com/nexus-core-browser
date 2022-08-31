import {RadioButton, RadioButtonModel}                                 from '@syncfusion/ej2-buttons';
import {getRandomString, IArgs_HtmlTag_Utils, StringArg, stringArgVal} from "../../BaseUtils";
import {DataProvider, IDataProviderSimple}                             from "../../data/DataProvider";
import {getErrorHandler}                                               from "../../CoreErrorHandling";
import {isFunction, isString}                                          from "lodash";
import {AnyWidget, Args_AnyWidget}                                     from "../AnyWidget";

export class Args_AbstractRadioButton extends Args_AnyWidget<RadioButtonModel> {

   records: any[];
   valueFieldName ?: StringArg;
   /**
    * Takes precedence over valueFieldName
    */
   valueFunction ?: ((record: any) => string);

   labelFieldName ?: StringArg;

   /**
    * Takes precedence over labelFieldName
    */
   labelFunction ?: ((record: any) => string);

   horizontalLayout ?: boolean;
   cssButtonClass ?: string | ((record: any) => string);

   initialValue ?: StringArg;  // defaults to null
   not_selected_value ?: StringArg; // defaults to null
}

/**
 * Abstract implementation of a group of Syncfusion radio buttons
 */
export abstract class AbstractRadioButton<ARG_CLASS extends Args_AbstractRadioButton = Args_AbstractRadioButton>
   extends AnyWidget<Map<string, RadioButton>, Args_AnyWidget, string> {
   private _label: string
   private _radioButton: RadioButton;

   protected constructor() {
      super();
   }


   protected async initialize_AbstractRadioButton(args: ARG_CLASS) {
      this.obj = new Map<string, RadioButton>();

      args = IArgs_HtmlTag_Utils.init(args) as ARG_CLASS;
      this.descriptor = args;
      if (!args.ej)
         args.ej = {};

      this.wrapperTagID = (args.propertyName == null ? getRandomString('radioButtonGroup') : getRandomString(args.propertyName));

      await this.initialize_AnyWidget(args);
   }

   //TODO Implement using standard local content if possible
   async localContentBegin(): Promise<string> {
      let x: string = "";

      x += `<div id="${this.wrapperTagID}"${IArgs_HtmlTag_Utils.all((this.descriptor as ARG_CLASS).wrapper)}>`;

      if ((this.descriptor as ARG_CLASS).records != null && (this.descriptor as ARG_CLASS).records.length > 0) {

         if (!this.descriptorLocal.horizontalLayout) {
            x += `<ul class="wgt-radiobutton-ul">`
         }

         let n = (this.descriptor as ARG_CLASS).records.length;
         for (let i = 0; i < n; i++) {
            let record = this.descriptorLocal.records[i];

            let extraClasses: string = '';
            try {
               if (this.descriptorLocal.cssButtonClass != null && this.descriptorLocal.cssButtonClass.length > 0) {
                  if (isFunction(this.descriptorLocal.cssButtonClass)) {
                     let s: string = this.descriptorLocal.cssButtonClass(record);
                     if (s != null && s.length > 0) {
                        if (extraClasses.length == 0) {
                           extraClasses += s;
                        } else {
                           extraClasses += ' ';
                           extraClasses += s;
                        }
                     }
                  } else if (isString(this.descriptorLocal.cssButtonClass)) {
                     extraClasses += this.descriptorLocal.cssButtonClass;
                  } else {
                     throw 'The cssButtonClass property in AbstractWgtRadioButton arguments is neither a string or a function';
                  }
               }

            } catch (ex) {
               this.handleWidgetError(ex);
            }


            if (!this.descriptorLocal.horizontalLayout) {
               x += `<li class="wgt-radiobutton-li ${extraClasses}">`
               extraClasses = ''
            }
            x += `<input type='radio' id='${this.buttonId(i)}' name="${this.wrapperTagID}" ${(extraClasses.length == 0 ? '' : 'classes="' + extraClasses + '" ')}/>`;

            if (!this.descriptorLocal.horizontalLayout) {
               x += `</li>`
            }

         } // for

         if (!this.descriptorLocal.horizontalLayout) {
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
      let thisX = this;
      await super.localLogicImplementation();
      let args = this.descriptor as ARG_CLASS;
      let ej   = this.descriptor.ej;

      if (args.records != null && args.records.length > 0) {
         let n = args.records.length;
         for (let i = 0; i < n; i++) {
            let rec           = args.records[i];
            let val: string   = null;
            let label: string = null

            if (args.valueFunction != null) {
               try {
                  val = args.valueFunction(rec);
               } catch (t) {
                  thisX.handleError(t)
               }
            } else {
               let valueFieldName: string = stringArgVal(args.valueFieldName);
               val                        = rec[valueFieldName] as string;
            }

            if (args.labelFunction != null) {
               try {
                  label = args.labelFunction(rec);
               } catch (t) {
                  thisX.handleWidgetError(t)
               }
            } else {
               let labelFieldName: string = stringArgVal(args.labelFieldName);
               label                      = rec[labelFieldName] as string;
            }

            let model: RadioButtonModel = {...ej}
            model.label                 = label;
            model.value                 = val;


            let userChangeMethod = ej.change;
            model.change         = async (evt) => {

               thisX.previousValue = thisX.value;
               thisX.value         = evt.value

               await thisX._onValueChanged();

               if (userChangeMethod) {
                  try {
                     userChangeMethod(evt);
                  } catch (e) {
                     this.handleWidgetError(e);
                  }
               }
            }

            let radio = new RadioButton(model)
            radio.appendTo(`#${thisX.buttonId(i)}`)

            thisX.obj.set(model.value.toString(), radio);

         } // for

         if (thisX.descriptorLocal.initialValue) {
            let initialValue: string = stringArgVal(thisX.descriptorLocal.initialValue);
            if (initialValue != null) {
               thisX.value = initialValue;

               // if we have an initial value, then set it the previous value to same
               if (thisX.value)
                  thisX.previousValue = thisX.value; // if the value is actually set, also change the previous value initially

            }
         }
      }
   } // logic

   async localRefreshImplementation(): Promise<void> {

      if (this.obj && this.descriptorLocal?.dataProviderName) {
         let data             = DataProvider.byName(this, this.descriptorLocal.dataProviderName);
         let value: string    = '';
         let enabled: boolean = false;
         if (data) {
            value   = data[this.descriptorLocal.propertyName];
            enabled = true; // there is data so it's enabled
         }

         this.value         = value;
         this.previousValue = value;

      }
   }


   async localDestroyImplementation() {
      await super.localDestroyImplementation();
      (this.descriptor as ARG_CLASS)        = null;
      this._radioButton = null;
      this._label       = null;
      this.value        = null;
   }

   getDataProviderSimple(): IDataProviderSimple {
      let dataProvider = DataProvider.dataProviderByName(this, (this.descriptor as ARG_CLASS).dataProviderName);
      return dataProvider;
   }

   get value():string {
      return super.value;
   }

   set value(value: string) {
      let stringValue = (value == null ? null : value.toString());
      if (stringValue == this.descriptorLocal?.not_selected_value) {
         if (this._radioButton)
            this._radioButton.checked = false; // turn the currently checked button to not-checked
         this.previousValue = this.value;
         super.value         = stringValue;
         this._label        = null;
         this._radioButton  = null;
      } else {
         let radioButton: RadioButton = this.obj.get(stringValue);
         if (radioButton) {
            this.previousValue        = this.value;
            super.value                = stringValue;
            this._label               = radioButton.label;
            this._radioButton         = radioButton;
            this._radioButton.checked = true;
         } else {
            getErrorHandler().displayErrorMessageToUser(`Value "${stringValue}" set to the following radiobutton: ${JSON.stringify(this.descriptorLocal, null, 2)}`)
         }
      }
   }


   get descriptorLocal(): Args_AbstractRadioButton {
      return (this.descriptor as ARG_CLASS);
   }

   get label(): string {
      return this._label;
   }


   get radioButton(): RadioButton {
      return this._radioButton;
   }

} // WgtRadioButton