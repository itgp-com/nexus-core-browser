import {GridLinkButton}                      from "./GridLinkButton";
import {GridUnlinkButton}                    from "./GridUnlinkButton";
import {ColumnModel, QueryCellInfoEventArgs} from "@syncfusion/ej2-grids";
import {GridWidgetCallBack}                  from "../../ej2/WidgetUtils";

export const BTN_GRID_LINK: GridLinkButton                         = new GridLinkButton();
export const BTN_GRID_UNLINK: GridUnlinkButton                     = new GridUnlinkButton();



/** Adds a link button to a data grid
 *
 * Usage:
 * // Import WidgetUtils.ts into the class (here referenced as wu)
 *
 * In the screen logic, add a function call to add the link button to the grid's column model
 *
 let columns: ColumnModel[] = [
 wu.btnInfoGridColumnModel(),
 ...this.childMeta.GRID_COLUMNS
 ];

 */
export function btnLinkGridColumnModel(): ColumnModel {
   return BTN_GRID_LINK.columnModel();
}

export function btnLinkInstantiate(args: QueryCellInfoEventArgs, callback ?: GridWidgetCallBack, toolTip?: string): HTMLElement {
   return BTN_GRID_LINK.instantiate({
                                       args:     args,
                                       callback: callback,
                                       toolTip:  toolTip,
                                    });
}  // link


export function btnUnlinkGridColumnModel(): ColumnModel {
   return BTN_GRID_UNLINK.columnModel();
}  // btnUnlinkGridColumnModel

/** Instantiate a delete button to display in a data grid.  Used to unlink the record
 *
 * @param args
 * @param callback
 * @param toolTip
 * @param thisX
 */
export function btnUnlinkInstantiate(args: QueryCellInfoEventArgs, callback ?: GridWidgetCallBack, toolTip?: string): HTMLElement {
   return BTN_GRID_UNLINK.instantiate({
                                         args:     args,
                                         callback: callback,
                                         toolTip:  toolTip
                                      });
}
