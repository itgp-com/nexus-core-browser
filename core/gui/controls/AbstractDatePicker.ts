import {ChangedEventArgs, DatePicker, DatePickerModel} from '@syncfusion/ej2-calendars';
import {DataProvider}                                  from "../../data/DataProvider";
import {IArgs_HtmlTag, IArgs_HtmlTag_Utils}            from "../../BaseUtils";
import {AnyWidget, Args_AnyWidget}                     from "../AnyWidget";
import {addWidgetClass}                                from "../AbstractWidget";
import * as _                                          from "lodash";


export class Args_AbstractDatePicker extends Args_AnyWidget<DatePickerModel> {
   includeErrorLine ?: boolean;
   error ?: IArgs_HtmlTag;
   /**
    * Controls if the textbox string triggers an 'onBlur' event when its contents are changed, the provider data propertyName attribute will be updated and a DataProviderChangeEvent will be fired
    */
   updateOnBlurDisabled ?: boolean;
   stayFocusedOnError ?: boolean;

   initialValue ?: Date;
   convertNullToToday?: boolean;
}

export abstract class AbstractDatePicker extends AnyWidget<DatePicker, Args_AnyWidget, Date> {

   protected constructor() {
      super();
   }

   protected async initialize_AbstractDatePicker(args: Args_AbstractDatePicker) {
      args    = IArgs_HtmlTag_Utils.init(args);
      args.ej = args.ej || {};
      addWidgetClass(args, 'AbstractDatePicker')

      this.previousValue = null;

      await this.initialize_AnyWidget(args)
   }

   async localContentBegin(): Promise<string> {
      let args: Args_AbstractDatePicker = (this.initArgs as Args_AbstractDatePicker);

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
      } // if ((args as Args_WgtDatePicker).includeErrorLine)

      if (args.wrapper) {
         x += `</${args.wrapper.htmlTagType}>`; // <!-- id="${this.wrapperTagID}" -->
      }
      return x;
   } // localContentBegin

   async localLogicImplementation() {
      let thisX = this;
      let args  = (this.initArgs as Args_AbstractDatePicker);
      args.ej   = args.ej || {}; // ensure it's not null

      let blur = args.ej.blur;
      if (args.updateOnBlurDisabled) {
         // do not add a blur event
      } else {
         args.ej.blur = (arg, rest) => {

            if (arg.value) {
               // if no edit, then the value is undefined, so don't do ANYTHING
               thisX.updateDataProvider(arg.value);      // local onBlur

               if (blur) {
                  // execute the passed in blur
                  blur(arg, rest);
               }
            }
         };
      } // if updateOnBlurDisabled

      let oldChange  = args.ej.change;
      args.ej.change = (ev: ChangedEventArgs) => {
         thisX.updateDataProvider(ev.value); // write to appserver

         if (oldChange)
            oldChange(ev);
      };


      this.obj = new DatePicker(args.ej);
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

      let args: Args_AbstractDatePicker = (this.initArgs as Args_AbstractDatePicker);

      if (this.obj && args.dataProviderName) {
         let data             = DataProvider.byName(this, args.dataProviderName);
         let value: Date      = null;
         let enabled: boolean = false;
         if (data) {
            value   = data[args.propertyName];
            enabled = true; // there is data so it's enabled
         }

         this.value         = value;
         this.previousValue = value;

         if (args.ej.enabled) {
            // if the general properties allow you to enable, then enable if there's data, disable when there's no data link
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
         val = this.convertValueBeforeSet(val);
         if (!_.isEqual(this.obj.value, val)) {
            this.obj.value = val;
            super.value    = val;
            // this.updateDataProvider(val);
         } // if (!_.isEqual(this.obj.value, val))
      } // if (this.obj)
   } // set value

   convertValueBeforeSet(val: Date): Date {
      if ((this.initArgs as Args_AbstractDatePicker).convertNullToToday) {
         if (val == null)
            val = new Date(); //to now
      }
      return val;
   }
} //main