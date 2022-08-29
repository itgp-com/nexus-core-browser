import {Dialog, DialogModel}           from "@syncfusion/ej2-popups";
import {ClassArg, classArgInstanceVal} from "../../BaseUtils";
import {ej2_icon_ok}                   from "../../CoreCSS";

export interface DialogInfoModel {
   element: ClassArg<HTMLElement>;
   header?: string;
   content: string;
   width?: string;
   height?: string;
   onClose ?: ()=>void;

} // DialogInfoModel

export class DialogInfo {
   private _options: DialogInfoModel;
   private _dialogObj: Dialog;
   private _dialogModel: DialogModel;


   constructor(options: DialogInfoModel) {
      let thisX     = this;
      thisX.options = options;
      // thisX.

      thisX._dialogModel = {
         content:       options.content,
         showCloseIcon: (options.header ? true : false),

         buttons:           [{
            buttonModel: {
               isPrimary: true,
               content:   'Ok',
               iconCss:   `e-icons ${ej2_icon_ok}`
            }, click:    () => {
               thisX.dialogObj.close();
               setTimeout(() => {
               }, 50);
            },
         }],
         target:            document.body,
         height:            (options.height ? options.height : 'auto'),
         width:             (options.width ? options.width : 'auto'),
         animationSettings: {effect: 'Zoom'},
         closeOnEscape:     true,
         enableResize: true,
         allowDragging: true,
         close:             () => {
            thisX.dialogObj.destroy();

            if (options.onClose != null){
               try {
                  options.onClose();
               } catch (ex){
                  console.log(ex);
               }
            }
         }
      } as DialogModel;

      if (options) {
         if (options.header)
            thisX.dialogModel.header = options.header;

         if (options.content)
            thisX.dialogModel.content = options.content;
      }

      thisX.initModel(thisX, thisX.dialogModel); // last minute changes not in options
   }

   initModel(thisX: DialogInfo, model: DialogModel) {
   }

   call(): void {
      let thisX = this;

      let htmlAnchor:HTMLElement = classArgInstanceVal(this.options.element)
      // this is correct here
      this.dialogObj = new Dialog(this.dialogModel);
      this.dialogObj.appendTo(htmlAnchor);

      setTimeout(() => {
            document.onclick = (evt: MouseEvent): void => {
               if (evt.target instanceof Element) {
                  if (!htmlAnchor.contains(evt.target)) {
                     thisX.dialogObj.hide();
                  }
               }
            };
      }, 300);
   }


   get options(): DialogInfoModel {
      return this._options;
   }

   set options(value: DialogInfoModel) {
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

   set dialogModel(value: DialogModel) {
      this._dialogModel = value;
   }


} // DialogInfo