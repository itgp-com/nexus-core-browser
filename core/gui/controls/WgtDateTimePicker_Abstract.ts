import {ChangedEventArgs, DateTimePicker, DateTimePickerModel} from '@syncfusion/ej2-calendars';

import {IArgs_HtmlTag, IArgs_HtmlTag_Utils} from "../Args_AnyWidget";
import {Args_WgtSimple, WgtSimple}          from "../controls/WgtSimple";
import {DataProvider, IDataProviderSimple}  from "../../data/DataProvider";

export class Args_WgtDateTimePicker extends Args_WgtSimple<DateTimePickerModel> {
   includeErrorLine ?: boolean;
   error ?: IArgs_HtmlTag;
   required ?: boolean;
   /**
    * Controls if the textbox string triggers an 'onBlur' event when its contents are changed, the provider data propertyName attribute will be updated and a DataProviderChangeEvent will be fired
    */
   updateOnBlurDisabled ?: boolean;
   stayFocusedOnError ?: boolean;

   initialValue ?: Date;
   htmlTag ?: IArgs_HtmlTag;
}

export abstract class WgtDateTimePicker_Abstract extends WgtSimple<DateTimePicker, Args_WgtSimple, Date> {
   args: Args_WgtDateTimePicker;
   // private _validator: FormValidator;

   protected constructor() {
      super();
   }

   initialize_WgtDateTimePicker_Abstract(args: Args_WgtDateTimePicker) {

      if (!args.ej)
         args.ej = {};

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
      x += `<input id="${this.tagId}" name="${this.args.propertyName}"${IArgs_HtmlTag_Utils.all(htmlTagArgs)}${errorAttributes}${requiredAttribute}/>`;

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

      let blur = args.ej.blur;
      if (args.updateOnBlurDisabled) {
         // do not add a blur event
      } else {
         args.ej.blur = (arg, rest) => {

            thisX.onBlur();      // local onBlur

            if (blur) {
               // execute the passed in blur
               blur(arg, rest);
            }
         };
      } // if updateOnBlurDisabled

      let oldChange = args.ej.change;
      args.ej.change = (ev:ChangedEventArgs) =>{
         thisX.onBlur(); // write to appserver

         if (oldChange)
            oldChange(ev);
      };


      this.obj = new DateTimePicker(args.ej, this.hgetInput);

      if (args.initialValue)
         this.value = args.initialValue;

      if (this.value)
         this.previousValue = this.value;

   } // localLogicImplementation


   async localClearImplementation() {
      super.localClearImplementation();
      if (this.obj)
         this.value = null;
      this.previousValue = null;
   }

   async localRefreshImplementation() {

      if (this.obj && this.args.dataProviderName) {
         let data             = DataProvider.byName(this, this.args.dataProviderName);
         let value: Date      = null;
         let enabled: boolean = false;
         if (data) {
            value   = data[this.args.propertyName];
            enabled = true; // there is data so it's enabled
         }

         this.value         = value;
         this.previousValue = value;

         if (this.args.ej.enabled) {
            // if the general properties allow you to enable, the enable if there's data, disable when there's no data link
            this.obj.enabled = enabled;
         }
      } else {

      }


   }

   async localDestroyImplementation() {
      try {
         if (this.obj && !this.obj.isDestroyed)
            this.obj.destroy();
      } catch (ignore) {
      }

      super.localDestroyImplementation();
   }

   //--------------------------- WgtSimple implementation ---------------


   get value(): Date {
      if (this.obj) {
         return this.obj.value;
      }
      return null;
   }

   set value(val: Date) {
      if (this.obj) {
         val            = this.convertValueBeforeSet(val);
         this.obj.value = val;
      }
   }

   convertValueBeforeSet(val: Date): Date {
      if (val == null || val == undefined)
         val = new Date(); //to now
      return val;
   }

   getDataProviderSimple(): IDataProviderSimple {
      let dataProvider: IDataProviderSimple = null;
      if (this.args.dataProviderName)
         dataProvider = DataProvider.dataProviderByName(this, this.args.dataProviderName);
      return dataProvider;
   }
} //main