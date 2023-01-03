import {QueryCellInfoEventArgs}                   from "@syncfusion/ej2-grids";
import {Args_GridRenderer_Common}                 from "./GridRenderer_Common";
import {ChangeEventArgs, CheckBox, CheckBoxModel} from "@syncfusion/ej2-buttons";
import {getErrorHandler}                          from "../../../../CoreErrorHandling";


export class Args_GridRenderer_Checkbox extends Args_GridRenderer_Common<CheckBox, CheckBoxModel, boolean, ChangeEventArgs, HTMLInputElement> {
}


export function checkboxRenderer(params: Args_GridRenderer_Checkbox) {
   try {
      let args: QueryCellInfoEventArgs = params.args;
      let editable                     = params.editable == null ? false: params.editable;

      if (params.htmlClassName == null)
         params.htmlClassName = 'ng-cbr' // nexus grid - check box renderer

      if (params.htmlTemplate == null)
         params.htmlTemplate = `<input class="${params.htmlClassName}" type="checkbox"/>`;

      if (params.getHtmlElement == null) {
         params.getHtmlElement = (args) => {
            return <HTMLInputElement>args.cell.getElementsByClassName(params.htmlClassName).item(0);
         } // function definition
      } // if

      if (params.widgetModel == null)
         params.widgetModel = {};

      let changeFunction = params.widgetModel.change;

      let model: CheckBoxModel = Object.assign(params.widgetModel, {
         checked:  params.initialValue,
         disabled: !editable,
         change:   async (ev) => {
            if (params.callback)
               await params.callback(checkbox, ev);
            if (changeFunction != null) {
               try {
                  changeFunction(ev);
               } catch (ex) {
                  getErrorHandler().displayExceptionToUser(ex);
               }
            }
         },
      } as CheckBoxModel);


      args.cell.innerHTML               = params.htmlTemplate;
      let htmlElement: HTMLInputElement = params.getHtmlElement(args);
      let checkbox                      = new CheckBox(model, htmlElement);
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