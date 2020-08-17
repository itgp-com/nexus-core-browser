import {Grid}                  from "@syncfusion/ej2-grids";
import {Args_WgtGrid, WgtGrid} from "./WgtGrid";
import {IMMEDIATE_MODE_DELAY}  from "../../CoreUtils";

export class Args_WgtGrid_FilterPage extends Args_WgtGrid {
   pagingDisabled?: boolean;
   filteringDisabled?: boolean;
}

export class WgtGrid_FilterPage<T = any> extends WgtGrid {

   protected constructor() {
      super();
   }


   static create<T = any>(args?: Args_WgtGrid): WgtGrid_FilterPage<T> {
      let instance = new WgtGrid_FilterPage<T>();
      instance.initialize_WgtGrid(args);
      return instance;
   }


   createGridModel() {
      let thisX      = this;
      this.gridModel = {
         allowPaging:  true,
         pageSettings: {
            pageSizes: [5, 10, 20, 50, 100],
            pageSize:  10,
            pageCount: 6,
         },

         allowFiltering: true,
         filterSettings: {
            columns : (thisX.args as any)?.filters, // if filters are set, use them
            showFilterBarStatus: true,
            mode:                "Immediate",
            immediateModeDelay: IMMEDIATE_MODE_DELAY,
         },

         allowSorting:      true,
         allowMultiSorting: true,
         allowTextWrap:     true,
         allowResizing:     true,
         allowSelection:    true,
         allowKeyboard:     true,
         dataBound:         () => {
            // filtering by contains not startswith
            let _gridAll = (thisX.obj as Grid);
            // replace default operator (startsWith with contains)
            // if (_gridAll.filterOperators){
            //    //Optional - doesn't do anything, but really should in the future at some point
            //    Object.assign(_gridAll.filterOperators, {startsWith: 'contains'});
            // }
            if (_gridAll.filterModule) {
               //This is the real deal for operator replacement
               Object.assign(_gridAll.filterModule["filterOperators"], {startsWith: 'contains'});
            }
         },
      };
   } //createGridModel


} // main class