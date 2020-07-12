import {Dialog, DialogModel}          from "@syncfusion/ej2-popups";
import {ej2_icon_close2, ej2_icon_ok} from "../../core/index";
import {voidFunction}                 from "../CoreUtils";

export interface DialogYesNoModel {
   element: HTMLElement;
   header?: string;
   content?: string;
   yes ?: voidFunction,
   no ?: voidFunction,

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
      // thisX.

      thisX._dialogModel = {
         header:            'Please confirm',
         content:           "Are you sure?",
         isModal:           true,
         showCloseIcon:     true,
         buttons:           [{
            buttonModel: {
               isPrimary: true,
               content:   'Yes',
               iconCss:   `e-icons ${ej2_icon_ok}`
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
               iconCss: `e-icons ${ej2_icon_close2}`
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
         height:            'auto',
         width:             '300px',
         animationSettings: {effect: 'Zoom'},
         closeOnEscape:     true,
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