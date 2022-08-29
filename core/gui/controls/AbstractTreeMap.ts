import {Args_AnyWidget}                                                                           from "../AnyWidget";
import {DataManager}                                                                              from "@syncfusion/ej2-data";
import {TreeMapAjax}                                                                              from "@syncfusion/ej2-treemap/src/treemap/utils/helper";
import {TreeMap, TreeMapHighlight, TreeMapLegend, TreeMapModel, TreeMapSelection, TreeMapTooltip} from '@syncfusion/ej2-treemap';
import {AnyWidgetStandard}                                                                        from "../AnyWidgetStandard";
import {IArgs_HtmlTag_Utils}                                                                      from "../../BaseUtils";

TreeMap.Inject(TreeMapTooltip,TreeMapHighlight,TreeMapSelection, TreeMapLegend  );

export class Args_AbstractTreeMap extends Args_AnyWidget<TreeMapModel> {
}

export abstract class AbstractTreeMap extends AnyWidgetStandard<TreeMap, Args_AbstractTreeMap, any> {

   protected constructor() {
      super();
   }

   protected async initialize_AbstractTreeMap(args: Args_AbstractTreeMap) {
      args = IArgs_HtmlTag_Utils.init(args);
      args.ej = args.ej || {};
      await super.initialize_AnyWidgetStandard(args);

   } // initialize_WgtTreeView


   async localLogicImplementation() {
      let anchor = this.hget;
      this.obj   = new TreeMap(this.descriptor?.ej);
      this.obj.appendTo(anchor);
   } // localLogicImplementation


   async localClearImplementation() {
      await super.localClearImplementation();
      if (this.obj)
         this.obj.dataSource= [];
   } // localClearImplementation


   get value(): DataManager | TreeMapAjax | Object[] {
      if (this.obj)
         return this.obj.dataSource;
      else
         return [];
   }

   set value(value: DataManager | TreeMapAjax | Object[]) {
      if (this.obj) {
         this.obj.dataSource = value;
      }
   }

} // main class