import {Args_AnyWidget, IArgs_HtmlTag, IArgs_HtmlTag_Utils} from "../Args_AnyWidget";
import {hget, StringArg, stringArgVal}                      from "../../CoreUtils";
import {Args_WgtSimple, WgtSimple}                          from "./WgtSimple";
import { enableRipple }                                     from '@syncfusion/ej2-base';
enableRipple(true);
import { TreeView, TreeViewModel }                          from '@syncfusion/ej2-navigations';
import {Args_WgtLbl}                                        from "./WgtLbl";
import {DataManager}                                        from "@syncfusion/ej2-data";
import {Grid}                                               from "@syncfusion/ej2-grids";
import {IDataProviderSimple}                                from "../../data/DataProvider";

export type TreeViewModelType =  DataManager | { [key: string]: Object }[];

export class Args_WgtTreeView_Simple extends Args_WgtSimple implements IArgs_HtmlTag {
   htmlTagType ?: string; // div by default
   htmlTagClass ?: string;
   htmlTagStyle ?: string;

   dataSource : TreeViewModelType;
}

export class  WgtTreeView_Simple extends WgtSimple<TreeView, Args_AnyWidget, TreeViewModelType> {
   args: Args_WgtTreeView_Simple;
   treeViewModel: TreeViewModel;

   protected constructor() {
      super();
   }

   static create<DATA_CLASS = any>(args: Args_WgtTreeView_Simple) {
      args                             = <Args_WgtTreeView_Simple>IArgs_HtmlTag_Utils.init(args);
      let instance: WgtTreeView_Simple = new WgtTreeView_Simple();
      instance.initialize_WgtTreeView_Simple(args);
      return instance;
   }

   createTreeViewModel(){
      let thisX = this;
      this.treeViewModel = {
         fields:{
            dataSource: this.args.dataSource,
            id: 'nodeID',
            child: 'children',
            text: 'nodeText'
         },
      }
   }

   initialize_WgtTreeView_Simple(args: Args_WgtTreeView_Simple){
      this.args = args;
      this.createTreeViewModel(); // allows developer to extend this class and customize the model
      this.initialize_WgtSimple(args);
   }

   async localContentBegin(): Promise<string> {
      let x = `<${this.args.htmlTagType} id="${this.tagId}"${IArgs_HtmlTag_Utils.all(this.args)}></${this.args.htmlTagType}>`;
      return x;
   }

   async localLogicImplementation(): Promise<void> {
      this.obj = new TreeView(this.treeViewModel);
      this.obj.appendTo(hget(this.tagId))
      this.obj.expandAll();
   }


   get value(): TreeViewModelType {
      return this.args.dataSource;
   }

   set value(val: TreeViewModelType) {
      this.args.dataSource = val;
   }

   getDataProviderSimple(): IDataProviderSimple {
      return null;
   }

}