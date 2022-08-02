import {AnyWidget, Args_AnyWidget} from "../AnyWidget";
import {StringArg, stringArgVal}          from "../../BaseUtils";
import {addCssClass, Args_AbstractWidget} from "../AbstractWidget";


export class Args_WgtPanel_Row_Bootstrap extends Args_AnyWidget {
   style ?: StringArg;
}

export class WgtPanel_Row_Bootstrap extends AnyWidget {
   args: Args_WgtPanel_Row_Bootstrap;

   constructor(args ?: Args_WgtPanel_Row_Bootstrap) {
      super();
      this.args = args;

      // let descriptor: Args_AnyWidget = {
      //    id:               'WgtPanel_Row_Bootstrap',
      //    children:         args.children,
      // }; // AnyWidgetDescriptor

      this.initialize_AnyWidget(args);
   }


   static create(args: Args_WgtPanel_Row_Bootstrap): WgtPanel_Row_Bootstrap {
      return new WgtPanel_Row_Bootstrap(args);
   }

   async localContentBegin(): Promise<string> {
      let args  = this.args;
      let style = '';
      Args_AnyWidget.initialize(this.args, this);
      if (this.args.cssClasses.indexOf('row') < 0)
         addCssClass(this.args, 'row');


      if (args && args.style)
         style = ` style="${stringArgVal(args.style)}"`;


      let classString = Args_AbstractWidget.combineAllWidgetClassesAsString(this.args, true);
      return `<div id="${this.tagId}" ${classString}${style}>`; // NEVER use <div />
   }

   async localContentEnd(): Promise<string> {
      return `</div>`;
   }
}