
//TODO Move this to CORE
import {QueryCellInfoEventArgs}    from "@syncfusion/ej2-grids";
import {ChangeEventArgs, CheckBox} from "@syncfusion/ej2-buttons";

export function numericCheckboxRenderer(args: QueryCellInfoEventArgs, checked: boolean) {
   args.cell.innerHTML             = `<input class="numberCheckBox" type="checkbox"/>`;
   let hCheckbox: HTMLInputElement = <HTMLInputElement>args.cell.getElementsByClassName('numberCheckBox').item(0);
   new CheckBox({
                   checked:  checked,
                   disabled: true,
                   // change:   arg => {
                   //    window.alert(arg.checked);
                   // }

                },
                hCheckbox
   );
}

//TODO Move this to CORE
export function numericCheckboxEditableRenderer(args: QueryCellInfoEventArgs, checked: boolean, callback: (checkbox:CheckBox, ev: ChangeEventArgs)=>void) {
   args.cell.innerHTML             = `<input class="numberCheckBox" type="checkbox"/>`;
   let hCheckbox: HTMLInputElement = <HTMLInputElement>args.cell.getElementsByClassName('numberCheckBox').item(0);
   let checkbox = new CheckBox({
                                  checked:  checked,
                                  change:   ev => {
                                     if (callback)
                                        callback(checkbox, ev);
                                  }
                               },
                               hCheckbox
   );
}