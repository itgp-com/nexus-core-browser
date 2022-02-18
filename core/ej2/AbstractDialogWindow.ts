import {getRandomString, hget}                                          from "../CoreUtils";
import {AbstractWidget}                                                 from "../gui/AbstractWidget";
import {BeforeCloseEventArgs, BeforeOpenEventArgs, Dialog, DialogModel} from "@syncfusion/ej2-popups";
import {getErrorHandler}                                                from "../CoreErrorHandling";
import {ErrorHandler}                                                   from "../ErrorHandler";


export abstract class Args_AbstractDialogWindow {

   dialogTagId ?: string;
   content: AbstractWidget<any> | Promise<AbstractWidget<any>>;
   header?: string | Promise<string>;
   width?: string | number | undefined;
   height?: string | number | undefined;
   enableResize?: boolean;
   htmlClassesPrefix ?: string;
   htmlClass ?: string;
   htmlClassesSuffix?: string;
   htmlStyle?: string;

   onBeforeOpen?(instance: AbstractDialogWindow): void;

   onAfterOpen?(instance: AbstractDialogWindow): void;

   /**
    *
    * @param instance
    * return true if close should continue, false otherwise
    */
   onBeforeClose?(instance: AbstractDialogWindow): boolean | Promise<boolean>;

   onAfterClose?(instance: AbstractDialogWindow): void;
}

export class DialogWindowOpenEvent {
   instance: AbstractDialogWindow;
}

export class AbstractDialogWindow {

   private _initArgs: Args_AbstractDialogWindow;
   readonly dialogContentTagId: string = getRandomString('dialogContent');
   protected resolvedContent: AbstractWidget<any>;
   protected localAnchorID: string;

   // noinspection JSUnusedLocalSymbols
   private _dialogModel: DialogModel;

   private _dialog: Dialog;
   private _beforeCloseHideCalled: boolean = false;


   async initialize_AbstractDialogWindow(args: Args_AbstractDialogWindow) {
      this.initArgs = args;

      // initialize class and style
      if (args.htmlClassesPrefix == null)
         args.htmlClassesPrefix = "";
      if (!args.htmlClass)
         args.htmlClass = "flex-component-max flex-full-height";
      if (!args.htmlClassesSuffix)
         args.htmlClassesSuffix = "";
      if (!args.htmlStyle)
         args.htmlStyle = "";

      this.dialogModel = await this.initialize_DialogModel();

      if (args) {
         this.dialogModel.width        = (args.width ? args.width : '99%');
         this.dialogModel.height       = (args.height ? args.height : '99%');
         this.dialogModel.enableResize = (args.enableResize != null ? args.enableResize : true);

         this.resolvedContent = await args.content;
      }

      let targetElem: HTMLElement;
      if (this.initArgs.dialogTagId)
         targetElem = hget(this.initArgs.dialogTagId)
      else {
         this.localAnchorID = getRandomString('anchor_');
         let elem           = document.createElement('div')
         elem.id            = this.localAnchorID
         document.body.appendChild(elem);
         targetElem = elem
      }

      this.dialog = new Dialog(this.dialogModel, targetElem);

      // Create classes for DialogWindow DIV
      let cs = ''
      if (args?.htmlClassesPrefix)
         cs += args.htmlClassesPrefix;
      if (cs.length > 0 && args?.htmlClass)
         cs += ' ';
      if (args?.htmlClass)
         cs += args.htmlClass;
      if (cs.length > 0 && args?.htmlClassesSuffix)
         cs += ' ';
      if (args?.htmlClassesSuffix)
         cs += args.htmlClassesSuffix;
      let style = '';
      if (args.htmlStyle.length > 0)
         style = `style="${args.htmlStyle}"`;


      let dialogContent: string = `
<div id="${this.dialogContentTagId}" class="${cs} ${style}"> 
      `;

      if (this.initArgs && this.resolvedContent)
         dialogContent += await this.resolvedContent.initContent();

      dialogContent += `
</div>
`;
      this.dialog.content = dialogContent;

      if (this.initArgs && this.initArgs.header)
         this.dialog.header = await this.initArgs.header;

   }

   show() {
      this.dialog.show()
   }

   hide() {
      this.dialog.hide();
   }


