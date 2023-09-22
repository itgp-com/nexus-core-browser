import {cssForN2Grid} from '../../../gui2/ej2/ext/N2Grid';
import {stateGrid_CustomExcelFilter} from '../../../gui2/ej2/ext/util/N2Grid_Options';
import {ThemeChangeEvent, themeChangeListeners} from '../../../gui2/Theming';
import {addWidgetClass} from "../../AbstractWidget";
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
      stateGrid_CustomExcelFilter(args.ej); // Every WxGrid gets an Excel filter from now on
      await super.initialize_AbstractTreeGrid(args);
   }
} // WxTreeGrid

themeChangeListeners().add((ev: ThemeChangeEvent) => {
   cssForN2Grid(WxTreeGrid.CLASS_NAME, 'e-treegrid');
}); // normal priority