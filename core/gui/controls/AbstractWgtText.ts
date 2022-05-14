import {FormValidator, TextBox, TextBoxModel}                                     from "@syncfusion/ej2-inputs";
import {Args_AnyWidget, IArgs_HtmlDecoration, IArgs_HtmlTag, IArgs_HtmlTag_Utils} from "../Args_AnyWidget";
import {DataProvider, IDataProviderSimple}                                        from "../../data/DataProvider";
import {Args_WgtSimple, WgtSimple}                                                from "./WgtSimple";
import {applyHtmlDecoration, StringArg, stringArgVal}                             from "../../CoreUtils";

export class Args_WgtText extends Args_WgtSimple<TextBoxModel> {

   /**
    * Control label. Overwrites the placeholder in the ej.placeholder in places
    */
   label?: string;

   inputTagDecoration ?: IArgs_HtmlDecoration;
   labelTagDecoration ?: IArgs_HtmlDecoration;
   eControlWrapperDecoration ?: IArgs_HtmlDecoration;
   eFloatLineDecoration ?: IArgs_HtmlDecoration;

   includeErrorLine ?: boolean;
   error ?: IArgs_HtmlTag;
   required ?: boolean;
   /**
    * Controls if the textbox string triggers an 'onBlur' event when its contents are changed, the provider data propertyName attribute will be updated and a DataProviderChangeEvent will be fired
    */
   updateOnBlurDisabled ?: boolean;
   stayFocusedOnError ?: boolean;

   initialValue ?: StringArg;

   enabled ?: boolean;

}

/**
 * Textbox that defaults the following TextboxModel properties to the following values that are different than the EJ defaults:
 *
 * autocomplete: 'off'
 * floatLabelType: "Always"
 */
export abstract class AbstractWgtText extends WgtSimple<TextBox, Args_AnyWidget, string> {
   args: Args_WgtText;
   private _validator: FormValidator;

   protected constructor() {
      super();
   }

   initialize_AbstractWgtText(args: Args_WgtText) {

      if (!args.ej)
         args.ej = {};

      this.args               = args;
      this.stayFocusedOnError = args.stayFocusedOnError;
      this.previousValue      = ''; // initialize at ''


      if (!args.ej.autocomplete)
         args.ej.autocomplete = 'off';

      if (!args.ej.floatLabelType)
         args.ej.floatLabelType = 'Always';

      if (args.label)
         args.ej.placeholder = args.label; // overwrite label

      if (args.enabled != null)
         args.ej.enabled = args.enabled;

      this.initialize_WgtSimple(args)
   } // initTextField


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

      let textArgs = IArgs_HtmlTag_Utils.init(this.args.inputTagDecoration);
      x += `<input id="${this.tagId}" name="${this.args.propertyName}"${IArgs_HtmlTag_Utils.all(textArgs)}${errorAttributes}${requiredAttribute}/>`;

      if (this.args.includeErrorLine) {
         let errorArgs = IArgs_HtmlTag_Utils.init(this.args.error);

         x += `<${errorArgs.htmlTagType} id="${this.errorTagID}"${IArgs_HtmlTag_Utils.all(errorArgs)}>`;
         x += `</${errorArgs.htmlTagType}>`; // <!-- id="${this.errorTagID}"-->
      } // if (this.args.includeErrorLine)

      if (this.args.wrapper) {
         x += `</${this.args.wrapper.htmlTagType}>`; // <!-- id="${this.wrapperTagID}" -->
      }
      return x;
   }

   async localLogicImplementation() {
      let thisX = this;
      let args  = this.args;
      args.ej   = args.ej || {}; // ensure it's not null

      let blur = args.ej.blur;
      if (args.updateOnBlurDisabled) {
         // do not add a blur event
      } else {
         args.ej.blur = async (arg, rest) => {

            await thisX._onValueChanged();      // local onBlur

            if (blur) {
               // execute the passed in blur
               blur(arg, rest);
            }
         };
      } // if updateOnBlurDisabled


      let ejCreated = args.ej.created

      args.ej.created = (arg_created) =>{

          let inputElem = document.getElementById(this.tagId);
         if (inputElem) {
            let wrapper:HTMLElement = inputElem.closest('div.e-control-wrapper'); // the first div with class 'e-control-wrapper' containing this
            if (wrapper) {

               if (args.eControlWrapperDecoration) {
                  applyHtmlDecoration(wrapper, args.eControlWrapperDecoration);
               } // if (args.eControlWrapperDecoration)

               if (args.eFloatLineDecoration) {
                  let collection = wrapper.getElementsByClassName('e-float-line');
                  if (collection.length > 0) {
                     let htmlElement: HTMLElement = collection[0] as HTMLElement;
                     if (htmlElement)
                        applyHtmlDecoration(htmlElement, args.eFloatLineDecoration);
                  }
               } // if (args.eFloatLineDecoration)


               if (args.labelTagDecoration) {
                  let collection = wrapper.getElementsByTagName('label');
                  if (collection.length > 0) {
                     let htmlElement: HTMLElement = collection[0] as HTMLElement;
                     if (htmlElement)
                        applyHtmlDecoration(htmlElement, args.labelTagDecoration);
                  }
               } // if (args.labelTagDecoration)
            } // if wrapper
         } // if inputElem


         if ( ejCreated)
            ejCreated(arg_created);
      } // created



      this.obj = new TextBox(args.ej);
      this.obj.appendTo( this.hgetInput);

      if (args.initialValue)
         this.value = stringArgVal(args.initialValue);


      // if we have an initial value, then set it the previous value to same
      if (this.value)
         this.previousValue = this.value;

   }

   async localClearImplementation(): Promise<void> {
      await super.localClearImplementation();
      if (this.obj)
         this.value = '';
      this.previousValue = '';
   }

   async localRefreshImplementation(): Promise<void> {

      if (this.obj && this.args.dataProviderName) {
         let data             = DataProvider.byName(this, this.args.dataProviderName);
         let value: string    = '';
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

   async localDestroyImplementation(): Promise<void> {
      try {
         if (this.obj && !this.obj.isDestroyed)
            await this.obj.destroy();
      } catch (ignore) {
      }

      await super.localDestroyImplementation();
   }

   //--------------------------- WgtSimple implementation ---------------


   get value(): string {
      if (this.obj) {
         return this.obj.value;
      }
      return '';
   }

   set value(val: string) {
      if (this.obj) {
         val            = this.convertValueBeforeSet(val);
         this.obj.value = val;
      }
   }

   convertValueBeforeSet(val: string): string {
      if (val == null)
         val = ''; // default null, undefined to ''
      return val;
   }

   getDataProviderSimple(): IDataProviderSimple {
      let dataProvider: IDataProviderSimple = null;
      if (this.args.dataProviderName)
         dataProvider = DataProvider.dataProviderByName(this, this.args.dataProviderName);
      return dataProvider;
   }

} // main class