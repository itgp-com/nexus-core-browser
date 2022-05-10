import {DialogModel}                                                                                                                             from '@syncfusion/ej2-popups';
import {ColumnModel, Grid, GridModel, PredicateModel, QueryCellInfoEventArgs, RecordDoubleClickEventArgs, RowSelectEventArgs, SortSettingsModel} from "@syncfusion/ej2-grids";
import {DataManager, DataResult, Query}                                                                                                          from "@syncfusion/ej2-data";
import {Args_WgtPopupDialog_Content, WgtPopupDialog_Content}                                                                                     from "./WgtPopupDialog_Content";
import {WgtPopupDialog_Grid}                                                                                                                     from "./WgtPopupDialog_Grid";
import {ClassArg, classArgArrayVal, StringArg, stringArgVal}                                                                                     from "../../CoreUtils";
import {btnLinkGridColumnModel, btnLinkInstantiate}                                                                                              from "../buttons/ButtonUtils";
import {AbstractWidget}                                                                                                                          from "../AbstractWidget";
import {AbstractDialogWindow, Args_AbstractDialogWindow}                                                                                         from "../../ej2/AbstractDialogWindow";
import {DialogWindow}                                                                                                                            from "../../ej2/DialogWindow";


export interface Args_PopupDialog_Abstract {
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
   dataBound?: (args?: Object | undefined) => void;
   ej?: GridModel;

   /**
    * Widget to display above the grid in the popup
    */
   topPanel?: AbstractWidget;

   onClose?(instance: PopupDialog_Abstract): void;

   width?: string | number | undefined;  // popup width
   popupDialog?: PopupDialog_Abstract;
   popupTitle?: StringArg;
   /**
    * Disable autosizing the columns of the Popup Dialog Grid
    */
   disableAutosize?: boolean;
   autosizeColumnNames?: string[];

   pagingDisabled?: boolean;

   multiSelect?: boolean;
   multiSelectSettings?: Args_MultiSelect_PopupDialog_Abstract
   singleSelectSettings?: Args_SingleSelect_PopupDialog_Abstract

} // Args_PopupDialog

export interface Args_SingleSelect_PopupDialog_Abstract {
   hideLinkButton?: boolean;
   showOkCancelPanel?: boolean;
   disableRowDblClick?: boolean;
}

export interface Args_MultiSelect_PopupDialog_Abstract {
}


export abstract class PopupDialog_Abstract {

   protected _dialogObj: AbstractDialogWindow;
   protected _args: Args_PopupDialog_Abstract;
   protected _selectedIndex: number | number[]
   protected _selectedData: any | any[];
   protected _hasData: boolean = false;

   protected _contentWidget: WgtPopupDialog_Content;


   protected constructor() {
   }

   // static create(args: Args_PopupDialog) {
   //    let instance     = new PopupDialog_Abstract();
   //    args.popupDialog = instance;
   //
   //    instance.init_PopupDialog(args);
   //    return instance;
   // } // static create

   protected init_PopupDialog_Abstract(args: Args_PopupDialog_Abstract) {

      let thisX   = this;
      thisX._args = args;

      // if default has databound, execute that after the args databound
      let userDataBound = args.dataBound;
      args.dataBound    = (arg) => {

         if (args?.ej?.dataBound) {
            try {
               args.ej.dataBound(arg); // execute default dataBound
            } catch (e) {
               console.error(e);
            }
         }

         if (userDataBound != null)
            userDataBound(arg);

         if (args.disableAutosize) {
            // do nothing - autosize disabled
         } else {
            if (args.autosizeColumnNames) {
               thisX?.ej2Grid?.autoFitColumns(args.autosizeColumnNames);
            } else {
               thisX?.ej2Grid?.autoFitColumns();
            }
         }
      }

      thisX.validateLocalData(thisX); // set the original data values based on the hasData flag
   }

