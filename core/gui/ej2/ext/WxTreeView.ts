import {addWidgetClass}                          from "../../AbstractWidget";
import {AbstractTreeView, Args_AbstractTreeView} from "../abstract/AbstractTreeView";

export class Args_WxTreeView extends Args_AbstractTreeView {
}

export class WxTreeView extends AbstractTreeView {
static readonly CLASS_NAME:string = 'WxTreeView';
   protected constructor() {
      super();
   }

   public static async create(args: Args_WxTreeView) : Promise<WxTreeView>{
      let instance = new WxTreeView();
      await instance.initialize_WxTreeView(args);
      return instance;
   }

   protected async initialize_WxTreeView(args: Args_WxTreeView) {
      if (!args)
         args = new Args_WxTreeView();

      args.ej = args.ej || {};
      addWidgetClass(args, WxTreeView.CLASS_NAME);
      await super.initialize_AbstractTreeView(args);
   }
}

/**
 * This class describes the nodeData property of the event object under the nodeSelected:(ev:NodeSelectEventArgs) event
 */
export class WgtTreeView_NodeData {
   id: string;
   text: string;
   parentID: string;
   selected: boolean;
   expanded: boolean;
   isChecked: boolean;
   hasChildren: boolean;
}