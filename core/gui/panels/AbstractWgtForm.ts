import {AnyWidget}                                          from "../AnyWidget";
import {Args_AnyWidget, IArgs_HtmlTag, IArgs_HtmlTag_Utils} from "../Args_AnyWidget";
import {FormValidator, FormValidatorModel}   from '@syncfusion/ej2-inputs';
import {AbstractWidget, Args_AbstractWidget} from "../AbstractWidget";


export class Args_WgtForm extends Args_AnyWidget {
   validation?: FormValidatorModel;
   /**
    * Create method will overwrite the formTag.htmlTagType to 'form'
    */
   formTag ?: IArgs_HtmlTag

} // Args_WgtForm

export abstract class AbstractWgtForm extends AnyWidget<any, Args_AnyWidget, any> {
   args: Args_WgtForm;
   private _validator: FormValidator;
   readonly wgtForm: boolean = true;

   protected constructor() {
      super();
   }

   static isWgtForm(instance: any): boolean {
      if (instance && instance.wgtForm) {
         return true;
      }
      return false;
   } // isForm

   initialize_AbstractWgtForm(args: Args_WgtForm) {
      this.args = args;

      let argsAnyWidget: Args_AnyWidget;

      if (args) {
         argsAnyWidget = {
            children: this.args.children,
         };

      }
      this.initialize_AnyWidget(argsAnyWidget);
   } // initialize_WgtForm


   async localContentBegin(): Promise<string> {
      let classString = Args_AbstractWidget.combineAllWidgetClassesAsString(this.args, false);
      if (classString) {
         if (this.args.formTag.htmlTagClass )
            this.args.formTag.htmlTagClass += ' '
         this.args.formTag.htmlTagClass += classString
      } // if classString


      let x: string = "";
      try {
         let tag = this.args.formTag.htmlTagType; // 'form'

         x += `<${tag} id="${this.tagId}"${IArgs_HtmlTag_Utils.class(this.args.formTag)}${IArgs_HtmlTag_Utils.style(this.args.formTag)}>`;

      } catch (e) {
         this.handleError(e);
      }
      return x;
   }

   async localContentEnd(): Promise<string> {
      let x   = '';
      let tag = this.args.formTag.htmlTagType; // 'form'

      x += `</${tag}>`;
      return x;
   }

   async localLogicImplementation(): Promise<void> {
      if (this.args.validation && this.hgetForm) {
         this._validator = new FormValidator(this.hgetForm, this.args.validation);
      }

      // Disable Enter on Form but not on inputareas
      $(document).on("keydown", ":input:not(textarea)", function(event) {
         if (event.key == "Enter") {
            event.preventDefault();
         }
      });

   }

   async localDestroyImplementation(): Promise<void> {
      await super.localDestroyImplementation();
      try {
         if (this._validator && this._validator.element)
            this._validator.destroy();

      } catch (e) {
         console.log(e);
      }
   }

   //------------------------------------------

   get formValidator(): FormValidator {
      if (!this._validator && this.hgetForm) {
         this._validator = new FormValidator(this.hgetForm, this.args.validation);
      }
      return this._validator;
   }
} // WgtForm