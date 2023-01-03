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
      await super.initialize_AbstractGrid(args);
   }

}