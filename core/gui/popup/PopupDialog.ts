import {Args_MultiSelect_PopupDialog_Abstract, Args_PopupDialog_Abstract, Args_SingleSelect_PopupDialog_Abstract, PopupDialog_Abstract} from "./PopupDialog_Abstract";


export interface Args_PopupDialog extends Args_PopupDialog_Abstract {
} // Args_PopupDialog_Abstract

export interface Args_SingleSelect_PopupDialog extends Args_SingleSelect_PopupDialog_Abstract {
}

export interface Args_MultiSelect_PopupDialog extends Args_MultiSelect_PopupDialog_Abstract {
}


export class PopupDialog extends PopupDialog_Abstract {
   protected constructor() {
      super();
   }

   static create(args: Args_PopupDialog) {
      let instance     = new PopupDialog();
      args.popupDialog = instance;

      instance.init_PopupDialog(args);
      return instance;
   } // static create

   protected init_PopupDialog(args: Args_PopupDialog) {
      super.init_PopupDialog_Abstract(args);
   }
} // PopupDialog