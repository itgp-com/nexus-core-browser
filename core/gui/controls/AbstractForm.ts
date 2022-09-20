import {IArgs_HtmlTag_Utils}               from "../../BaseUtils";
import {Args_AnyWidget}                    from "../AnyWidget";
import {AnyWidgetStandard}                 from "../AnyWidgetStandard";
import {FormValidator, FormValidatorModel} from '@syncfusion/ej2-inputs';
import {addWidgetClass}                    from "../AbstractWidget";

export class Args_AbstractForm extends Args_AnyWidget {
   declare validation?: FormValidatorModel;

} // Args_WgtForm

export abstract class AbstractForm extends AnyWidgetStandard<any, Args_AnyWidget, any> {
   private _validator: FormValidator;
   readonly wgtForm: boolean = true;

   protected constructor() {
      super();
   }


   protected async initialize_AbstractForm(args: Args_AbstractForm) {
      if (!args)
         args = new Args_AbstractForm();
      args.htmlTagType = 'form';
      args = IArgs_HtmlTag_Utils.init(args);
      addWidgetClass(args, 'AbstractForm');

     // this.descriptor = args; // so it's available in localLogicImplementation
      await this.initialize_AnyWidget(args);
   } // initialize_WgtForm

   async localLogicImplementation(): Promise<void> {
      if (this.initArgs?.validation && this.hgetForm) {
         this._validator = new FormValidator(this.hgetForm, this.initArgs.validation);
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
         this._validator = new FormValidator(this.hgetForm, this.initArgs?.validation);
      }
      return this._validator;
   }
} // WgtForm