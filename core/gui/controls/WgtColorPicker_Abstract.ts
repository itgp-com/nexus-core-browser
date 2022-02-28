import {ColorPicker, ColorPickerEventArgs, ColorPickerModel} from '@syncfusion/ej2-inputs';

import {IArgs_HtmlTag, IArgs_HtmlTag_Utils} from "../Args_AnyWidget";
import {Args_WgtSimple, WgtSimple}          from "../controls/WgtSimple";
import {DataProvider, IDataProviderSimple}  from "../../data/DataProvider";

export class Args_WgtColorPicker extends Args_WgtSimple<ColorPickerModel> {
   includeErrorLine ?: boolean;
   error ?: IArgs_HtmlTag;
   required ?: boolean;
   stayFocusedOnError ?: boolean;

   initialValue ?: string;
   htmlTag ?: IArgs_HtmlTag;
}

export abstract class WgtColorPicker_Abstract extends WgtSimple<ColorPicker, Args_WgtSimple, string> {
   args: Args_WgtColorPicker;
   // private _validator: FormValidator;

   protected constructor() {
      super();
   }

   initialize_WgtColorPicker_Abstract(args: Args_WgtColorPicker) {

      if (!args.ej)
         args.ej = {};

      if (!args.ej.showButtons)
         args.ej.showButtons = false; // make sure it has a defined value


         this.args          = args;
      this.previousValue = null;

      this.initialize_WgtSimple(args)
   } // initialize_WgtDateTimePicker_Abstract

   async localContentBegin(): Promise<string> {
      let x: string = "";
      if (this.args.wrapper) {
         this.args.wrapper = IArgs_HtmlTag_Utils.init(this.args.wrapper);
         x += `<${this.args.wrapper.htmlTagType} id="${this.wrapperTagID}"${IArgs_HtmlTag_Utils.all(this.args.wrapper)}>`;
      }

      let errorAttributes = '';
      if (this.args.includeErrorLine)
         errorAttributes = ` data-msg-containerid="${this.errorTagID}"`

      let requiredAttribute = '';
      if (this.args.required)
         requiredAttribute = ' required';

      let htmlTagArgs = IArgs_HtmlTag_Utils.init(this.args.htmlTag);
      x += `<input id="${this.tagId}" type="color" name="${this.args.propertyName}"${IArgs_HtmlTag_Utils.all(htmlTagArgs)}${errorAttributes}${requiredAttribute}/>`;

      if (this.args.includeErrorLine) {
         let errorArgs = IArgs_HtmlTag_Utils.init(this.args.error);

         x += `<${errorArgs.htmlTagType} id="${this.errorTagID}"${IArgs_HtmlTag_Utils.all(errorArgs)}>`;
         x += `</${errorArgs.htmlTagType}>`; // <!-- id="${this.errorTagID}"-->
      } // if (this.args.includeErrorLine)

      if (this.args.wrapper) {
         x += `</${this.args.wrapper.htmlTagType}>`; // <!-- id="${this.wrapperTagID}" -->
      }
      return x;
   } // localContentBegin

   async localLogicImplementation() {
      let thisX = this;
      let args  = this.args;
      args.ej   = args.ej || {}; // ensure it's not null


         let oldChange  = args.ej.change;
         args.ej.change = (ev: ColorPickerEventArgs) => {
            let currentValue = ev.currentValue.hex;
            thisX.doChange(currentValue);
            if (oldChange)
               oldChange(ev);
         };

         let oldSelect  = args.ej.select;
         args.ej.select = (ev: ColorPickerEventArgs) => {
            let currentValue = ev.currentValue.hex;
            thisX.doChange(currentValue);
            if (oldSelect)
               oldSelect(ev);
         };



      this.obj = new ColorPicker(args.ej, this.hgetInput);

      if (args.initialValue)
         this.value = args.initialValue;

      if (this.value)
         this.previousValue = this.value;

   } // localLogicImplementation

   protected doChange(currentValue: string){
      if (currentValue !== this.previousValue){
         this.value = currentValue; // must do this manually
         this._onValueChanged(); // write to appserver
      }
   } // doChange


   async localClearImplementation() {
      await super.localClearImplementation();
      if (this.obj)
         this.value = null;
      this.previousValue = null;
   }

   async localRefreshImplementation() {

      if (this.obj && this.args.dataProviderName) {
         let data             = await DataProvider.byName(this, this.args.dataProviderName);
         let value: string      = null;
         let enabled: boolean = false;
         if (data) {
            value   = data[this.args.propertyName];
            enabled = true; // there is data so it's enabled
         }

         this.value         = value;
         this.previousValue = value;

      } else {

      }


   }

   async localDestroyImplementation() {
      try {
         if (this.obj && !this.obj.isDestroyed)
            this.obj.destroy();
      } catch (ignore) {
      }

      await super.localDestroyImplementation();
   }

   //--------------------------- WgtSimple implementation ---------------


   get value(): string {
      if (this.obj) {
         return this.obj.value;
      }
      return null;
   }

   set value(val: string) {
      if (this.obj) {
         val            = this.convertValueBeforeSet(val);
         this.obj.value = val;
      }
   }

   convertValueBeforeSet(val: string): string {
      if (!val){
         val = "#FFFFFFFF"; // transparent
      }
      return val;
   }

   getDataProviderSimple(): IDataProviderSimple {
      let dataProvider: IDataProviderSimple = null;
      if (this.args.dataProviderName)
         dataProvider = DataProvider.dataProviderByName(this, this.args.dataProviderName);
      return dataProvider;
   }
} //main