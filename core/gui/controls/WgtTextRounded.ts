import {Args_AnyWidget, IArgs_HtmlTag_Utils} from "../Args_AnyWidget";
import {FormValidator, TextBox}              from "@syncfusion/ej2-inputs";
import {WgtSimple}                           from "./WgtSimple";
import {DataProvider, IDataProviderSimple}   from "../../data/DataProvider";
import {Args_WgtText}                        from "./WgtText_Abstract";

export class WgtTextRounded extends WgtSimple<TextBox, Args_AnyWidget, string> {
   args: Args_WgtText;
   private _validator: FormValidator;


   protected constructor() {
      super();
   }

   static create(args: Args_WgtText): WgtTextRounded {
      let t = new WgtTextRounded();
      t.args = args;
      // t.initialize_WgtText(args);
      return t;
   }

   async localContentBegin(): Promise<string> {
      let x:string = ``;

      let errorAttributes = '';
      if (this.args.includeErrorLine)
         errorAttributes = ` data-msg-containerid="${this.errorTagID}"`

      let requiredAttribute = '';
      if (this.args.required)
         requiredAttribute = ' required';

      this.args.inputTagDecoration = this.args.inputTagDecoration || {};
      let textArgs                 = IArgs_HtmlTag_Utils.init(this.args.inputTagDecoration);
      this.args.inputTagDecoration.htmlTagClass += ' e-control input-field';

      x += `<div>`;

      x += `
            <input id="${this.tagId}"  type="text" name="${this.args.propertyName}"${IArgs_HtmlTag_Utils.class(textArgs)}${IArgs_HtmlTag_Utils.style(textArgs)}${errorAttributes}${requiredAttribute}/>
            
      `;
      if (this.args.includeErrorLine) {
         let errorArgs = IArgs_HtmlTag_Utils.init(this.args.error);

         x += `<${errorArgs.htmlTagType} id="${this.errorTagID}"${IArgs_HtmlTag_Utils.class(errorArgs)}${IArgs_HtmlTag_Utils.style(errorArgs)}>`;
         x += `</${errorArgs.htmlTagType}>`; // <!-- id="${this.errorTagID}"-->
      } // if (this.args.includeErrorLine)

      return x;
   }

   async localContentEnd(): Promise<string> {
      return `</div>`; // goes with <div class="e-float-input e-input-group e-corner">
   }


   async localLogicImplementation() {


      let thisX = this;
      let args  = this.args;
      args.ej   = args.ej || {}; // ensure it's not null

      let blur = args.ej.blur;
      if (args.updateOnBlurDisabled) {
         // do not add a blur event
      } else {
         document.getElementById(this.tagId).addEventListener('blur', async () => {

            await thisX.onBlur();      // local onBlur

            if (blur) {
               // execute the passed in blur
               blur();
            }
         });
      } // if updateOnBlurDisabled


   }


   async localClearImplementation(): Promise<void> {
      await super.localClearImplementation();
      if (this.obj)
         this.value = '';
      this.previousValue = '';
   }

   async localRefreshImplementation(): Promise<void> {

      // if (this.obj) {
         let data             = DataProvider.byName(this, this.args.dataProviderName);
         let value: string    = '';
         let enabled: boolean = false;
         if (data) {
            value   = data[this.args.propertyName];
            enabled = true; // there is data so it's enabled
         }

         this.value     = value;
         this.previousValue = value;

         if (this.args.ej.enabled) {
            // if the general properties allow you to enable, the enable if there's data, disable when there's no data link
            this.obj.enabled = enabled;
         }
      // }


   }

   async localDestroyImplementation(): Promise<void> {
      if (this.obj && !this.obj.isDestroyed)
         await this.obj.destroy();

      await super.localDestroyImplementation();
   }


   //--------------------------- WgtSimple implementation ---------------

   get value(): string {
      return this.hgetInput.value;
   }

   set value(val: string) {
      this.hgetInput.value = val;
   }

   getDataProviderSimple(): IDataProviderSimple {
      let dataProvider = DataProvider.dataProviderByName(this, this.args.dataProviderName);
      return dataProvider;
   }

}