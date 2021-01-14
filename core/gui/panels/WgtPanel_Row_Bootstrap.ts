import {AnyWidget}               from "../AnyWidget";
import {Args_AnyWidget}          from "../Args_AnyWidget";
import {AbstractWidget}          from "../AbstractWidget";
import {StringArg, stringArgVal} from "../../CoreUtils";


export class Args_WgtPanel_Row_Bootstrap {
   prefixClasses ?: StringArg;
   suffixClasses ?: StringArg;
   style ?: StringArg;
   children ?: AbstractWidget[];

}

export class WgtPanel_Row_Bootstrap extends AnyWidget {
   args: Args_WgtPanel_Row_Bootstrap;

   constructor(args ?: Args_WgtPanel_Row_Bootstrap) {
      super();
      this.args = args;

      let descriptor: Args_AnyWidget = {
         id:               'WgtPanel_Row_Bootstrap',
         children:         args.children,
      }; // AnyWidgetDescriptor

      this.initialize_AnyWidget(descriptor);
   }


   static create(args: Args_WgtPanel_Row_Bootstrap): WgtPanel_Row_Bootstrap {
      return new WgtPanel_Row_Bootstrap(args);
   }

   async localContentBegin(): Promise<string> {
      let args   = this.args;
      let prefix = '';
      let suffix = '';
      let style  = '';

      if (args && args.prefixClasses)
         prefix = stringArgVal(args.prefixClasses) + ' ';
      if (args && args.suffixClasses)
         suffix = ' ' + stringArgVal(args.suffixClasses);
      if (args && args.style)
         style = ` style="${stringArgVal(args.style)}"`;
      return `<div id="${this.tagId}" class="${prefix}row${suffix}"${style}>`;
   }

   async localContentEnd(): Promise<string> {
      return `</div>`;
   }
}