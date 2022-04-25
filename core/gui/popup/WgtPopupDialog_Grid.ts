import {WgtGrid_FilterPage}                             from "../controls/WgtGrid_FilterPage";
import {Args_PopupDialog}                               from "./PopupDialog";
import {RecordDoubleClickEventArgs, RowSelectEventArgs} from "@syncfusion/ej2-grids";



export class WgtPopupDialog_Grid<T = any> extends WgtGrid_FilterPage {

   protected constructor() {
      super();
   }

   static create<T = any>(args?: Args_PopupDialog): WgtPopupDialog_Grid<T> {
      let instance = new WgtPopupDialog_Grid<T>();
      instance.initialize_WgtPopupDialog_Grid(args);
      return instance;
   }

   initialize_WgtPopupDialog_Grid(popupArgs: Args_PopupDialog) {
      this.initialize_WgtGrid(popupArgs);

      // AFTER initialization of the popup dialog

      if (popupArgs.query)
         this.gridModel.query = popupArgs.query;

      //------ Pre-filter the popup
      if (popupArgs.filters)
         this.gridModel.filterSettings.columns = popupArgs.filters


      if (popupArgs.popupDialog) {
         // Overwrite row selection behavior
         this.gridModel.rowSelected = (e: RowSelectEventArgs) => {
            popupArgs.popupDialog.gridRowSelected(e);
         }

         if (!popupArgs?.singleSelectSettings?.disableRowDblClick) {
            this.gridModel.recordDoubleClick = (e: RecordDoubleClickEventArgs) => {
               popupArgs.popupDialog.gridRowDoubleClick(e);
            }
         }
      } else {// if       if ( args.popupDialog)
         window.alert('SERIOUS ERROR: args.popupDialog is empty when passed to WgtPopupDialog_Grid!!!');
      }

   }

} // main class