import {ColumnModel}        from "@syncfusion/ej2-grids";
import {MetaTableData_Base} from "../gui/MetaTableData_Base";

export class MetaTableData extends MetaTableData_Base {

   LABELS ?: { [key: string]: string }       = {};
   // noinspection JSUnusedGlobalSymbols
   GRID_COLUMNS ?: ColumnModel[]             = [];
   GRIDCOLS?: { [key: string]: ColumnModel } = {};

   // noinspection JSUnusedGlobalSymbols
   changeLabel(colName:string, newLabel:string){
      this.LABELS[colName] = newLabel;
      this.GRIDCOLS[colName].headerText = this.LABELS[colName];
   }

   changeColumn(colName:string, changes:ColumnModel){
      if ( ! changes)
         return;

      if ( changes.hasOwnProperty('headerText')){
         // sync with the label
         let newLabel = changes.headerText;
         this.LABELS[colName] = newLabel;
      }

      let currentColModel = this.GRIDCOLS[colName];
      if ( currentColModel){
         this.GRIDCOLS[colName] = Object.assign(currentColModel, changes);
      }

   } // changeColumn
}

