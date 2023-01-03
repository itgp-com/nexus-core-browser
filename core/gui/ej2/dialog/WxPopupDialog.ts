// noinspection JSUnusedGlobalSymbols

import {Args_MultiSelect_PopupDialog_Abstract, Args_PopupDialog_Abstract, Args_SingleSelect_PopupDialog_Abstract, PopupDialog_Abstract, WgtPopupDialog_Grid} from "../abstract/PopupDialog_Abstract";
import {enableExcelToolbarEvent, excelToolbarInGridModel}                                                                                                    from "../../ej2/utils/GridUtils";
import dateFormat                                                                                                                                            from "dateformat";
import {now}                                                                                                                                                 from "lodash";
import {WxDialogWindow}                                                                                                                                      from "../../ej2/dialog/WxDialogWindow";

export interface Args_WxPopupDialog extends Args_PopupDialog_Abstract {
   /**
    * Defaults to true for backward compatibility reasons
    */
   disableExcelExport?: boolean;
   /**
    * Defaults to <code>'export_' + dateFormat(now(), DATETIME_FORMAT)</code>
    */
   excel_spreadsheet_name?: string;
   /**
    * Defaults to excel_spreadsheet_name
    */
   excel_window_title?: string;
} // Args_WxPopupDialog_Orca01

export interface Args_SingleSelect_WxPopupDialog_Orca01 extends Args_SingleSelect_PopupDialog_Abstract {
}

export interface Args_MultiSelect_WxPopupDialog_Orca01 extends Args_MultiSelect_PopupDialog_Abstract {
}


export class WxPopupDialog extends PopupDialog_Abstract {
   static readonly CLASS_NAME:string = 'WxPopupDialog';

   protected constructor() {
      super();
   }

   static async create(args: Args_WxPopupDialog):Promise<WxPopupDialog> {
      let instance     = new WxPopupDialog();
      args.popupDialog = instance;

      instance._initialize(args);
      return instance;
   } // static create

   protected _initialize(args: Args_WxPopupDialog) {
      if (args?.disableExcelExport == null)
         args.disableExcelExport = true; // default to true if not specifically initialized


      super.init_PopupDialog_Abstract(args);
   }

   async createWgtPopupDialog_Grid(): Promise<WgtPopupDialog_Grid> {
      let thisX = this;

      if (this.args.ej == null)
         this.args.ej = {};

      //Enable or disable Excel toolbar in model
      excelToolbarInGridModel((this.args as Args_WxPopupDialog).disableExcelExport, this.args.ej);

      return await super.createWgtPopupDialog_Grid();
   }

   async dialogOpen(args: any, thisX: PopupDialog_Abstract) {
      await super.dialogOpen(args, thisX);

      let localArgs = thisX.args as Args_WxPopupDialog
      if (!localArgs.disableExcelExport) {
         // if export button enabled

         let spreadsheet_name: string = localArgs.excel_spreadsheet_name;
         if (!spreadsheet_name)
            spreadsheet_name = 'export_' + dateFormat(now(), 'yyyy-mm-dd hh-MM-ss tt');

         let window_name: string = localArgs.excel_window_title;
         if (!window_name)
            window_name = spreadsheet_name;

         let wgtGrid = await thisX.wgtPopupDialog_Grid;
         enableExcelToolbarEvent({
                                    grid:             wgtGrid,
                                    spreadsheet_name: spreadsheet_name,
                                    window_title:     window_name,
                                 });
      } //  if (!args.disableExcelExport)
   } // createDialog

   async createDialog() {
      let thisX        = this;
      let args  = await this.createDialogWindowModel();
      args.cssClass =  `${WxPopupDialog.CLASS_NAME}`;
      thisX._dialogObj = await WxDialogWindow.create(args);

   }// createDialog

} // WxPopupDialog