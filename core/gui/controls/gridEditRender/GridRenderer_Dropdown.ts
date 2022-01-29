import {Args_GridRenderer_Common}      from "./GridRenderer_Common";
import {ChangeEventArgs, DropDownList} from "@syncfusion/ej2-dropdowns";
import {QueryCellInfoEventArgs}        from "@syncfusion/ej2-grids";
import {DropDownListModel}             from "@syncfusion/ej2-dropdowns/src/drop-down-list";
import {getErrorHandler}               from "../../../CoreErrorHandling";

export class Args_GridRenderer_Dropdown<LIST_RECORD = any> extends Args_GridRenderer_Common<DropDownList, DropDownListModel, (string |number | boolean), ChangeEventArgs, HTMLInputElement> {
   listRecords: LIST_RECORD[];
   textFieldName: string;
   valueFieldName: string;

}


export function dropdownRenderer(params: Args_GridRenderer_Dropdown) {
   try {
      let args: QueryCellInfoEventArgs = params.args;
      let editable                     = params.editable == null ? false: params.editable;

      if (params.htmlClassName == null)
         params.htmlClassName = 'ng-ddr' // nexus grid - drop down renderer

      if (params.htmlTemplate == null)
         params.htmlTemplate = `<input class="${params.htmlClassName}"/>`;

      if (params.getHtmlElement == null) {
         params.getHtmlElement = (args) => {
            return <HTMLInputElement>args.cell.getElementsByClassName(params.htmlClassName).item(0);
         } // function definition
      } // if

      //----------------------------------------
      if (params.widgetModel == null)
         params.widgetModel = {};

      let changeFunction           = params.widgetModel.change;
      let model: DropDownListModel = Object.assign(params.widgetModel, {
         dataSource:     params.listRecords,
         fields:         {value: params.valueFieldName, text: params.textFieldName,},
         floatLabelType: 'Never',
         value:          params.initialValue,
         enabled:        editable,
         change:         async (ev) => {
            if (params.callback)
               await params.callback(dropDownList, ev);
            if (changeFunction != null) {
               try {
                  changeFunction(ev);
               } catch (ex) {
                  getErrorHandler().displayExceptionToUser(ex);
               }
            }

         }


      } as DropDownListModel);


      args.cell.innerHTML               = params.htmlTemplate;
      let htmlElement: HTMLInputElement = params.getHtmlElement(args);
      let dropDownList                  = new DropDownList(model, htmlElement);
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