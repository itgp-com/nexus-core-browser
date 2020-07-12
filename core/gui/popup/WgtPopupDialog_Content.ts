import {AnyScreen, Args_AnyScreen} from "../AnyScreen";
import {AbstractWidget}            from "../AbstractWidget";
import {WgtPanel_Row_Bootstrap}    from "../panels/WgtPanel_Row_Bootstrap";
import {WgtPopupDialog_Grid}       from "./WgtPopupDialog_Grid";
import {WgtPanel_Generic}          from "../panels/WgtPanel_Generic";
import {WgtPanel_ColumnFlex}       from "../panels/WgtPanel_ColumnFlex";
import {WgtButton_Primary}         from "../buttons/WgtButton_Primary";
import {PopupDialog}               from "./PopupDialog";
import {WgtPanel_SpacerVertical}   from "../panels/WgtPanel_SpacerVertical";

export class Args_WgtPopupDialog_Content {
   topPanel?: AbstractWidget;
   wgtPopupDialogGrid: WgtPopupDialog_Grid;
   popupDialog: PopupDialog;
   showOkCancelPanel?: boolean;
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
                                          children:
                                             (args.showOkCancelPanel ? [
                                                   WgtPanel_ColumnFlex.create({
                                                                                 suffixClasses: 'col-11 col-sm-10',
                                                                                 children:      [
                                                                                    args.wgtPopupDialogGrid
                                                                                 ]
                                                                              }),
                                                   WgtPanel_ColumnFlex.create({
                                                                                 suffixClasses: 'col-1 col-sm-2',
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