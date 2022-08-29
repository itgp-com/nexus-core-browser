import {IArgs_HtmlTag_Utils}                                         from "../../BaseUtils";
import {Args_AnyWidget}                                              from "../AnyWidget";
import {AnyWidgetStandard}                                           from "../AnyWidgetStandard";
import {DataManager}                                                 from "@syncfusion/ej2-data";
import {ExcelExport, Page, Resize, Toolbar, TreeGrid, TreeGridModel} from '@syncfusion/ej2-treegrid';


TreeGrid.Inject(Toolbar, ExcelExport, Page, Resize);

export class Args_AbstractTreeGrid extends Args_AnyWidget<TreeGridModel> {
}

export abstract class AbstractTreeGrid extends AnyWidgetStandard<TreeGrid, Args_AbstractTreeGrid, any> {

   protected constructor() {
      super();
   }

   protected async initialize_AbstractTreeGrid(args: Args_AbstractTreeGrid) {
      let thisX = this;
      args = IArgs_HtmlTag_Utils.init(args);
      args.ej = args.ej || {};
      await this.initialize_AnyWidgetStandard(args);
   }



   async localLogicImplementation() {
      let anchor = this.hget;
      this.obj   = new TreeGrid(this.descriptor?.ej);
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
         this.obj.dataSource = value;
      }
   }


} // main class