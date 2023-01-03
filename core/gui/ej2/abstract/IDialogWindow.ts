import {BeforeCloseEventArgs, BeforeOpenEventArgs} from "@syncfusion/ej2-popups";

export interface IDialogWindow {
   dialogContentTagId: string;
   initArgs:any;


   show(): void;

   hide(): void;

   /**
    * Event triggers when the dialog is being opened. If you cancel this event, the dialog remains closed. Set the cancel argument to true to cancel the open of a dialog.
    * @param beforeOpenEventArgs
    */
   beforeOpen(beforeOpenEventArgs: BeforeOpenEventArgs): Promise<void>;

   /**
    * Event triggers when a dialog is opened.
    * @param e
    */
   open(e: any): Promise<void>;

   /**
    * Event triggers before the dialog is closed. If you cancel this event, the dialog remains opened. Set the cancel argument to true to cancel the closure of a dialog.
    * @param beforeCloseEventArgs
    */
   beforeClose(beforeCloseEventArgs: BeforeCloseEventArgs): Promise<void>;

   /**
    * Triggers AFTER the dialog has been closed.
    */
   close(): Promise<void>;

}