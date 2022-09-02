import {AbstractButton, Args_AbstractButton} from "../controls/AbstractButton";
import {IArgs_HtmlTag_Utils}                 from "../../BaseUtils";
import {addWidgetClass}                      from "../AbstractWidget";

export class Args_CoreOnly_AbstractButton_Primary extends Args_AbstractButton {
   enterKeyEnabled ?: boolean;
}


export abstract class CoreOnly_AbstractButton_Primary extends AbstractButton {
   protected constructor() {
      super();
   }

   async initialize_AbstractButton_Primary(args:Args_CoreOnly_AbstractButton_Primary) {
      if (!args)
         args = new Args_CoreOnly_AbstractButton_Primary();
      if (!args.ej)
         args.ej = {};
      args.ej.isPrimary = true;
      args = addWidgetClass(args, 'CoreOnly_AbstractButton_Primary');
      await super.initialize_AbstractButton(args);
   }


   customizeArgs(prevArgs: Args_CoreOnly_AbstractButton_Primary): Args_CoreOnly_AbstractButton_Primary {
      // noinspection UnnecessaryLocalVariableJS
      let args: Args_CoreOnly_AbstractButton_Primary = prevArgs;
      args                                           = IArgs_HtmlTag_Utils.init(args);
      if (!args.ej)
         args.ej = {};
      return args;
   }


   async localClearImplementation(): Promise<void> {
      await super.localLogicImplementation();
      if (!(this.initArgs as Args_CoreOnly_AbstractButton_Primary).enterKeyEnabled) {
         //Do not respond to enter Key
         this.hgetButton.onkeydown = (ev) => {
            if (ev.key === 'Enter' && !ev.ctrlKey && !ev.altKey && !ev.metaKey && !ev.shiftKey) {
               ev.preventDefault();
            }
         };
      }
   }

   // async localRefreshImplementation() {
   //    let args = this.descriptor as Args_CoreOnly_AbstractButton_Primary
   //    if (args.label)
   //       this.obj.content = stringArgVal(args.label);
   //    await super.localRefreshImplementation();
   // }

} // main