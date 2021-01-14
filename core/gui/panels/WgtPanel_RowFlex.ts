import {AnyWidget}                                  from "../AnyWidget";
import {Args_AnyWidget, IArgs_HtmlTag_Utils}        from "../Args_AnyWidget";
import {AbstractWidget}                             from "../AbstractWidget";
import {StringArg, stringArgVal}                                            from "../../CoreUtils";
import {Args_WgtPanel, Args_WgtPanel_SpecificClass, WgtPanel_SpecificClass} from "./WgtPanel_SpecificClass";

export class Args_WgtPanel_RowFlex {
   prefixClasses ?: StringArg;
   suffixClasses ?: StringArg;
   style ?: StringArg;
   children ?: AbstractWidget[];
}

export class WgtPanel_RowFlex extends WgtPanel_SpecificClass {


   protected constructor() {
      super();
   }


   static create(args ?: Args_WgtPanel): WgtPanel_RowFlex {
      let instance = new WgtPanel_RowFlex();
      instance.initialize_WgtPanel_ColumnFlex(args);
      return instance;
   }

   initialize_WgtPanel_ColumnFlex(args: Args_WgtPanel) {
      let argsSuper: Args_WgtPanel_SpecificClass = {mandatoryClass: 'flex-container-row'};
      argsSuper =  {...argsSuper, ...args, }; // combine the properties, with args overwriting same properties defined in default args
      this.initialize_WgtPanel_SpecificClass(argsSuper);
   }




   // args: Args_WgtPanel_RowFlex;
   //
   // protected constructor(args?: Args_WgtPanel_RowFlex) {
   //    super();
   //
   //    //TODO: implement init_Widget method pattern
   //
   //    if (!args)
   //       args = new Args_WgtPanel_RowFlex();
   //    this.args = args;
   //
   //    let descriptor: Args_AnyWidget = {
   //       id:               'WgtPanel_RowFlex',
   //    }; //AnyWidgetDescriptor
   //
   //    if ( args && args.children)
   //       descriptor.children = args.children;
   //
   //
   //
   //    this.initialize_AnyWidget(descriptor);
   // }
   //
   //
   // static create(args ?: Args_WgtPanel_RowFlex): WgtPanel_RowFlex {
   //    return new WgtPanel_RowFlex(args);
   // }
   //
   // async localContentBegin(): Promise<string> {
   //    let args = this.args;
   //
   //    let prefix = '';
   //    let suffix = '';
   //    let style  = '';
   //
   //    if (args && args.prefixClasses)
   //       prefix = stringArgVal(args.prefixClasses) + ' ';
   //    if (args && args.suffixClasses)
   //       suffix = ' ' + stringArgVal(args.suffixClasses);
   //    if (args && args.style)
   //       style = ` style="${stringArgVal(args.style)}"`;
   //    return `<div class="${prefix}flex-container-row${suffix}"${style}>`;
   // }
   //
   // async localContentEnd(): Promise<string> {
   //    return `</div>`;
   // }

}