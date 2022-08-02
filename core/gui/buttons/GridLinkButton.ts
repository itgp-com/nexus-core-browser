import {AbstractGridButton}  from "../../ej2/grid/AbstractGridButton";
import {ej2_icon_createlink} from "../controls/WgtCSS";


export class GridLinkButton extends AbstractGridButton {
   public static readonly BTN_LINK_CLASS: string   = 'btnLinkClass';

   constructor() {
      super({
               buttonClass:   GridLinkButton.BTN_LINK_CLASS,
               iconClassName: ej2_icon_createlink,
               tooltip:       'Link this record',
            });
   }
}