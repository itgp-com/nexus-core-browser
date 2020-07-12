import {AnyWidget}                                          from "../AnyWidget";
import {Args_AnyWidget, IArgs_HtmlTag, IArgs_HtmlTag_Utils} from "../Args_AnyWidget";
import {FormValidator, FormValidatorModel}                  from '@syncfusion/ej2-inputs';
import {AbstractWidget}                                     from "../AbstractWidget";


export class Args_WgtForm {
   validation?: FormValidatorModel;
   /**
    * Create method will overwrite the formTag.htmlTagType to 'form'
    */
   formTag ?: IArgs_HtmlTag
   children ?: AbstractWidget[];

} // Args_WgtForm

export class WgtForm extends AnyWidget<any, Args_AnyWidget, any> {
   args: Args_WgtForm;
   private _validator: FormValidator;
   readonly wgtForm: boolean = true;

   protected constructor() {
      super();
   }


   static create(args: Args_WgtForm): WgtForm {
      args.formTag             = IArgs_HtmlTag_Utils.init(args.formTag);
      args.formTag.htmlTagType = 'form';
      let instance             = new WgtForm();
      instance.initialize_WgtForm(args);
      return instance;
   }

   static isWgtForm(instance: any): boolean {
      if (instance && instance.wgtForm) {
         return true;
      }
      return false;
   } // isForm

   initialize_WgtForm(args: Args_WgtForm) {
      this.args = args;

      let argsAnyWidget: Args_AnyWidget;

      if (args) {
         argsAnyWidget = {
            children: this.args.children,
         };

      }
      this.initialize_AnyWidget(argsAnyWidget);
   } // initialize_WgtForm


   localContentBegin(): string {

      let x: string = "";
      try {
         let tag = this.args.formTag.htmlTagType; // 'form'

         x += `<${tag} id="${this.tagId}"${IArgs_HtmlTag_Utils.class(this.args.formTag)}${IArgs_HtmlTag_Utils.style(this.args.formTag)}>`;

      } catch (e) {
         this.handleError(e);
      }
      return x;
   }

   localContentEnd(): string {
      let x   = '';
      let tag = this.args.formTag.htmlTagType; // 'form'

      x += `</${tag}>`;
      return x;
   }

   localLogicImplementation(): void {
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

   localDestroyImplementation(): void {
      super.localDestroyImplementation();
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