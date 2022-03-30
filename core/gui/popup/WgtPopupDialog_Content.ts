import {AnyScreen, Args_AnyScreen} from "../AnyScreen";
import {AbstractWidget}            from "../AbstractWidget";
import {WgtPanel_Row_Bootstrap}    from "../panels/WgtPanel_Row_Bootstrap";
import {WgtPopupDialog_Grid}       from "./WgtPopupDialog_Grid";
import {WgtPanel_ColumnFlex}       from "../panels/WgtPanel_ColumnFlex";
import {WgtButton_Primary}         from "../buttons/WgtButton_Primary";
import {PopupDialog}               from "./PopupDialog";
import {WgtPanel_SpacerVertical}   from "../panels/WgtPanel_SpacerVertical";

export class Args_WgtPopupDialog_Content {
   topPanel?: AbstractWidget;
   wgtPopupDialogGrid: WgtPopupDialog_Grid;
   popupDialog: PopupDialog;
}

export class WgtPopupDialog_Content extends AnyScreen {
   args: Args_WgtPopupDialog_Content;

   constructor() {
      super();
   }

   static create(args: Args_WgtPopupDialog_Content): WgtPopupDialog_Content {
      let instance = new WgtPopupDialog_Content();
      instance.initialize_WgtPopupDialog_Content(args);
      return instance;
   }


   initialize_WgtPopupDialog_Content(args: Args_WgtPopupDialog_Content) {
      let thisX                      = this;
      this.args                      = args;

      let popupArgs = args?.popupDialog.args;
      let showOkCancelPanel:boolean = false;
      if (popupArgs.multiSelect){
         showOkCancelPanel = true;
      } else {
         showOkCancelPanel = popupArgs?.singleSelectSettings?.showOkCancelPanel;
      }

      let children: AbstractWidget[] = [];

      if (args.topPanel) {
         children.push(
            WgtPanel_Row_Bootstrap.create({
                                             children: [args.topPanel]
                                          })
         );
      }

      children.push(
         WgtPanel_SpacerVertical.create(),
         WgtPanel_Row_Bootstrap.create({
                                          style: 'margin-left:2px !important;margin-right:2px !important;', // default for bootstrap is -15px for both
                                          children:
                                             (showOkCancelPanel ? [
                                                   WgtPanel_ColumnFlex.create({
                                                                                 suffixClasses: 'col-10 col-sm-11',
                                                                                 children:      [
                                                                                    args.wgtPopupDialogGrid
                                                                                 ]
                                                                              }),
                                                   WgtPanel_ColumnFlex.create({
                                                                                 suffixClasses: 'col-2 col-sm-1',
                                                                                 children:      [
                                                                                    WgtButton_Primary.create({
                                                                                                                label: 'Ok', onClick: (ex) => {
                                                                                          thisX.args.popupDialog.closeWithSelectedData();
                                                                                       }
                                                                                                             }),
                                                                                    WgtPanel_SpacerVertical.create(),
                                                                                    WgtButton_Primary.create({
                                                                                                                label: 'Cancel', onClick: (ex) => {
                                                                                          thisX.args.popupDialog.hide();
                                                                                       }
                                                                                                             })
                                                                                 ]
                                                                              }),
                                                ]
                                                : [args.wgtPopupDialogGrid]),

                                       })
      );


      let anyScreenArgs: Args_AnyScreen = {
         children: children,
      };

      super.initialize_AnyScreen(anyScreenArgs);
   } // initialize


} // WgtPopupDialog_Content