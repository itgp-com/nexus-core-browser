import {addWidgetClass}                          from "../../AbstractWidget";
import {AbstractTreeGrid, Args_AbstractTreeGrid} from "../abstract/AbstractTreeGrid";

export class Args_WxTreeGrid extends Args_AbstractTreeGrid {
}

export class WxTreeGrid extends AbstractTreeGrid {
   static readonly CLASS_NAME: string = 'WxTreeGrid';

   protected constructor() {
      super();
   }

   public static async create(args: Args_WxTreeGrid): Promise<WxTreeGrid> {
      let instance = new WxTreeGrid();
      await instance.initialize_WxTreeGrid(args);
      return instance;
   }

   protected async initialize_WxTreeGrid(args: Args_WxTreeGrid) {
      if (!args)
         args = new Args_WxTreeGrid();

      args.ej = args.ej || {};
      addWidgetClass(args, WxTreeGrid.CLASS_NAME);
      await super.initialize_AbstractTreeGrid(args);
   }
}