import {IArgs_HtmlTag_Utils}                                           from "../Args_AnyWidget";
import {Args_WgtPanel_RowLeftCenterRight, WgtPanel_RowLeftCenterRight} from "./WgtPanel_RowLeftCenterRight";
import {AbstractWidget}                                                from "../AbstractWidget";
import {Args_WgtPanel_Generic, WgtPanel_Generic}                       from "./WgtPanel_Generic";

export class Args_WgtPanel_TopBar extends IArgs_HtmlTag_Utils {
   htmlTagClass ?: string;
   htmlTagStyle ?: string;
   htmlTagType ?: string;

   preBarChildren?: AbstractWidget[];
   barArgs ?: Args_WgtPanel_RowLeftCenterRight;
   postBarChildren ?: AbstractWidget[];

}

export class WgtPanel_TopBar extends WgtPanel_Generic {

   args_WgtPanel_TopBar: Args_WgtPanel_TopBar;

   protected constructor() {
      super();
   }

   static create_WgtPanel_TopBar(args: Args_WgtPanel_TopBar):WgtPanel_TopBar {
         let instance = new WgtPanel_TopBar();
         instance.initialize_WgtPanel_TopBar(args);
         return instance;
   }

   initialize_WgtPanel_TopBar(args: Args_WgtPanel_TopBar) {
      this.args_WgtPanel_TopBar = args;


      let barArgs = args.barArgs || {};
      args.preBarChildren = args.preBarChildren || [];
      args.postBarChildren = args.postBarChildren || [];

      let bar: WgtPanel_RowLeftCenterRight = WgtPanel_RowLeftCenterRight.create_WgtPanel_RowLeftCenterRight(args.barArgs);

      let panelArgs: Args_WgtPanel_Generic = {
         htmlTagClass: args.htmlTagClass,
         htmlTagStyle: args.htmlTagStyle,
         htmlTagType : args.htmlTagType,
         children : [
            ...args.preBarChildren,
            bar,
            ...args.postBarChildren,
         ]
      };
      this.initialize_WgtPanel_Generic(panelArgs);
   }


}