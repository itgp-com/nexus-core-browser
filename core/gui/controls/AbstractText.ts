import {getRandomString, IArgs_HtmlDecoration, IArgs_HtmlTag, IArgs_HtmlTag_Utils, StringArg, stringArgVal} from "../../BaseUtils";
import {applyHtmlDecoration}                                                                                from "../../CoreUtils";
import {DataProvider}                                                                                       from "../../data/DataProvider";
import {TextBox, TextBoxModel}                                                                              from "@syncfusion/ej2-inputs";
import {AnyWidget, Args_AnyWidget}                                                                          from "../AnyWidget";
import {ChangedEventArgs}                                                                                   from "@syncfusion/ej2-inputs/src/textbox/textbox";

export class Args_AbstractText_Multiline {
   /**
    * (Optional) Initial number of lines. If not specified, defaults to 2
    */
   initial_line_count ?: number;

   /**
    * (Optional) Should the text box autoresize depending on its content. Defaults to yes.
    */
   autoresize?: boolean;

   /**
    * (Optional) This function will be called on the create event of the text box if the autoresize parameter above is set to true.
    *
    * This function will replace the default autoresize create function which has the following code:
    *
    * <code>
    * (args: any) => {
    *    this.obj.addAttributes({rows: "2"});
    *    this.obj.element.style.height = "auto";
    *    this.obj.element.style.height = (this.obj.element.scrollHeight - 7) + "px";
    * }
    * </code>
    */
   autoresize_created_function_override ?: (args: any) => void;

   /**
    * (Optional) This function will be called on the input event of the text box if the autoresize parameter above is set to true.
    *
    * This function will replace the default autoresize input function which has the following code:
    *
    * <code>
    * (args: any) => {
    *      args.event.currentTarget.style.height = "auto";
    *      args.event.currentTarget.style.height = (args.event.currentTarget.scrollHeight) + "px";
    * }
    * </code>
    */
   autoresize_input_function_override ?: (args: any) => void;

}

export abstract class Args_AbstractText extends Args_AnyWidget<TextBoxModel> {

   /**
    * Control label. Overwrites the placeholder in the ej.placeholder in places
    */
   label?: string;

   labelTagDecoration ?: IArgs_HtmlDecoration;
   eControlWrapperDecoration ?: IArgs_HtmlDecoration;
   eFloatLineDecoration ?: IArgs_HtmlDecoration;

   includeErrorLine ?: boolean;
   error ?: IArgs_HtmlTag;
   /**
    * Controls if the textbox updates the DataProvider on 'blur' or 'change' of the input contents, the provider data propertyName attribute will be updated and a DataProviderChangeEvent will be fired
    */
   updateDataProviderDisabled ?: boolean;
   stayFocusedOnError ?: boolean;

   initialValue ?: StringArg;

   enabled ?: boolean;

   /**
    * (Optional) If this parameter is not null (even if it's {}) then the text box becomes multiline.
    * By default it will have 2 lines, and will be self-expanding
    */
   multiline ?: Args_AbstractText_Multiline;

   onKeyUp?: (widget: AbstractText, event: KeyboardEvent) => Promise<void>;
   onKeyDown?: (widget: AbstractText, event: KeyboardEvent) => Promise<void>;
   onChange ?: (widget: AbstractText, event: Event) => Promise<void>;

   /**
    * Called whenever either change/blur/both warrant a modification of the underlying data.
    * Use this even as a catch all for when data has been changed.
    */
   onDataProviderChange ?: (widget: AbstractText, value:string) => Promise<void>;


}

/**
 * Textbox that defaults the following TextboxModel properties to the following values that are different than the EJ defaults:
 *
 * autocomplete: 'off'
 * floatLabelType: "Always"
 */
export abstract class AbstractText extends AnyWidget<TextBox, Args_AnyWidget, string> {

   protected _lastInputValue:string = '';

   protected constructor() {
      super();
   }

