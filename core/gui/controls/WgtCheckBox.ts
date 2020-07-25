import {Args_WgtSimple, WgtSimple}           from "./WgtSimple";
import {CheckBox, CheckBoxModel}             from '@syncfusion/ej2-buttons';
import {Args_AnyWidget, IArgs_HtmlTag_Utils} from "../Args_AnyWidget";
import {DataProviderChangeEvent}             from "../../data/DataProvider";

export abstract class Args_WgtCheckBox extends Args_WgtSimple<CheckBoxModel> {
   /**
    * Control label. Overwrites the placeholder in the ej.placeholder in places
    */
   label?: string;

   modelTrueValue ?: WgtCheckBoxDataType;

   modelFalseValue ?: WgtCheckBoxDataType;

   modelIndeterminateValue ?: WgtCheckBoxDataType = null;

   enabled ?: boolean;
} // Args class

export type WgtCheckBoxDataType = number | string | boolean;

export abstract class WgtCheckBox<ARG_CLASS extends Args_WgtCheckBox = Args_WgtCheckBox> extends WgtSimple <CheckBox, Args_AnyWidget, WgtCheckBoxDataType> {
   args: Args_WgtCheckBox;
   private _indeterminateValue: any              = null;
   private _modelTrueValue: WgtCheckBoxDataType  = true;
   private _modelFalseValue: WgtCheckBoxDataType = false;

   protected constructor() {
      super();
   }

   initialize_WgtCheckBox(args: ARG_CLASS) {
      if (!args)
         throw "There are no args in call to initialize_WgtCheckBox(args) !";

      if (!args.ej)
         args.ej = {};

      this.args = args;
      if (args.modelIndeterminateValue != null)
         this._indeterminateValue = args.modelIndeterminateValue;
      if (args.modelTrueValue != null)
         this._modelTrueValue = args.modelTrueValue;
      if (args.modelFalseValue != null)
         this._modelFalseValue = args.modelFalseValue;

      if ( args.enabled != null)
         args.ej.disabled = !args.enabled;

      this.previousValue = this.indeterminateValue;

      this.initialize_WgtSimple(args)
   } //initialize_WgtCheckBox


   localContentBegin(): string {

      let x: string = "";

      x += `<div id="${this.wrapperTagID}"${IArgs_HtmlTag_Utils.all(this.args.wrapper)}>`;

      if (this.args.label) {
         x += `    <div id="${this.labelTagID}" class="e-float-text e-label-top" style="padding-bottom: 5px;">${this.args.label.escapeHTML()}</div>`;
      }

      x += `<input type="checkbox" id="${this.tagId}" name="${this.args.propertyName}"/>`;
      x += "</div>";

      return x;
   }


   localLogicImplementation() {
      let args = this.args;
      args.ej  = args.ej || {};
      let ej   = args.ej;

      let argsChange = ej.change;
      ej.change = (ev) => {
         if (argsChange) {
            argsChange(ev); // invoke the args-defined change first
         }

         let currentValue = ev.checked;
         this.toDataProvider(currentValue);
      }; // change event

      this.obj = new CheckBox(ej, this.hgetInput);
   } // doInitLogic


   toDataProvider(currentValue: (boolean | null)): void {
      try {
         let dataProvider = this.getDataProviderSimple();
         let record       = this.getRecord();
         if (dataProvider != null && record != null) {
            let modelPreviousDataValue = record[this.args.propertyName];
            let modelCurrentValue          = this.convertViewToModel(currentValue);
            // make the change
            record[this.args.propertyName] = modelCurrentValue;


            if (modelCurrentValue != modelPreviousDataValue) {
               // trigger the change event
               let evt: DataProviderChangeEvent<any> = {
                  propertyName:  this.args.propertyName,
                  value:         modelCurrentValue,
                  previousValue: modelPreviousDataValue,
               };

               dataProvider.fireChange(evt);
            } // if (currentValue != previousDataValue)
         } // if ( dataProvider != null && record != null )
      } catch (ex) {
         this.handleError(ex);
      }
   } // toDataProvider

   localClearImplementation(): void {
      if (this.obj) {
         this.obj.checked       = false;
         this.obj.indeterminate = true;
      }
   }// doClear

   localRefreshImplementation(): void {
      if (this.obj) {
         let value            = this.indeterminateValue;
         let enabled: boolean = false;

         let data = this.getRecord();
         if (data) {
            value   = this.convertModelToView(data[this.args.propertyName]);
            enabled = true; // there is data so it's enabled
         }

         this.value         = value;
         this.previousValue = value;

         if (this.args.ej.disabled == null) {
            // if the general properties don't specify something
            this.obj.disabled = !enabled;
         }
      }

   } // doClear

   get value(): boolean | null {
      if (this.obj) {
         if (this.obj.indeterminate)
            return this.indeterminateValue

         return this.obj.checked;
      }
      return this.obj.indeterminate;
   }

   set value(val: boolean | null) {
      try {
         if (this.obj) {
            if (val == this.indeterminateValue) {
               this.localClearImplementation();
            } else {
               this.obj.checked = val; // will trigger a change event
            }
         }
      } catch (ex) {
         this.handleError(ex);
      }
   }


   convertViewToModel(currentValue: boolean | null): WgtCheckBoxDataType {
      if (currentValue == null)
         return this.indeterminateValue;

      return (currentValue ? this.modelTrueValue : this.modelFalseValue);
   }

   convertModelToView(modelValue: WgtCheckBoxDataType): (boolean | null) {
      if (modelValue == null)
         return null
      return (modelValue == this.modelTrueValue);

      // return null; // indeterminate if the value not recognized
   }


   get indeterminateValue(): any {
      return this._indeterminateValue;
   }

   set indeterminateValue(value: any) {
      this._indeterminateValue = value;
   }


   get modelTrueValue(): WgtCheckBoxDataType {
      return this._modelTrueValue;
   }

   set modelTrueValue(value: WgtCheckBoxDataType) {
      this._modelTrueValue = value;
   }

   get modelFalseValue(): WgtCheckBoxDataType {
      return this._modelFalseValue;
   }

   set modelFalseValue(value: WgtCheckBoxDataType) {
      this._modelFalseValue = value;
   }
}