   async initialize_DialogModel(): Promise<DialogModel> {
      let thisX = this;
      return {
         isModal:           true,
         animationSettings: {effect: "FadeZoom"},
         showCloseIcon:     true,
         closeOnEscape:     true,
         enableResize:      true,
         allowDragging:     true,
         visible:           false,

         /*
          The calls below MUST be made using thisX.functionName(args) so that the CONTEXT of the DialogWindow is passed correctly
          Something like:
          beforeOpen:thisX.beforeOpen
          does not pass the context correctly
          */
         beforeOpen:  async (beforeOpenEventArgs: BeforeOpenEventArgs) => {
            await thisX.beforeOpen(beforeOpenEventArgs);
         },
         open:        async (e: any) => {
            await thisX.open(e);
         },
         beforeClose: (beforeCloseEventArgs: BeforeCloseEventArgs) => {
            /**
             * Transforms a synchronous method into asynchronous one by using the _beforeCloseHideCalled flag.
             *
             * First time through, _beforeCloseHideCalled = false
             * The beforeCloseEventArgs.cancel flag is set to true (don't close window) and the asynchronous function
             * thisX.beforeClose(beforeCloseEventArgs) is called.
             *
             * When that executes, if it needs to close the dialog, it will actually invoke the hide() method in the dialge
             *  but first it will set the _beforeCloseHideCalled to true so that the close is allowed to go through in this case.
             *
             */


            if (thisX._beforeCloseHideCalled) {
               beforeCloseEventArgs.cancel  = false; // allow the close since the flag is set
               thisX._beforeCloseHideCalled = false; // reset the flag
            } else {
               beforeCloseEventArgs.cancel = true; // cancel the close in synchronous mode (before async below has executed)
               thisX.beforeClose(beforeCloseEventArgs); // it's async actually, but uses the  _beforeCloseHideCalled
            }

         },
         close:       async (e: any) => {
            await thisX.close();
         },
      };
   } //initialize_DialogModel

   /**
    * Event triggers when the dialog is being opened. If you cancel this event, the dialog remains closed. Set the cancel argument to true to cancel the open of a dialog.
    * @param beforeOpenEventArgs
    */
   async beforeOpen(beforeOpenEventArgs: BeforeOpenEventArgs) {
      if (this.initArgs) {
         try {
            if (this.initArgs.onBeforeOpen) {
               this.initArgs.onBeforeOpen(this); // call init function
            } // if (this.initArgs.onOpen)
         } catch (ex) {
            getErrorHandler().displayExceptionToUser(ex);
         }

      } //  if (this.initArgs)
   } // beforeOpen

   /**
    * Event triggers when a dialog is opened.
    * @param e
    */
   async open(e: any) {
      let thisX      = this;
      e.preventFocus = true; // preventing focus ( Uncaught TypeError: Cannot read property 'matrix' of undefined in Dialog:  https://www.syncfusion.com/support/directtrac/incidents/255376 )

      if (thisX.initArgs && thisX.resolvedContent) {
         try {
            thisX.resolvedContent.dialogWindowContainer = this;
            thisX.resolvedContent.registerInfo(hget(thisX.dialogContentTagId));
            await thisX.resolvedContent.initLogic(); // execute the logic for the content

            try {
               thisX.resolvedContent.onDialogWindowOpen({instance: thisX} as DialogWindowOpenEvent);
            } catch (ex) {
               let eh: ErrorHandler = getErrorHandler();
               eh.displayExceptionToUser(ex);
            }

            if (thisX.initArgs.onAfterOpen) {
               thisX.initArgs.onAfterOpen(thisX); // call init function
            } // if (thisX.initArgs.onOpen)

         } catch (ex) {
            let eh: ErrorHandler = getErrorHandler();
            eh.displayExceptionToUser(ex);
         }

      } //  if (this.initArgs)
   } // open

   /**
    * Event triggers before the dialog is closed. If you cancel this event, the dialog remains opened. Set the cancel argument to true to cancel the closure of a dialog.
    * @param beforeCloseEventArgs
    */
   async beforeClose(beforeCloseEventArgs: BeforeCloseEventArgs) {
      let shouldClose = true;

      try {
         if (this.initArgs) {
            if (this.initArgs.onBeforeClose) {
               shouldClose = await this.initArgs.onBeforeClose(this); // call init function
            } // if (this.initArgs.onOpen)
         } //  if ( this.initArgs)

      } catch (ex) {
         shouldClose = true; // if exception then close no matter what
         getErrorHandler().displayExceptionToUser(ex);
      }

      if (shouldClose) {
         if (this.resolvedContent)
            //cannot await because this method is synchronous
            await this.resolvedContent.destroy();

         this._beforeCloseHideCalled = true; // allow dialog to actually close
         this._dialog?.hide();
         // } else {
         //    beforeCloseEventArgs.cancel = true; // cancel the close
      } // if (shouldClose)

   } // beforeClose


   /**
    * Triggers AFTER the dialog has been closed.
    */
   async close() {
      try {

         if (this.resolvedContent)
            this.resolvedContent.dialogWindowContainer = undefined;

         this.dialog.destroy(); // clean up after this window

         if (this.initArgs) {
            if (this.initArgs.onAfterClose) {
               this.initArgs.onAfterClose(this); // call init function
            } // if (this.initArgs.onOpen)
         } //  if ( this.initArgs)

      } catch (ex) {
         getErrorHandler().displayExceptionToUser(ex);
      }

      try {
         if (this.localAnchorID) {
            let anchorElem = document.getElementById(this.localAnchorID);
            if (anchorElem)
               anchorElem.parentNode.removeChild(anchorElem);
         }
      } catch (e) {
         console.log(e);
      }
   }


//--------------------------- set/get --------------

   get initArgs(): Args_AbstractDialogWindow {
      return this._initArgs;
   }


   set initArgs(value: Args_AbstractDialogWindow) {
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
}