import {ColorPicker, ColorPickerEventArgs, ColorPickerModel} from '@syncfusion/ej2-inputs';
import {DataProvider, IDataProviderSimple}                   from "../../data/DataProvider";
import {IArgs_HtmlTag, IArgs_HtmlTag_Utils}                  from "../../BaseUtils";
import {AnyWidget, Args_AnyWidget}                           from "../AnyWidget";
import {addWidgetClass}                                      from "../AbstractWidget";

export abstract class Args_AbstractColorPicker extends Args_AnyWidget<ColorPickerModel> {
   includeErrorLine ?: boolean;
   error ?: IArgs_HtmlTag;
   required ?: boolean;
   stayFocusedOnError ?: boolean;

   initialValue ?: string;
}

export abstract class AbstractColorPicker extends AnyWidget<ColorPicker, Args_AnyWidget, string> {

   protected constructor() {
      super();
   }

   protected async initialize_AbstractColorPicker(args: Args_AbstractColorPicker) {
      args = IArgs_HtmlTag_Utils.init(args);
      args.ej = args.ej || {};
      addWidgetClass(args, 'AbstractColorPicker')


      if (!args.ej.showButtons)
         args.ej.showButtons = false; // make sure it has a defined value

      this.previousValue = null;

      await this.initialize_AnyWidget(args)
   } // initialize_WgtDateTimePicker_Abstract

   async localContentBegin(): Promise<string> {
      let args:Args_AbstractColorPicker = (this.descriptor as Args_AbstractColorPicker);
      let x: string = "";
      if (this.descriptor.wrapper) {
         this.descriptor.wrapper = IArgs_HtmlTag_Utils.init(this.descriptor.wrapper);
         x += `<${this.descriptor.wrapper.htmlTagType} id="${this.wrapperTagID}"${IArgs_HtmlTag_Utils.all(this.descriptor.wrapper)}>`;
      }

      let htmlTagArgs = IArgs_HtmlTag_Utils.init(args);
      htmlTagArgs.htmlTagType = 'input';
      htmlTagArgs.htmlOtherAttr['type'] = 'color';
      htmlTagArgs.htmlOtherAttr['name'] = this.descriptor.propertyName;

      if (this.descriptor.required)
         htmlTagArgs.htmlOtherAttr['required'] = null;

      if (args.includeErrorLine)
         htmlTagArgs.htmlOtherAttr['data-msg-containerid'] = this.errorTagID;


      x += `<input id="${this.tagId}" ${IArgs_HtmlTag_Utils.all(htmlTagArgs)}/>`; //hardcoded input tag because of ending />

      if (args.includeErrorLine) {
         let errorArgs = IArgs_HtmlTag_Utils.init(args.error);

         x += `<${errorArgs.htmlTagType} id="${this.errorTagID}" ${IArgs_HtmlTag_Utils.all(errorArgs)}>`;
         x += `</${errorArgs.htmlTagType}>`; // <!-- id="${this.errorTagID}"-->
      } // if (this.descriptor.includeErrorLine)

      if (this.descriptor.wrapper) {
         x += `</${this.descriptor.wrapper.htmlTagType}>`; // <!-- id="${this.wrapperTagID}" -->
      }
      return x;
   } // localContentBegin

   async localLogicImplementation() {
      let thisX = this;

      let args:Args_AbstractColorPicker = (this.descriptor as Args_AbstractColorPicker);
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


      this.obj = new ColorPicker(args.ej);
      this.obj.appendTo(this.hgetInput);

      if (args.initialValue)
         this.value = args.initialValue;

      if (this.value)
         this.previousValue = this.value;

   } // localLogicImplementation

   protected doChange(currentValue: string) {
      if (currentValue !== this.previousValue) {
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

      if (this.obj && this.descriptor.dataProviderName) {
         let data             = await DataProvider.byName(this, this.descriptor.dataProviderName);
         let value: string    = null;
         let enabled: boolean = false;
         if (data) {
            value   = data[this.descriptor.propertyName];
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
      if (!val) {
         val = "#FFFFFFFF"; // transparent
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