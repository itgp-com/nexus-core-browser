import {BeforeCloseEventArgs, BeforeOpenEventArgs, Dialog, DialogModel,} from '@syncfusion/ej2-popups';
import {AbstractWidget}                                                  from "../gui/AbstractWidget";
import {getErrorHandler}                                                 from "../CoreErrorHandling";
import {ErrorHandler}                                                    from "../ErrorHandler";
import * as cu                                                           from "../CoreUtils";
import {hget}                                                            from "../CoreUtils";

export interface Args_DialogWindow {

   dialogTagId: string;
   content: AbstractWidget<any>,
   header?: string,
   width?: string | number | undefined,
   height?: string | number | undefined,
   enableResize?: boolean,

   onBeforeOpen?(instance: DialogWindow): void;

   onAfterOpen?(instance: DialogWindow): void;

   /**
    *
    * @param instance
    * return true if close should continue, false otherwise
    */
   onBeforeClose?(instance: DialogWindow): boolean;

   onAfterClose?(instance: DialogWindow): void;

}

/**
 * Generic Dialog Modal Window that takes an AbstractWidget as content
 */
export class DialogWindow {

   private _initArgs: Args_DialogWindow;
   readonly dialogContentTagId: string = cu.getRandomString('dialogContent');

   // noinspection JSUnusedLocalSymbols
   private _dialogModel: DialogModel = {
      isModal:           true,
      animationSettings: {effect: "FadeZoom"},
      showCloseIcon:     true,
      closeOnEscape:     true,
      enableResize:      true,
      allowDragging:     true,
      visible:           false,

      beforeOpen: (beforeOpenEventArgs: BeforeOpenEventArgs) => {
         if (this.initArgs) {

            try {
               if (this.initArgs.onBeforeOpen) {
                  this.initArgs.onBeforeOpen(this); // call init function
               } // if (this.initArgs.onOpen)
            } catch (ex) {
               getErrorHandler().displayExceptionToUser(ex);
            }

         } //  if (this.initArgs)
      },
      open:       (e: any) => {
         e.preventFocus = true; // preventing focus ( Uncaught TypeError: Cannot read property 'matrix' of undefined in Dialog:  https://www.syncfusion.com/support/directtrac/incidents/255376 )

         if (this.initArgs && this.initArgs.content) {
            try {
               this.initArgs.content.dialogWindowContainer = this;
               this.initArgs.content.registerInfo(hget(this.dialogContentTagId));
               this.initArgs.content.initLogic(); // execute the logic for the content

               if (this.initArgs.onAfterOpen) {
                  this.initArgs.onAfterOpen(this); // call init function
               } // if (this.initArgs.onOpen)

            } catch (ex) {
               let eh: ErrorHandler = getErrorHandler();
               eh.displayExceptionToUser(ex);
            }

         } //  if (this.initArgs)
      }, // open

      beforeClose: (beforeCloseEventArgs: BeforeCloseEventArgs) => {
         let shouldClose = true;
         try {
            if (this.initArgs) {
               if (this.initArgs.onBeforeClose) {
                  shouldClose = this.initArgs.onBeforeClose(this); // call init function
               } // if (this.initArgs.onOpen)
            } //  if ( this.initArgs)

         } catch (ex) {
            shouldClose = true; // if exception then close no matter what
            getErrorHandler().displayExceptionToUser(ex);
         }

         if (shouldClose) {
            if (this.initArgs && this.initArgs.content)
               this.initArgs.content.destroy();
         } else {
            beforeCloseEventArgs.cancel = true; // cancel the close
         } // if (shouldClose)

      }, // beforeClose
      close:       () => {
         try {

            if ( this.initArgs.content)
               this.initArgs.content.dialogWindowContainer = undefined;

            this.dialog.destroy(); // clean up after this window

            if (this.initArgs) {
               if (this.initArgs.onAfterClose) {
                  this.initArgs.onAfterClose(this); // call init function
               } // if (this.initArgs.onOpen)
            } //  if ( this.initArgs)

         } catch (ex) {
            getErrorHandler().displayExceptionToUser(ex);
         }
      }, // close
   };

   private _dialog: Dialog;

//------------------------- constructor -------------------
   protected constructor() {   } // constructor


   static create(args:Args_DialogWindow){
      let instance:DialogWindow = new DialogWindow();
      instance.initialize_DialogWindow(args);
      return instance;
   }

   static createAndShow(args:Args_DialogWindow){
      let instance = DialogWindow.create(args);
      instance.show();
      return instance;
   }

   initialize_DialogWindow(args: Args_DialogWindow){
      this.initArgs = args;
      if (args) {
         this.dialogModel.width        = (args.width ? args.width : '99%');
         this.dialogModel.height       = (args.height ? args.height : '99%');
         this.dialogModel.enableResize = (args.enableResize != null ? args.enableResize : true);
      }


      this.dialog = new Dialog(this.dialogModel, cu.hget(this.initArgs.dialogTagId));

      let content: string = `
<div id="${this.dialogContentTagId}" class="flex-component-max flex-full-height"> 
      `;

      if (this.initArgs && this.initArgs.content)
         content += this.initArgs.content.initContent();

      content += `
</div>
`;
      this.dialog.content = content;

      if (this.initArgs && this.initArgs.header)
         this.dialog.header = this.initArgs.header;

   }

   show() {
      this.dialog.show()
   }

   hide() {
      this.dialog.hide();
   }


//--------------------------- set/get --------------

   get initArgs(): Args_DialogWindow {
      return this._initArgs;
   }

   set initArgs(value: Args_DialogWindow) {
      this._initArgs = value;
   }

   get dialogModel(): DialogModel {
      return this._dialogModel;
   }

   // noinspection JSUnusedGlobalSymbols
   set dialogModel(value: DialogModel) {
      this._dialogModel = value;
   }

   get dialog(): Dialog {
      return this._dialog;
   }

   set dialog(value: Dialog) {
      this._dialog = value;
   }
} // DialogWindow
