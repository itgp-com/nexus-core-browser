// noinspection JSUnusedAssignment

import {AnyScreen, Args_AnyScreen}      from "../AnyScreen";
import {AbstractWidget, addWidgetClass} from "../AbstractWidget";
import {CoreOnly_ColumnFlex}            from "./CoreOnly_ColumnFlex";
import {CoreOnly_RowFlex}               from "./CoreOnly_RowFlex";
import {CoreOnly__VerticalSpacer}       from "./CoreOnly__VerticalSpacer";
import {CoreOnly_Button_Primary}        from "./CoreOnly_Button_Primary";

export class Args_CoreOnly_PopupDialogContent extends Args_AnyScreen {
   topPanel?: AbstractWidget;
   /**
    * WgtPopupDialog_Grid
    */
   wgtPopupDialogGrid: any;
   /**
    * PopupDialog_Abstract
    */
   popupDialog: any;
}

/**
 * This class is for the EXCLUSIVE use of other core components.
 *
 * *** Do not use in application development as it can and will be modified without notice ***
 *
 */

export class CoreOnly_PopupDialogContent extends AnyScreen {

   constructor() {
      super();
   }

   static async create(args: Args_CoreOnly_PopupDialogContent): Promise<CoreOnly_PopupDialogContent> {
      let instance = new CoreOnly_PopupDialogContent();
      await instance.initialize_WgtPopupDialog_Content(args);
      return instance;
   }


   async initialize_WgtPopupDialog_Content(args: Args_CoreOnly_PopupDialogContent) {
      let thisX = this;

      let popupArgs                  = args?.popupDialog.args;
      let showOkCancelPanel: boolean = false;
      if (popupArgs.multiSelect) {
         showOkCancelPanel = true;
      } else {
         showOkCancelPanel = popupArgs?.singleSelectSettings?.showOkCancelPanel;
      }

      args.children = [];
      if (args.topPanel)
         args.children.push(args.topPanel);

      addWidgetClass(args, ' flex-component-max flex-full-height');

      args.children.push(
         await CoreOnly__VerticalSpacer.create(),
         await CoreOnly_RowFlex.create({
                                          htmlTagClass: ' flex-component-max flex-full-height',
                                          htmlTagStyle: {'margin-left': '2px !important', 'margin-right': '2px !important'}, // default for bootstrap is -15px for both
                                          children:
                                                        (showOkCancelPanel ? [
                                                              await CoreOnly_ColumnFlex.create({
                                                                                                  htmlTagClass: 'col-10 col-sm-11',
                                                                                                  children:     [
                                                                                                     args.wgtPopupDialogGrid
                                                                                                  ]
                                                                                               }),
                                                              await CoreOnly_ColumnFlex.create({
                                                                                                  htmlTagClass: 'col-2 col-sm-1',
                                                                                                  children:     [
                                                                                                     await CoreOnly_Button_Primary.create({
                                                                                                                                             label: 'Ok', onClick: (_ex) => {
                                                                                                           (thisX.initArgs as Args_CoreOnly_PopupDialogContent).popupDialog.closeWithSelectedData();
                                                                                                        }
                                                                                                                                          }),
                                                                                                     await CoreOnly__VerticalSpacer.create(),
                                                                                                     await CoreOnly_Button_Primary.create({
                                                                                                                                             label: 'Cancel', onClick: (_ex) => {
                                                                                                           (thisX.initArgs as Args_CoreOnly_PopupDialogContent).popupDialog.hide();
                                                                                                        }
                                                                                                                                          })
                                                                                                  ]
                                                                                               }),
                                                           ]
                                                           : [args.wgtPopupDialogGrid]),

                                       })
      );



      await super.initialize_AnyScreen(args);
   } // initialize


} // WgtPopupDialog_Content