   async show() {
      await this.createDialog();
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

      if (this.args.ej == null)
         this.args.ej = {};

      let hideLinkButton: boolean = false;
      let checkboxButton: boolean = false;

      if (this.args.multiSelect) {
         hideLinkButton      = true;
         checkboxButton      = true;
         thisX.selectedIndex = []
         if (this.args.ej.selectionSettings == null)
            this.args.ej.selectionSettings = {}

      } else {
         thisX.selectedIndex = -1;
         hideLinkButton      = this.args?.singleSelectSettings?.hideLinkButton;
      }

      if (!hideLinkButton) {
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


      if (checkboxButton) {
         let columns: ColumnModel[];
         let argcolumns: ColumnModel[] = classArgArrayVal(this.args.columns);
         columns                       = [{type: 'checkbox', width: 50}, ...argcolumns];
         this.args.columns             = columns;
      }

      return WgtPopupDialog_Grid.create(this.args);
   } // createWgtPopupDialog_Grid

   createContentWidget() {
      let args: Args_WgtPopupDialog_Content = {
         topPanel:           this?.args?.topPanel,
         wgtPopupDialogGrid: this.createWgtPopupDialog_Grid(),
         popupDialog:        this,
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
         open:              async (e: any) => {
            e.preventFocus = true; // preventing focus ( Uncaught TypeError: Cannot read property 'matrix' of undefined in Dialog:  https://www.syncfusion.com/support/directtrac/incidents/255376 )
            await thisX.dialogOpen(e, thisX)
         },
         close:             async (args) => {
            await thisX.dialogClose(args, thisX)
         },

      };
      return dialogModel;
   }

   createDialogWindowModel(): Args_AbstractDialogWindow {
      let thisX = this;
      thisX.createContentWidget();


      let header = stringArgVal(this?.args?.popupTitle);
      if (header == null)
         header = 'Please select:';


      let dialogModel: Args_AbstractDialogWindow = {
         dialogTagId:       thisX.args.dialogTagId,
         content:           this.contentWidget,
         header:            header,
         width:             this.args.width,
         isModal:           true,
         animationSettings: {effect: "FadeZoom"},
         showCloseIcon:     true,
         closeOnEscape:     true,
         enableResize:      true,
         allowDragging:     true,
         visible:           false,

         onAfterClose: async (instance) => {
            thisX.validateLocalData(thisX);

            if (thisX.args.onClose)
               thisX.args.onClose(thisX);
         },

      };
      return dialogModel;

   }


   async createDialog() {
      let thisX        = this;
      let dialogModel  = this.createDialogWindowModel();
      thisX._dialogObj = await DialogWindow.create(dialogModel);

   }// createDialog

   //
   // async createDialog() {
   //    let thisX        = this;
   //    let dialogModel  = this.createDialogModel();
   //    thisX._dialogObj = new Dialog(dialogModel);
   //
   //
   //    thisX._dialogObj.appendTo(hget(thisX._args.dialogTagId));
   //
   //    thisX.createContentWidget();
   //
   //    let x: string;
   //    try {
   //       x = await this.contentWidget.initContent();
   //    } catch (ex) {
   //       console.log(ex);
   //       x = 'Exception occurred while creating the content of the popup. See console for stacktrace.<p>' + ex.toString();
   //    }
   //    thisX._dialogObj.content = x;
   //
   //    let header = stringArgVal(this?.args?.popupTitle);
   //    if (header == null)
   //       header = 'Please select:';
   //
   //    thisX._dialogObj.header = header;
   //
   // }// createDialog

   gridRowSelected(e: RowSelectEventArgs) {
      if (this.args.multiSelect) {
         // multiselect
         this.selectedIndex = this?.wgtPopupDialog_Grid?.obj?.getSelectedRowIndexes();
         this.selectedData  = this?.wgtPopupDialog_Grid?.obj?.getSelectedRecords();
      } else {
         // single select
         this.selectedIndex = e.rowIndex;
         this.selectedData  = e.data;
      }
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
   async dialogOpen(args: any, thisX: PopupDialog_Abstract) {
      try {
         await thisX.contentWidget.initLogic();
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
   async dialogClose(args: any, thisX: PopupDialog_Abstract) {

      if (thisX.contentWidget)
         await thisX.contentWidget.destroy();

      // if (thisX.dialogObj)
      //    await thisX.dialogObj.destroy();

      //      document.querySelectorAll('.e-dlg-container').forEach( (elem) => elem.remove());

      thisX.validateLocalData(thisX);

      if (thisX.args.onClose)
         thisX.args.onClose(thisX);
   }

   /**
    * Clears the return data if the popup is not supposed to return anything (ex: Cancel, or X on the form button pressed)
    * @param thisX
    */
   validateLocalData(thisX: PopupDialog_Abstract) {
      if (!this._hasData) {
         thisX._selectedIndex = -1;
         thisX._selectedData  = null;
      }
   }

   //------------------------ get/set ----------------


   get dialogObj(): AbstractDialogWindow {
      return this._dialogObj;
   }

   set dialogObj(value: AbstractDialogWindow) {
      this._dialogObj = value;
   }

   get args(): Args_PopupDialog_Abstract {
      return this._args;
   }

   set args(value: Args_PopupDialog_Abstract) {
      this._args = value;
   }

   get selectedIndex(): number | number[] {
      return this._selectedIndex;
   }

   set selectedIndex(value: number | number[]) {
      this._selectedIndex = value;
   }

   get selectedData(): any | any[] {
      return this._selectedData;
   }

   set selectedData(value: any | any[]) {
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
   get wgtPopupDialog_Grid(): WgtPopupDialog_Grid {
      return this.contentWidget?.args?.wgtPopupDialogGrid;
   }

   get ej2Grid(): Grid {
      return this.wgtPopupDialog_Grid?.obj;
   }

   /**
    * Get the current filters used in the popup.
    *
    * Hint: know if data has been selected or not by checking the selectedData property of the popup
    */
   currentFilterColumns(): PredicateModel[] {
      let popup_filter_predicate_array: PredicateModel[] = null;

      let ejGrid             = this.wgtPopupDialog_Grid.obj;
      let filterPredicateMap = (ejGrid.filterModule as any).actualPredicate;
      if (filterPredicateMap) {
         let filterArray: PredicateModel[] = [];
         let keys                          = Object.keys(filterPredicateMap);
         keys.map(colName => {
            let colArray: PredicateModel[] = filterPredicateMap[colName];
            if (colArray) {
               filterArray.push(...colArray);
            }
         });
         popup_filter_predicate_array = filterArray;
      }
      return popup_filter_predicate_array;
   }
}