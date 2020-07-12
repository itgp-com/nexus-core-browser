import {Column, IEditCell} from '@syncfusion/ej2-grids';
import {cu}                from "../../index";
import {CheckBox}          from "@syncfusion/ej2-buttons";

export class GridCellEditor_NumericCheckbox implements IEditCell {

   template: string       = `<input id="element" class="numberCheckBox" type="checkbox"/>`;
   hCheckbox: HTMLInputElement = <HTMLInputElement> cu.htmlToElement(this.template);
   rCheckBox: CheckBox;
   innerValue: number     = 0;

   create = () => {
      return this.hCheckbox
   };

   write = (args: { rowData: Object, column: Column }) => {
      let checked: boolean = false;
      this.innerValue      = 0;
      let disabled:boolean = (!( args.column.allowEditing));

      try {
         let value: number = args.rowData[args.column.field] + 0;
         checked           = (value == 0 ? false : true);
         if (checked)
            this.innerValue = 1;
      } catch (e) {
         console.log(e)
      }

      // creates editor
      try {
         //let hCheckbox: HTMLInputElement = <HTMLInputElement>this.hTemplate.getElementsByClassName('numberCheckBox').item(0);
         this.rCheckBox                  = new CheckBox({checked: checked, disabled: disabled}, this.hCheckbox);
      } catch (ex) {
         console.log(ex);
      }
   };

   read = () => {
      return this.innerValue;
   };

   destroy = () => {
      try {
         if (this.rCheckBox)
            this.rCheckBox.destroy();
      } catch (ex) {
         console.log(ex);
      }
   };

}