import {Dialog, DialogModel}                                                                                                                     from '@syncfusion/ej2-popups';
import {ColumnModel, Grid, GridModel, PredicateModel, QueryCellInfoEventArgs, RecordDoubleClickEventArgs, RowSelectEventArgs, SortSettingsModel} from "@syncfusion/ej2-grids";
import {DataManager, DataResult, Query}                                                                                                          from "@syncfusion/ej2-data";
import {Args_WgtPopupDialog_Content, WgtPopupDialog_Content}                                                                                     from "./WgtPopupDialog_Content";
import {WgtPopupDialog_Grid}                                                                                                                     from "./WgtPopupDialog_Grid";
import {ClassArg, classArgArrayVal, hget, StringArg, stringArgVal}                                                                               from "../../CoreUtils";
import {btnLinkGridColumnModel, btnLinkInstantiate}                                                                                              from "../buttons/ButtonUtils";


export interface Args_PopupDialog {
   dialogTagId: string; // HTML Element Anchor

   dataSource: ClassArg<Object | DataManager | DataResult>
   columns: ClassArg<ColumnModel[]>;
   query?: Query;
   /**
    * One or more column filters that will be pre-populated when the popup is created.
    * This is in addition of the query which can also be set
    */
   filters?: PredicateModel[];

   sortSettings?: ClassArg<SortSettingsModel>; // () => SortSettingsModel;
   queryCellInfo?: (args: (QueryCellInfoEventArgs | undefined)) => void;
   created?: () => void;
   dataBound?: () => void;
   ej?: GridModel;

   onClose?(instance: PopupDialog): void;

   width?: string | number | undefined;  // popup width
   disableRowDblClick?: boolean;
   popupDialog?: PopupDialog;
   popupTitle?: StringArg;
   hideLinkButton?: boolean;
   showOkCancelPanel?: boolean

} // Args_PopupDialog


export class PopupDialog {

   private _dialogObj: Dialog;
   private _args: Args_PopupDialog;
   private _selectedIndex: number = -1;
   private _selectedData: any;
   private _hasData: boolean      = false;

   private _contentWidget: WgtPopupDialog_Content;


   protected constructor() {
   }

   static create(args: Args_PopupDialog) {
      let instance     = new PopupDialog();
      args.popupDialog = instance;
      instance.init_PopupDialog(args);
      return instance;
   } // static create

   protected init_PopupDialog(args: Args_PopupDialog) {

      let thisX   = this;
      thisX._args = args;
      thisX.validateLocalData(thisX); // set the original data values based on the hasData flag
   }

   show() {
      this.createDialog();
      if (this._dialogObj)
         this._dialogObj.show();
   }

   hide() {
      if (this._dialogObj) {
         this._dialogObj.hide();
      }
   }

   createWgtPopupDialog_Grid(): WgtPopupDialog_Grid {
      let thisX = this;

      if (!this.args.hideLinkButton) {
         // if link to be shown
         let argcolumns: ColumnModel[] = classArgArrayVal(this.args.columns);
         let columns: ColumnModel[];
         if (argcolumns) {
            columns = [btnLinkGridColumnModel(), ...argcolumns];
         } else {
            columns = [btnLinkGridColumnModel()];
         }
         this.args.columns = columns;

         let argsQueryCellInfo   = this.args.queryCellInfo;
         this.args.queryCellInfo = (args) => {
            // callback
            btnLinkInstantiate(args, (argsQCI) => {
               thisX.closeWithData(argsQCI.data)
            });
            if (argsQueryCellInfo) {
               argsQueryCellInfo(args);
            } // if (argsQueryCellInfo)
         } // this.args.queryCellInfo = (args)
      }  // if ( !this.args.hideLinkButton)
      return WgtPopupDialog_Grid.create(this.args);
   } // createWgtPopupDialog_Grid

   createContentWidget() {
      let args: Args_WgtPopupDialog_Content = {
         wgtPopupDialogGrid: this.createWgtPopupDialog_Grid(),
         popupDialog:        this,
         showOkCancelPanel:  this.args.showOkCancelPanel,
      };
      this.contentWidget                    = WgtPopupDialog_Content.create(args);
   } // createDialogWidget

