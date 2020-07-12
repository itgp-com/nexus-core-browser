import {AbstractGridButton} from "../../ej2/grid/AbstractGridButton";

export const ej2_icon_createlink        = 'ej2-icon-createlink';

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