   protected async initialize_AbstractText(args: Args_AbstractText) {
      args          = IArgs_HtmlTag_Utils.init(args);
      this.initArgs = args;
      if (!args.ej)
         args.ej = {};

      let ej: TextBoxModel = args.ej;

      this.initArgs           = args;
      this.stayFocusedOnError = args.stayFocusedOnError;
      this.previousValue      = ''; // initialize at ''

      if (!this.tagId)
         this.tagId = getRandomString(args.id);
      args.id = this.tagId;

      if (!args.ej.autocomplete)
         args.ej.autocomplete = `off-${this.tagId}`;  //https://stackoverflow.com/questions/30053167/autocomplete-off-vs-false

      if (!args.ej.floatLabelType)
         args.ej.floatLabelType = 'Always';

      if (args.label)
         args.ej.placeholder = args.label; // overwrite label

      if (args.enabled != null)
         args.ej.enabled = args.enabled;


      if (args.multiline != null) {
         let autoresize: boolean = args?.multiline?.autoresize;
         if (autoresize == null)
            autoresize = true; // default to true

         let initial_line_count: number = args?.multiline?.initial_line_count;
         if (initial_line_count == null)
            initial_line_count = 2; // default to 2 lines

         let default_created_function: (ev: any) => void = (_ev: any) => {
            this.obj.addAttributes({rows: '' + initial_line_count});

            this.obj.element.style.height = "auto";
            this.obj.element.style.height = (this.obj.element.scrollHeight - 7) + "px";
         }

         let created_function: (ev: any) => void = args?.multiline?.autoresize_created_function_override;

         let input_function: (ev: any) => void = args?.multiline?.autoresize_input_function_override;
         if (input_function == null) {
            if (autoresize) {
               input_function = (ev: any) => {
                  ev.event.currentTarget.style.height = "auto";
                  ev.event.currentTarget.style.height = (ev.event.currentTarget.scrollHeight) + "px";
               }
            }
         }

         //---------- Now let's adjust the default ej passed to the textbox for the above ------------
         ej.multiline = true;

         let ej_created_function = ej.created;
         ej.created              = (ev: any) => {
            try {
               default_created_function.call(this, ev);
            } catch (e) {
               this.handleError(e);
            }

            if (created_function != null)
               try {
                  created_function.call(this, ev);
               } catch (e) {
                  this.handleError(e);
               }

            if (ej_created_function != null)
               try {
                  ej_created_function.call(this, ev);
               } catch (e) {
                  this.handleError(e);
               }
         } // ej.created


         let ej_input_function = ej.input;
         ej.input              = (ev: any) => {

            if (input_function != null)
               try {
                  input_function.call(this, ev);
               } catch (e) {
                  this.handleError(e);
               }

            if (ej_input_function != null)
               try {
                  ej_input_function.call(this, ev);
               } catch (e) {
                  this.handleError(e);
               }
         } // input
      } // multiline

      await this.initialize_AnyWidget(args)
   } // initTextField

//TODO Use default
   async localContentBegin(): Promise<string> {
      let x: string = "";

      let args: Args_AbstractText = (this.initArgs as Args_AbstractText);
      if (args.wrapper) {
         args.wrapper = IArgs_HtmlTag_Utils.init(args.wrapper);
         x += `<${args.wrapper.htmlTagType} id="${this.wrapperTagID}"${IArgs_HtmlTag_Utils.all(args.wrapper)}>`;
      }


      args.htmlTagType                           = 'input';
      args.htmlOtherAttr['data-msg-containerid'] = this.errorTagID;
      args.htmlOtherAttr['name']                 = args.propertyName;
      if (args.required) {
         args.includeErrorLine          = true;
         args.htmlOtherAttr['required'] = null;
      }

      x += `<input id="${this.tagId}" ${IArgs_HtmlTag_Utils.all(args)}/>`;   //hardcoded input tag because of ending />

      if (args.includeErrorLine) {
         let errorArgs = IArgs_HtmlTag_Utils.init(args.error);

         x += `<${errorArgs.htmlTagType} id="${this.errorTagID}"${IArgs_HtmlTag_Utils.all(errorArgs)}>`;
         x += `</${errorArgs.htmlTagType}>`; // <!-- id="${this.errorTagID}"-->
      } // if (args.includeErrorLine)

      if (args.wrapper) {
         x += `</${args.wrapper.htmlTagType}>`; // <!-- id="${this.wrapperTagID}" -->
      }
      return x;
   }

