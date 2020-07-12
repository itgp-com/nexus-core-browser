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

   initialize_WgtPopupDialog_Grid(args: Args_PopupDialog) {
      this.initialize_WgtGrid(args);

      // AFTER initialization of the popup dialog

      if (args.query)
         this.gridModel.query = args.query;

      //------ Pre-filter the popup
      if (args.filters)
         this.gridModel.filterSettings.columns = args.filters


      if (args.popupDialog) {
         // Overwrite row selection behavior
         this.gridModel.rowSelected = (e: RowSelectEventArgs) => {
            args.popupDialog.gridRowSelected(e);
         }

         if (!args.disableRowDblClick) {
            this.gridModel.recordDoubleClick = (e: RecordDoubleClickEventArgs) => {
               args.popupDialog.gridRowDoubleClick(e);
            }
         }
      } else {// if       if ( args.popupDialog)
         window.alert('SERIOUS ERROR: args.popupDialog is empty when passed to WgtPopupDialog_Grid!!!');
      }

   }

} // main class