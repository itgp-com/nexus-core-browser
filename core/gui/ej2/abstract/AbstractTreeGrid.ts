import {ExcelQueryCellInfoEventArgs} from '@syncfusion/ej2-grids';
import {isFunction} from 'lodash';
import {IArgs_HtmlTag_Utils} from "../../../BaseUtils";
import {Args_AnyWidget}      from "../../AnyWidget";
import {AnyWidgetStandard}   from "../../AnyWidgetStandard";
import {DataManager}         from "@syncfusion/ej2-data";
import {ExcelExport, Page, Resize, Toolbar, TreeGrid, TreeGridModel} from '@syncfusion/ej2-treegrid';


TreeGrid.Inject(Toolbar, ExcelExport, Page, Resize);

export class Args_AbstractTreeGrid extends Args_AnyWidget<TreeGridModel> {

   /**
    * Defaults to false (apply formatter function from column to excel export)
    * If true, the excelQueryCellInfo event will not call any formatter functions when exporting
    * If false, the excelQueryCellInfo event will call the formatter function and set the value to the result of the formatter
    */
   disableExcelAutoFormater?: boolean;
}

export abstract class AbstractTreeGrid extends AnyWidgetStandard<TreeGrid, Args_AbstractTreeGrid, any> {

   protected constructor() {
      super();
   }

   protected async initialize_AbstractTreeGrid(args: Args_AbstractTreeGrid) {
      args = IArgs_HtmlTag_Utils.init(args);
      args.ej = args.ej || {};

      if (args.disableExcelAutoFormater) {
         // do nothing
      } else {
         try {
            let existingExcelQueryCellInfo = args.ej.excelQueryCellInfo;

            args.ej.excelQueryCellInfo = (args: ExcelQueryCellInfoEventArgs) => {
               try {
                  let formatter: any = args.column.formatter;
                  if (formatter && isFunction(formatter)) {
                     args.value = formatter(args.column, args.data);
                  } // if formatter

                  if (existingExcelQueryCellInfo) {
                     existingExcelQueryCellInfo.call(this, args);
                  } // if existingExcelQueryCellInfo

               } catch (e) { console.error(e); }
            } // excelQueryCellInfo
         } catch (e) { console.error(e); }
      }

      await this.initialize_AnyWidgetStandard(args);
   }



   async localLogicImplementation() {
      let anchor = this.hget;
      this.obj   = new TreeGrid(this.initArgs?.ej);
      this.obj.appendTo(anchor);
   } // localLogicImplementation


   async localClearImplementation() {
      await super.localClearImplementation();
      if (this.obj) {
         this.obj.dataSource = [];
      }
   } // localClearImplementation

   get value(): Object | DataManager {
      if (this.obj)
         return this.obj.dataSource;
      else
         return [];
   }

   set value(value: Object | DataManager) {
      if (this.obj) {
         let val = this.convertValueBeforeSet(value)
         this.obj.dataSource = val;
         super.value = val;
      }
   }


} // main class