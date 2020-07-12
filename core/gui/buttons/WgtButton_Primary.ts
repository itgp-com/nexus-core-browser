import {ButtonIconPosition, WgtButton, Args_WgtButton} from "./WgtButton";
import {StringArg}                                     from "../../CoreUtils";
import {Args_AnyWidget} from "../Args_AnyWidget";

export class WgtButton_Primary_Args extends Args_WgtButton{
   enterKeyEnabled ?: boolean;
}

export class WgtButton_Primary extends WgtButton {


   protected constructor() {
      super();
   }


   static create(args?: WgtButton_Primary_Args): WgtButton_Primary {
      let instance = new WgtButton_Primary();
      instance.initialize_WgtButton_Primary(args);
      return instance;
   }

   initialize_WgtButton_Primary(args: WgtButton_Primary_Args){
      this.initialize_WgtButton(args);
   }

   customizeArgs(prevArgs: WgtButton_Primary_Args): Args_WgtButton {
      // noinspection UnnecessaryLocalVariableJS
      let args: Args_WgtButton = prevArgs;
      args.ej                  = args.ej || {};
      args.ej.isPrimary        = true;
      return args;
   }



   localLogicImplementation(): void {
      super.localLogicImplementation();
      if (!(this.args as WgtButton_Primary_Args).enterKeyEnabled) {
         //Do not respond to enter Key
         this.hgetButton.onkeydown = (ev) => {
            if (ev.keyCode === 13) {
               ev.preventDefault();
            }
         };
      }
   }

}