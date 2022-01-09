import {QueryCellInfoEventArgs}   from "@syncfusion/ej2-grids";
import {Args_GridRenderer_Common} from "./GridRenderer_Common";
import {getErrorHandler}          from "../../../CoreErrorHandling";
import {TextBox, TextBoxModel,}   from "@syncfusion/ej2-inputs";
import {FocusOutEventArgs}        from "@syncfusion/ej2-inputs/src/textbox/textbox";

const ERROR_CLASS:string = 'e-error';

export class Args_GridRenderer_Textbox extends Args_GridRenderer_Common<TextBox, TextBoxModel, string, FocusOutEventArgs, HTMLInputElement> {
   validate ?: (widget: TextBox) => Promise<boolean>;
}


export function textboxRenderer(params: Args_GridRenderer_Textbox) {
   try {
      let args: QueryCellInfoEventArgs = params.args;
      let editable                     = params.editable == null ? false: params.editable;

      if (params.htmlClassName == null)
         params.htmlClassName = 'ng-tbr' // nexus grid - text box renderer

      if (params.htmlTemplate == null)
         params.htmlTemplate = `<input class="${params.htmlClassName}" />`;

      if (params.getHtmlElement == null) {
         params.getHtmlElement = (args) => {
            return <HTMLInputElement>args.cell.getElementsByClassName(params.htmlClassName).item(0);
         } // function definition
      } // if

      if (params.initialValue == null)
         params.initialValue = '';

      if (params.widgetModel == null)
         params.widgetModel = {};

      let goodValue = params.initialValue;
      let blurFunction = params.widgetModel.blur;
      let focusFunction = params.widgetModel.focus;

      let model: TextBoxModel = Object.assign(params.widgetModel, {
         enabled: editable,
         value: params.initialValue,
         focus : (evt) =>{
            params.initialValue = evt.value;
            if (focusFunction != null){
               try {
                  focusFunction(evt);
               } catch (ex) {
                  getErrorHandler().displayExceptionToUser(ex);
               }
            }
         },
         blur:    async (ev) => {
            let validated = true;
            if (params.validate != null) {
               try {
                  validated = await params.validate(textBox);
               } catch (ex) {
                  getErrorHandler().displayExceptionToUser(ex);
               }
            }

            htmlInputElement.parentElement.classList.remove(ERROR_CLASS);
            if (validated){
               goodValue = textBox.value;
            }else {
               // textBox.value = params.initialValue; // revert to initial value
               htmlInputElement.parentElement.classList.add(ERROR_CLASS);
               if (htmlInputElement) {
                  htmlInputElement.focus(); // just stay in this field
               }
               return;  // if not validated , don't execute any of the blur code
            } // if (!validated)


            if (params.callback)
               await params.callback(textBox, ev);
            if (blurFunction != null) {
               try {
                  blurFunction(ev);
               } catch (ex) {
                  getErrorHandler().displayExceptionToUser(ex);
               }
            }

         },
      } as TextBoxModel);


      args.cell.innerHTML                    = params.htmlTemplate;
      let htmlInputElement: HTMLInputElement = params.getHtmlElement(args);
      let textBox                            = new TextBox(model, htmlInputElement);

      htmlInputElement.onkeyup = (e)=>{
         if (e.   key == "Escape" ){
            textBox.value = goodValue; // revert
            htmlInputElement.parentElement.classList.remove(ERROR_CLASS);
         }
      };

   } catch (ex) {
      if (params.exceptionHandler == null) {
         getErrorHandler().displayExceptionToUser(ex);
      } else {
         try {
            params.exceptionHandler(ex);
         } catch (ex2) {
            console.error('Exception Handler generated its own exception:', ex2);
            getErrorHandler().displayExceptionToUser(ex);
         }
      }
   }
}