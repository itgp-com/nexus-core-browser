import {ColumnModel, QueryCellInfoEventArgs} from "@syncfusion/ej2-grids";
import {GridWidgetCallBack}                  from "../WidgetUtils";
import {Button}                              from "@syncfusion/ej2-buttons";
import {Tooltip}                             from "@syncfusion/ej2-popups";
import {ButtonModel}                         from "@syncfusion/ej2-buttons/src/button/button-model";

export class Args_AbstractGridButton {
   buttonClass: string; // BTN_LINK_CLASS
   iconClassName ?: string //ej2_icon_createlink
   /**
    * Any font awesome class(es)that will render inside the button HTML
    * Example: fa-angle-double-up to include <i class="fa fa-angle-double-up" aria-hidden="true"></i> inside the button layout
    */
   fa_classes ?: string // Font awesome classes
   tooltip ?: string
   /**
    * Usually empty for a grid button, but if present it will be the text to render for the button
    */
   label ?: string
}

export class Args_AbstractGridButton_Instantiate {
   args: QueryCellInfoEventArgs;
   callback ?: GridWidgetCallBack;
   toolTip?: string;
}

export abstract class AbstractGridButton {
   args: Args_AbstractGridButton;


   constructor(args: Args_AbstractGridButton) {
      this.args = args;
   }

   columnModel(): ColumnModel {
      let label: string = ''
      if (this.args.label != null) {
         label = this.args.label.escapeHTML()
      }
      let template: string = `<button class="${this.args.buttonClass}">${label}</button>`;
      if (this.args.fa_classes != null) {
         if (label != '')
            label = ' ' + label // add a space between the icon and the text
         template = `<button class="${this.args.buttonClass} grid-btn-font-awesome"><i class="fa ${this.args.fa_classes}" aria-hidden="true"></i>${label}</button>`

      }


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

   instantiate(params: Args_AbstractGridButton_Instantiate,): HTMLElement {
      if (params.toolTip) {
         this.args.tooltip = params.toolTip;
      }

      let btnLinkElem = <HTMLElement>params.args.cell.getElementsByClassName(this.args.buttonClass).item(0);
      if (btnLinkElem) {

         let buttonModel: ButtonModel = {}
         if (this.args.iconClassName)
            buttonModel = {
               iconCss: `e-icons ${this.args.iconClassName}`,
            };

         let ej2ButtonInstance = new Button(buttonModel);

         ej2ButtonInstance.appendTo(btnLinkElem);
         let tt:Tooltip = null;

         if (this.args.tooltip) {
            tt = new Tooltip({
                                    content:    this.args.tooltip,
                                    openDelay:  500,
                                    closeDelay: 10,
                                 });
            tt.appendTo(btnLinkElem);

         } // if tooltip

         btnLinkElem.onclick = () => {
            if (tt)
               tt.close();

            if (params.callback)
               params.callback(params.args); // trigger the callback function passed in
         }
      }
      return btnLinkElem;
   } // link

} // main class