import {AbstractGridButton} from "./AbstractGridButton";


export class GridLinkButton extends AbstractGridButton {
   public static readonly BTN_LINK_CLASS: string   = 'btnLinkClass';

   constructor() {
      super({
               buttonClass:   GridLinkButton.BTN_LINK_CLASS,
               tooltip:       'Link this record',
            });
   }
}