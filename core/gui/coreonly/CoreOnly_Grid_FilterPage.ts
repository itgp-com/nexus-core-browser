import {IMMEDIATE_MODE_DELAY}            from "../../CoreUtils";
import {Args_AbstractGrid, AbstractGrid} from "../ej2/abstract/AbstractGrid";
import {Grid}                            from "@syncfusion/ej2-grids";

export class Args_CoreOnly_Grid_FilterPage extends Args_AbstractGrid {
   pagingDisabled?: boolean;
   filteringDisabled?: boolean;
}

export class CoreOnly_Grid_FilterPage<T = any> extends AbstractGrid {

   protected constructor() {
      super();
   }


   static async create<T = any>(args?: Args_CoreOnly_Grid_FilterPage): Promise<CoreOnly_Grid_FilterPage<T>> {
      let instance = new CoreOnly_Grid_FilterPage<T>();
      await instance.initialize_AbstractGrid(args);
      return instance;
   }


   async createGridModel() {
      let thisX      = this;
      this.gridModel = {



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

      let localArgs: Args_CoreOnly_Grid_FilterPage = this.initArgs as Args_CoreOnly_Grid_FilterPage;

      if (!localArgs.filteringDisabled){
         this.gridModel = {
            ...this.gridModel,
            ...{
               allowFiltering: true,
               filterSettings: {
                  columns:             (thisX.initArgs as any)?.filters, // if filters are set, use them
                  showFilterBarStatus: true,
                  mode:                "Immediate",
                  immediateModeDelay:  IMMEDIATE_MODE_DELAY,
               },
            },
         }
      } // if


      if (!localArgs.pagingDisabled) {
         this.gridModel = {
            ...this.gridModel,
            ...{
               allowPaging:  true,
               pageSettings: {
                  pageSizes: [5, 10, 20, 50, 100],
                  pageSize:  10,
                  pageCount: 6,
               },
            },

         }
      }



   } //createGridModel


} // main class