   async localLogicImplementation() {
      let thisX = this;
      thisX._lastInputValue = this.hgetInput?.value; // raw input value
      await super.localLogicImplementation();

      let args  = this.initArgs as Args_AbstractText;
      args.ej   = args.ej || {}; // ensure it's not null


      // let originalBlurMethod = args.ej.blur;
      //    args.ej.blur = async (arg, rest) => {
      //
      //       let currentInputValue = arg.value; // raw input value (from the parameter because in multiline this is the only good value)
      //
      //       await thisX._updateDataProvider(thisX, args, currentInputValue);
      //
      //       if (originalBlurMethod) {
      //          try {
      //             originalBlurMethod.call(thisX, arg, rest); // execute the passed in blur
      //          }catch(e){console.error(e)};
      //       } // if (originalBlurMethod)
      //
      //    };


      let ejCreated = args.ej.created

      args.ej.created = (arg_created) => {

         let inputElem = document.getElementById(this.tagId);
         if (inputElem) {
            let wrapper: HTMLElement = inputElem.closest('div.e-control-wrapper'); // the first div with class 'e-control-wrapper' containing this
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


         if (ejCreated)
            ejCreated(arg_created);
      } // created


      let existingChangeFunction = args.ej.change;
      args.ej.change = async (ev:ChangedEventArgs)  => {
         if ( existingChangeFunction){
            try {
               existingChangeFunction.call(this, ev);
            }catch(e){console.error(e)};
         }

         if ( ev.previousValue ==ev.value ) // if the value is the same as before or the change was not interacted with, then don't update the data provider) {
            return;

         if (args?.updateDataProviderDisabled) {
            // do nothing
         } else {
            await thisX._updateDataProvider(thisX, args, ev.value);
         }

      } // change

      this.obj = new TextBox(args.ej);
      this.obj.appendTo(this.hgetInput);


      this.hgetInput.addEventListener("keydown", async (event: KeyboardEvent) => {
         let args = this.initArgs as Args_AbstractText
         if (args.onKeyDown) {
            try {
               await args.onKeyDown(thisX, event);
            } catch (e) {
               console.error(e); // don't stop for an error in the user onKeyUp
            }

         }
      });

      this.hgetInput.addEventListener("keyup", async (event: KeyboardEvent) => {
         let args = this.initArgs as Args_AbstractText
         if (args.onKeyUp) {
            try {
               await args.onKeyUp(thisX, event);
            } catch (e) {
               console.error(e); // don't stop for an error in the user onKeyUp
            }

         }
      });


      this.hgetInput.addEventListener("change", async (ev: Event) => {
         if (args.onChange) {
            try {
               await args.onChange(thisX, ev);
            } catch (e) {
               console.error(e); // don't stop for an error in the user onChange
            }
         }
      });



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

      if (this.obj && this.initArgs?.dataProviderName && this.initArgs?.propertyName) {
         let data             = DataProvider.byName(this, this.initArgs.dataProviderName);
         let value: string    = '';
         let enabled: boolean = false;
         if (data) {
            value   = data[this.initArgs.propertyName];
            enabled = true; // there is data so it's enabled
         }

         this.value         = value;
         this.previousValue = value;

         if (this.initArgs?.ej?.enabled) {
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

   //--------------------------- AnyWidget implementation ---------------


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
         super.value    = val;
      }
   }

   convertValueBeforeSet(val: any): string {
      if (val == null)
         val = ''; // default null, undefined to ''
      return val.toString();
   }

   protected async _validateCurrentForm(): Promise<boolean> {
      let thisX = this;
      let valid = await thisX.validateForm(this);
      if (!valid) {
         if (this.stayFocusedOnError) {
            if (this.hgetInput) {
               this.hgetInput.focus(); // just stay in this field
            }
         }
      } // if (!validated)
      return valid;

   } // _localUpdateDataProvider

   protected async _updateDataProvider(thisX: AbstractText, args:Args_AbstractText, currentInputValue: string): Promise<void> {

      if ( thisX._lastInputValue == currentInputValue ) {
         // no update
      } else {

         if (args.updateDataProviderDisabled) {
            // do nothing
         } else {
            let valid: boolean = await thisX._validateCurrentForm.call(thisX);      // local onBlur
            if (valid) {
               thisX.value = currentInputValue; // update value based on new changed value

               if (args?.onDataProviderChange) {
                  try {
                     await args?.onDataProviderChange.call(thisX, thisX, currentInputValue);
                  } catch (e) {
                     console.error(e)
                  }
                  ;
               }
               thisX._lastInputValue = currentInputValue;
            } // if (valid)
         } // if (args.updateDataProviderDisabled)
      } // if ( this._lastInputValue == currentInputValue )
   }

} // main class