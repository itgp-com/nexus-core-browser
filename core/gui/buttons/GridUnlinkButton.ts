import {AbstractGridButton} from "../../ej2/grid/AbstractGridButton";
import {ej2_icon_delete}    from "../controls/WgtCSS";


export class GridUnlinkButton extends AbstractGridButton {
   public static readonly BTN_UNLINK_CLASS: string   = 'btnUnlinkClass';

   constructor() {
      super({
               buttonClass:   GridUnlinkButton.BTN_UNLINK_CLASS,
               iconClassName: ej2_icon_delete,
               tooltip:       'Unlink this record',
            });
   }
}