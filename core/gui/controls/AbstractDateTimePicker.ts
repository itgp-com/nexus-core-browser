import {ChangedEventArgs, DateTimePicker, DateTimePickerModel} from '@syncfusion/ej2-calendars';
import {DataProvider, IDataProviderSimple}                     from "../../data/DataProvider";
import {IArgs_HtmlTag, IArgs_HtmlTag_Utils}                    from "../../BaseUtils";
import {AnyWidget, Args_AnyWidget}                             from "../AnyWidget";
import {addWidgetClass}                                        from "../AbstractWidget";

export class Args_AbstractDateTimePicker extends Args_AnyWidget<DateTimePickerModel> {
   includeErrorLine ?: boolean;
   error ?: IArgs_HtmlTag;
   /**
    * Controls if the textbox string triggers an 'onBlur' event when its contents are changed, the provider data propertyName attribute will be updated and a DataProviderChangeEvent will be fired
    */
   updateOnBlurDisabled ?: boolean;
   stayFocusedOnError ?: boolean;

   initialValue ?: Date;
   convertNullToNow?: boolean;
}

export abstract class AbstractDateTimePicker extends AnyWidget<DateTimePicker, Args_AnyWidget, Date> {

   protected constructor() {
      super();
   }

   protected async initialize_AbstractDateTimePicker(args: Args_AbstractDateTimePicker) {
      args    = IArgs_HtmlTag_Utils.init(args);
      args.ej = args.ej || {};
      addWidgetClass(args, 'AbstractDateTimePicker')

      this.previousValue = null;

      await this.initialize_AnyWidget(args)
   } // initialize_WgtDateTimePicker_Abstract

   async localContentBegin(): Promise<string> {
      let args: Args_AbstractDateTimePicker = (this.descriptor as Args_AbstractDateTimePicker);

      let x: string = "";
      if (args.wrapper) {
         args.wrapper = IArgs_HtmlTag_Utils.init(args.wrapper);
         x += `<${args.wrapper.htmlTagType} id="${this.wrapperTagID}"${IArgs_HtmlTag_Utils.all(args.wrapper)}>`;
      }


      let htmlTagArgs                   = IArgs_HtmlTag_Utils.init(args);
      htmlTagArgs.htmlTagType           = 'input';
      htmlTagArgs.htmlOtherAttr['name'] = args.propertyName;

      if (args.required)
         htmlTagArgs.htmlOtherAttr['required'] = null;

      if (args.includeErrorLine)
         htmlTagArgs.htmlOtherAttr['data-msg-containerid'] = this.errorTagID;


      x += `<input id="${this.tagId}" ${IArgs_HtmlTag_Utils.all(htmlTagArgs)}/>`;   //hardcoded input tag because of ending />

      if (args.includeErrorLine) {
         let errorArgs = IArgs_HtmlTag_Utils.init(args.error);

         x += `<${errorArgs.htmlTagType} id="${this.errorTagID}"${IArgs_HtmlTag_Utils.all(errorArgs)}>`;
         x += `</${errorArgs.htmlTagType}>`; // <!-- id="${this.errorTagID}"-->
      } // if (args.includeErrorLine)

      if (args.wrapper) {
         x += `</${args.wrapper.htmlTagType}>`; // <!-- id="${this.wrapperTagID}" -->
      }
      return x;
   } // localContentBegin


   async localLogicImplementation() {
      let thisX = this;
      let args  = this.descriptor as Args_AbstractDateTimePicker;
      args.ej   = args.ej || {}; // ensure it's not null

      let blur = args.ej.blur;
      if (args.updateOnBlurDisabled) {
         // do not add a blur event
      } else {
         args.ej.blur = (arg, rest) => {

            thisX._onValueChanged();      // local onBlur

            if (blur) {
               // execute the passed in blur
               blur(arg, rest);
            }
         };
      } // if updateOnBlurDisabled

      let oldChange  = args.ej.change;
      args.ej.change = (ev: ChangedEventArgs) => {
         thisX._onValueChanged(); // write to appserver

         if (oldChange)
            oldChange(ev);
      };


      this.obj = new DateTimePicker(args.ej);
      this.obj.appendTo(this.hgetInput);

      if (args.initialValue)
         this.value = args.initialValue;

      if (this.value)
         this.previousValue = this.value;

   } // localLogicImplementation


   async localClearImplementation() {
      await super.localClearImplementation();
      if (this.obj)
         this.value = null;
      this.previousValue = null;
   }

   async localRefreshImplementation() {

      if (this.obj && this.descriptor.dataProviderName) {
         let data             = DataProvider.byName(this, this.descriptor.dataProviderName);
         let value: Date      = null;
         let enabled: boolean = false;
         if (data) {
            value   = data[this.descriptor.propertyName];
            enabled = true; // there is data so it's enabled
         }

         this.value         = value;
         this.previousValue = value;

         if (this.descriptor.ej.enabled) {
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

      await super.localDestroyImplementation();
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
      if ((this.descriptor as Args_AbstractDateTimePicker).convertNullToNow) {
         if (val == null)
            val = new Date(); //to now
      }
      return val;
   }

   getDataProviderSimple(): IDataProviderSimple {
      let dataProvider: IDataProviderSimple = null;
      if (this.descriptor.dataProviderName)
         dataProvider = DataProvider.dataProviderByName(this, this.descriptor.dataProviderName);
      return dataProvider;
   }
} //main