   createDialogModel(): DialogModel {
      let thisX = this;

      let dialogModel: DialogModel = {
         width:             this.args.width,
         isModal:           true,
         animationSettings: {effect: "FadeZoom"},
         showCloseIcon:     true,
         closeOnEscape:     true,
         enableResize:      true,
         allowDragging:     true,
         visible:           false,
         open:              (e:any) => {
            e.preventFocus = true; // preventing focus ( Uncaught TypeError: Cannot read property 'matrix' of undefined in Dialog:  https://www.syncfusion.com/support/directtrac/incidents/255376 )
            thisX.dialogOpen(e, thisX)
         },
         close:             (args) => {
            thisX.dialogClose(args, thisX)
         },

      };
      return dialogModel;
   }

   createDialog() {
      let thisX        = this;
      let dialogModel  = this.createDialogModel();
      thisX._dialogObj = new Dialog(dialogModel);


      thisX._dialogObj.appendTo(hget(thisX._args.dialogTagId));

      thisX.createContentWidget();

      let x: string;
      try {
         x = this.contentWidget.initContent();
      } catch (ex) {
         console.log(ex);
         x = 'Exception occurred while creating the content of the popup. See console for stacktrace.<p>' + ex.toString();
      }
      thisX._dialogObj.content = x;

      let header = 'Please select:' || stringArgVal(this.args.popupTitle);

      thisX._dialogObj.header = header;

   }// createDialog

   gridRowSelected(e: RowSelectEventArgs) {
      let rowIndex        = e.rowIndex;
      this._selectedIndex = rowIndex;
      this.selectedData   = e.data;
   }

   gridRowDoubleClick(e: RecordDoubleClickEventArgs) {
      this.closeWithData(e.rowData);
   }

   closeWithSelectedData() {
      this.closeWithData(this.selectedData);
   }

   closeWithData(data: any) {

      this._selectedData = data;
      this._hasData      = true;
      this._dialogObj.hide();  // close on double click
   }

   /**
    * This method executes in the context of the Dialog, so <code>this</code> actually refers to the Dialog
    * @param args
    * @param thisX
    */
   dialogOpen(args: any, thisX: PopupDialog) {
      try {
         thisX.contentWidget.initLogic();
      } catch (e) {
         console.log(e);
         thisX.contentWidget.handleError(e);
      }
   }


   /**
    * This method executes in the context of the Dialog, so <code>this</code> actually refers to the Dialog
    * @param args
    * @param thisX
    */
   dialogClose(args: any, thisX: PopupDialog) {

      if (thisX.contentWidget)
         thisX.contentWidget.destroy();

      if (thisX.dialogObj)
         thisX.dialogObj.destroy();

      //      document.querySelectorAll('.e-dlg-container').forEach( (elem) => elem.remove());

      thisX.validateLocalData(thisX);

      thisX.args.onClose(thisX);
   }

   /**
    * Clears the return data if the popup is not supposed to return anything (ex: Cancel, or X on the form button pressed)
    * @param thisX
    */
   validateLocalData(thisX: PopupDialog) {
      if (!this._hasData) {
         thisX._selectedIndex = -1;
         thisX._selectedData  = null;
      }
   }

   //------------------------ get/set ----------------


   get dialogObj(): Dialog {
      return this._dialogObj;
   }

   set dialogObj(value: Dialog) {
      this._dialogObj = value;
   }

   get args(): Args_PopupDialog {
      return this._args;
   }

   set args(value: Args_PopupDialog) {
      this._args = value;
   }

   get selectedIndex(): number {
      return this._selectedIndex;
   }

   set selectedIndex(value: number) {
      this._selectedIndex = value;
   }

   get selectedData(): any {
      return this._selectedData;
   }

   set selectedData(value: any) {
      this._selectedData = value;
   }

   get hasData(): boolean {
      return this._hasData;
   }

   set hasData(value: boolean) {
      this._hasData = value;
   }

   get contentWidget(): WgtPopupDialog_Content {
      return this._contentWidget;
   }

   set contentWidget(value: WgtPopupDialog_Content) {
      this._contentWidget = value;
   }

   /**
    * Extends WgtGrid and contains Grid as obj property. See ej2Grid for actual Grid
    */
   get wgtPopupDialog_Grid():WgtPopupDialog_Grid {
      return this.contentWidget?.args?.wgtPopupDialogGrid;
   }

   get ej2Grid(): Grid {
      return this.wgtPopupDialog_Grid?.obj;
   }
}