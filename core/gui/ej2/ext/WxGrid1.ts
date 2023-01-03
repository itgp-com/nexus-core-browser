import {Aggregate, ExcelExport, Filter, Grid, Page, Resize, Toolbar} from "@syncfusion/ej2-grids";
import {PageSettingsModel}                                           from "@syncfusion/ej2-grids/src/grid/models/models";
import {addWidgetClass}                                              from "../../AbstractWidget";
import {Args_WxGrid, WxGrid}                                         from "./WxGrid";
import {excelToolbarInGridModel}                                     from "../utils/GridUtils";


Grid.Inject(Toolbar, ExcelExport, Page, Resize, Filter, Aggregate);

export class Args_WxGrid1 extends Args_WxGrid {
   pagingDisabled?: boolean;

   filteringDisabled?: boolean;
   /**
    * By default, the grid in this class will contain an Excel Export button. Set this property to true to disable that.
    */
   disableExcelExport ?: boolean;

   pageSettings ?: PageSettingsModel;
}

export class WxGrid1 extends WxGrid {
static readonly CLASS_NAME:string = 'WxGrid1';
   protected constructor() {
      super();
   }

   static async create(args?: Args_WxGrid1): Promise<WxGrid1> {
      let instance = new WxGrid1();
      await instance._initialize(args);
      return instance;
   }

   protected async _initialize(args:Args_WxGrid1){
      if(!args)
         args = new Args_WxGrid1();
      args.ej = args.ej ||{};
      addWidgetClass(args, WxGrid1.CLASS_NAME);
      await super.initialize_WxGrid(args);
   }

  protected async createGridModel() {
      await super.createGridModel();

      let thisX = this;

      let argsWgtGridApp: Args_WxGrid1 = this.initArgs as Args_WxGrid1;
      let ej                           = argsWgtGridApp.ej || {};


      //----------------  wrap actionBegin -----------------
      let ejActionBegin = ej.actionBegin;
      ej.actionBegin    = (ev) => {
         if (ev.requestType == 'filtering') {
            //TODO: POTENTIAL BUG - check if the actual column definition has different filter operator defined before doing this
            if (ev.currentFilterObject) {
               let operator: string = ev.currentFilterObject?.operator;
               if (operator) {
                  operator = operator.toLowerCase();
                  if (operator == 'startswith') {
                     ev.currentFilterObject.operator = 'contains'; // replace any startsWith with contains
                  }
               }
            } // ev.currentFilterObject

            if (ev?.columns?.length > 0) {
               for (const predicate of ev.columns) {

                  let operator: string = predicate?.operator;
                  if (operator) {
                     operator = operator.toLowerCase();
                     if (operator == 'startswith') {
                        predicate.operator = 'contains'; // replace any startsWith with contains
                     }
                  } // if (operator)
               } // for

            } // if (ev?.columns?.length > 0)


         } //  if (ev.requestType == 'filtering' )

         if (ejActionBegin) {
            try {
               ejActionBegin.call(thisX, ev); // execute original function
            } catch (e) {
               this.handleWidgetError(e);
            }
         }
      };
      //----------------  end actionBegin -----------------

      this.gridModel = {...this.gridModel, ...ej}; //combine arguments with ej overwriting defaults

     if( this.gridModel?.enableVirtualization){
        argsWgtGridApp.pagingDisabled = true; // if virtualization is enabled, paging is disabled
     }


      if (!argsWgtGridApp.pagingDisabled) {

         let pgSettings = argsWgtGridApp.pageSettings;
         if (!pgSettings) {
            pgSettings = {
               pageSizes: [10, 50, 100],
               pageSize:  10,
               pageCount: 6,
            };
         }

         this.gridModel = {
            ...this.gridModel,
            ...{
               allowPaging:  true,
               pageSettings: pgSettings,
            }
         };
      }


      if (!argsWgtGridApp.filteringDisabled) {
         this.gridModel = {
            ...this.gridModel,
            ...{
               allowFiltering: true,
               filterSettings: {
                  showFilterBarStatus: true,
                  // removed 2020-03-28 because of Tab bugs in Syncfusion with Immediate delay
                  // mode:                "Immediate",
                  // immediateModeDelay:  IMMEDIATE_MODE_DELAY, // 300,
               },
            }
         }
      }


      excelToolbarInGridModel(argsWgtGridApp.disableExcelExport, this.gridModel);
   } // createGridModel

} // main class