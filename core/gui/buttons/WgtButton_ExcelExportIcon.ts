import {WgtButton_Primary, WgtButton_Primary_Args} from "./WgtButton_Primary";
import {Args_WgtButton}                            from "./WgtButton";
import {ej2_icon_excel_export}                     from "../../index";


export class WgtButton_ExcelExportIcon extends WgtButton_Primary {


   protected constructor() {
      super();
   }

   static create(args?: WgtButton_Primary_Args): WgtButton_ExcelExportIcon {
      let instance = new WgtButton_ExcelExportIcon();
      instance.initialize_WgtButton_Primary(args);
      return instance;
   }

   customizeArgs(prevArgs: WgtButton_Primary_Args): Args_WgtButton {
      let args        = super.customizeArgs(prevArgs);
      args.ej         = args.ej || {}; // initialize args.ej if it does not exist
      args.ej.iconCss = ` e-icons ${ej2_icon_excel_export}`;
      return args;
   }

} // main class