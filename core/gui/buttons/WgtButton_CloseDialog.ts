import {Args_WgtButton, WgtButton} from "./WgtButton";
import {WgtButton_Primary_Args}    from "./WgtButton_Primary";

export class Args_WgtButton_CloseDialog extends Args_WgtButton {
   notPrimaryButtonClass ?: boolean;
}

/**
 * Place this button in a DialogWindow child in order to close that DialogWindow
 */
export class WgtButton_CloseDialog extends WgtButton {
   protected constructor() {
      super();
   }

   static create(args?: Args_WgtButton_CloseDialog): WgtButton_CloseDialog {
      let instance = new WgtButton_CloseDialog();
      instance.initialize_WgtButton(args);
      return instance;
   }

   customizeArgs(args: Args_WgtButton): Args_WgtButton {
      let thisX = this;
      let args2 =  super.customizeArgs(args) as Args_WgtButton_CloseDialog;

      if ( !args2.notPrimaryButtonClass ) {
         args.ej                  = args.ej || {};
         args2.ej.isPrimary = true;
      }

      if (!args2.label)
         args2.label = 'Complete';

      args2.onClick = ex => {

         let dialog = thisX.findDialogWindowContainer();
         if (dialog)
            dialog.hide();
      };

      return args2;
   }

} // WgtButton_CloseDialog