import {ColumnModel, QueryCellInfoEventArgs} from "@syncfusion/ej2-grids";
import {GridWidgetCallBack}                  from "../WidgetUtils";
import {CheckBox, ChangeEventArgs}           from "@syncfusion/ej2-buttons";
import {Tooltip}                             from "@syncfusion/ej2-popups";
import {ButtonModel}                         from "@syncfusion/ej2-buttons/src/button/button-model";

export class Args_AbstractGridButton {
   checkboxClass: string; // BTN_LINK_CLASS
   tooltip ?: string
   /**
    * Usually empty for a grid button, but if present it will be the text to render for the button
    */
   label ?: string
}

export class Args_AbstractGridCheckbox_Instantiate {
   args: QueryCellInfoEventArgs;
   fieldName: string;
   callback ?: GridWidgetCallBack;
   toolTip?: string;
}

export abstract class AbstractGridCheckbox {
   args: Args_AbstractGridButton;


   constructor(args: Args_AbstractGridButton) {
      this.args = args;
   }

   columnModel(): ColumnModel {
      let label: string = ''
      if (this.args.label != null) {
         label = this.args.label.escapeHTML()
      }
      let template: string = `<input type="checkbox" class="${this.args.checkboxClass}">${label}</input>`;

      return {
         width:            30,
         maxWidth:         40,
         allowFiltering:   false,
         allowSorting:     false,
         allowSearching:   false,
         allowEditing:     false,
         customAttributes: {
            class: 'grid-column-buttons'
         },
         template:         template,
      };
   } // getColumnModel

   instantiate(params: Args_AbstractGridCheckbox_Instantiate,): HTMLElement {
      if (params.toolTip) {
         this.args.tooltip = params.toolTip;
      }

      let checked: boolean = params.args.data[params.fieldName] as boolean;

      let btnLinkElem = <HTMLElement>params.args.cell.getElementsByClassName(this.args.checkboxClass).item(0);
      if (btnLinkElem) {


         let tt: Tooltip = null

         let ej2ButtonInstance = new CheckBox({
                                                 checked: checked,
                                                 label:   this.args.label,
                                                 change:  (arg) => {

                                                    params.args['eventArgs'] = arg; // stash change event args
                                                    if (tt)
                                                       tt.close();

                                                    if (params.callback)
                                                       params.callback(params.args); // trigger the callback function passed in
                                                 }
                                              }
         );

         ej2ButtonInstance.appendTo(btnLinkElem);

         if (this.args.tooltip) {
            let tt = new Tooltip({
                                    content:    this.args.tooltip,
                                    openDelay:  500,
                                    closeDelay: 10,
                                 });
            tt.appendTo(btnLinkElem);
         } // if tooltip

      }
      return btnLinkElem;
   } // link

} // main class