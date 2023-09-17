import {Dialog, DialogModel} from "@syncfusion/ej2-popups";
import {voidFunction} from "../../../BaseUtils";

export interface DialogYesNoModel {
   element: HTMLElement;
   header?: string;
   content?: string;
   yes ?: voidFunction,
   no ?: voidFunction,
   ej ?: DialogModel,
} // DialogYesNoModel

// noinspection JSUnusedGlobalSymbols
export class DialogYesNo {
   private _options: DialogYesNoModel;
   private _dialogObj: Dialog;
   private _dialogModel: DialogModel;
   private alreadyResponded: boolean = false; // fixes a Nasty bug with dialog buttons where the button code exists forever in this application (probably using onclick) and every time you press Enter the yes/no code gets executed again even though the dialog has been destroyed


   // noinspection JSUnusedGlobalSymbols
   constructor(options: DialogYesNoModel) {
      let thisX     = this;
      thisX.options = options;
      if (thisX.options?.ej == null)
         thisX.options.ej = {};

      thisX._dialogModel = {
         header:            'Please confirm',
         content:           "Are you sure?",
         isModal:            (options.ej.isModal == null ? true: options.ej.isModal),
         showCloseIcon:      (options.ej.showCloseIcon == null ? true: options.ej.isModal),
         buttons:           [{
            buttonModel: {
               isPrimary: true,
               content:   'Yes',
               iconCss:   `e-icons`
            }, click:    () => {
               if (thisX.alreadyResponded)
                  return; // don't ever execute again
               thisX.alreadyResponded = true;
               thisX.dialogObj.close();
               setTimeout(() => {
                  // after dialog closes
                  if ( thisX.options.yes)
                     thisX.options.yes();

               }, 50);
            },
         }, {
            buttonModel: {
               content: 'No',
               iconCss: `e-icons`
            }, click:    () => {
               if (thisX.alreadyResponded)
                  return; // don't ever execute again
               thisX.alreadyResponded = true;
               thisX.dialogObj.close();
               setTimeout(() => {
                             // after dialog closes
                              if ( thisX.options.no)
                                 thisX.options.no();
                          },
                          50);
            }
         }],
         target:            document.body,
         height:            (options.ej.height ? options.ej.height : 'auto'),
         width:             (options.ej.width ? options.ej.width : '300px'),
         animationSettings: (options.ej.animationSettings ? options.ej.animationSettings :{effect: 'Zoom'}),
         closeOnEscape:     (options.ej.closeOnEscape ? options.ej.closeOnEscape :true),
         close:             () => {
            thisX.dialogObj.destroy();
         }
      } as DialogModel;

      if (options) {
         if (options.header)
            thisX.dialogModel.header = options.header;

         if (options.content)
            thisX.dialogModel.content = options.content;
      }

      thisX.initModel(thisX.dialogModel); // last minute changes not in options
   }

   // noinspection JSUnusedLocalSymbols
   initModel(model: DialogModel) {
   }

   // noinspection JSUnusedGlobalSymbols
   call(): void {
      // this is correct here
      this.dialogObj = new Dialog(this.dialogModel);
      this.dialogObj.appendTo(this.options.element);
   }


   get options(): DialogYesNoModel {
      return this._options;
   }

   set options(value: DialogYesNoModel) {
      this._options = value;
   }

   get dialogObj(): Dialog {
      return this._dialogObj;
   }

   set dialogObj(value: Dialog) {
      this._dialogObj = value;
   }

   get dialogModel(): DialogModel {
      return this._dialogModel;
   }

   // noinspection JSUnusedGlobalSymbols
   set dialogModel(value: DialogModel) {
      this._dialogModel = value;
   }


} // DialogYesNo