import {IArgs_HtmlTag_Utils} from "../../../BaseUtils";
import {Args_AnyWidget}      from "../../AnyWidget";
import {AnyWidgetStandard}   from "../../AnyWidgetStandard";
import {DataManager}         from "@syncfusion/ej2-data";
import {TreeView, TreeViewModel} from "@syncfusion/ej2-navigations";



export class Args_AbstractTreeView extends Args_AnyWidget<TreeViewModel> {
}

export abstract class AbstractTreeView extends AnyWidgetStandard<TreeView, Args_AbstractTreeView, any> {

   protected constructor() {
      super();
   }

   protected async initialize_AbstractTreeView(args: Args_AbstractTreeView) {
      args = IArgs_HtmlTag_Utils.init(args);
      args.ej = args.ej || {};
      await this.initialize_AnyWidgetStandard(args);
   }


   async localLogicImplementation() {
      let anchor = this.hget;
      this.obj   = new TreeView(this.initArgs?.ej);
      this.obj.appendTo(anchor);
   } // localLogicImplementation


   async localClearImplementation() {
      await super.localClearImplementation();
      if (this.obj) {
         this.obj.fields = {
            dataSource: []
         };
      }
   } // localClearImplementation

   async localRefreshImplementation() {
      try {
         if (this.obj) {

            let expandedNodes = this.obj.expandedNodes;
            let selectedNodes = this.obj.selectedNodes


            this.obj.refresh();
            this.obj.expandedNodes = expandedNodes;
            this.obj.selectedNodes = selectedNodes;

         }
      } catch (ex) {
         this.handleError(ex);
      }
   } // localRefreshImplementation

   get value(): DataManager | { [key: string]: Object }[] {
      if (this.obj)
         return this.obj.fields.dataSource;
      else
         return [];
   }

   set value(value: DataManager | { [key: string]: Object }[]) {
      if (this.obj) {
         this.obj.fields.dataSource = value;
         super.value = value;
      }
   }


   //----------------------------

   selectNode( treeNode:string){
      if ( !treeNode)
         return;

      let pk_field_id:string = this.obj.fields.parentID;
      if (!pk_field_id)
         return;

      let currentNodeID:string = treeNode as string;
      let records: any[] = this.obj.getTreeData(currentNodeID) as any[];
      if ( records.length == 0){
         return;
      }

      let originalNodeID = currentNodeID;
      let path: string[] = [currentNodeID];
      while (currentNodeID) {
         let records: any[] = this.obj.getTreeData(currentNodeID) as any[];
         if (records && records.length > 0) {
            let record = records[0];
            currentNodeID = record[pk_field_id];
            path.push(currentNodeID);
         } // if
      } // while current node
      this.obj.expandedNodes = path;
      this.obj.selectedNodes = [originalNodeID];
   } // selectNode

} // main class