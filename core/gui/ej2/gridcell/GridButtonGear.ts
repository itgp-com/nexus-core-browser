import {AbstractGridButton}                  from "../abstract/AbstractGridButton";
import {ColumnModel, QueryCellInfoEventArgs} from "@syncfusion/ej2-grids";
import {GridWidgetCallBack}                  from "../../WidgetUtils";


export class GridButtonGear extends AbstractGridButton {
   static readonly CLASS_NAME:string = 'GridButtonGear';

   constructor() {
      super({
               buttonClass: GridButtonGear.CLASS_NAME,
               fa_classes:  'fa-solid fa-gear'
            });
   }
}

//----------------------
const GRID_BUTTON_GEAR: GridButtonGear = new GridButtonGear();

export function gridButtonGearColumnModel(): ColumnModel {
   return GRID_BUTTON_GEAR.columnModel();
}

export function gridButtonGearInstantiate(args: QueryCellInfoEventArgs, callback ?: GridWidgetCallBack, toolTip ?: string) {
   return GRID_BUTTON_GEAR.instantiate(
      {
         args:     args,
         callback: callback,
         toolTip:  toolTip,
      });
}