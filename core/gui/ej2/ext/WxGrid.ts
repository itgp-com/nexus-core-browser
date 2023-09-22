import {cssForN2Grid} from '../../../gui2/ej2/ext/N2Grid';
import {stateGrid_CustomExcelFilter} from '../../../gui2/ej2/ext/util/N2Grid_Options';
import {ThemeChangeEvent, themeChangeListeners} from '../../../gui2/Theming';
import {addWidgetClass}                  from "../../AbstractWidget";
import {AbstractGrid, Args_AbstractGrid} from "../abstract/AbstractGrid";

export class Args_WxGrid extends Args_AbstractGrid{}

export class WxGrid extends AbstractGrid{
   static readonly CLASS_NAME:string = 'WxGrid';

   protected constructor() {
      super();
   }

   static async create(args?: Args_WxGrid): Promise<WxGrid> {
      if (!args)
         args = new Args_WxGrid()

      let instance = new WxGrid();
      await instance.initialize_WxGrid(args);
      return instance;
   }


   protected async initialize_WxGrid(args:Args_WxGrid){
      if(!args)
         args = new Args_WxGrid();
      args.ej = args.ej ||{};
      addWidgetClass(args, WxGrid.CLASS_NAME);

      stateGrid_CustomExcelFilter(args.ej); // Every WxGrid gets an Excel filter from now on

      await super.initialize_AbstractGrid(args);
   }

}

themeChangeListeners().add((ev: ThemeChangeEvent) => {
   cssForN2Grid(WxGrid.CLASS_NAME, 'e-grid');
}); // normal priority