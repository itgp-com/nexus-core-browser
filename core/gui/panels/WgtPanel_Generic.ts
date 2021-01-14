import {AnyWidget}                                                           from "../AnyWidget";
import {Args_AnyWidget, IArgs_HtmlTag, IArgs_HtmlTag_Utils, IKeyValueString} from "../Args_AnyWidget";
import {AbstractWidget}                                                      from "../AbstractWidget";



export class Args_WgtPanel_Generic implements IArgs_HtmlTag {
   htmlTagClass ?: string;
   htmlTagStyle ?: string;
   htmlTagType ?: string;
   htmlOtherAttr ?: IKeyValueString;
   title ?: string           = 'n/a';

   children ?: AbstractWidget[];
}

export class WgtPanel_Generic extends AnyWidget {

   args: Args_WgtPanel_Generic;

   protected constructor() {
      super();
   }

   static create(args?: (Args_WgtPanel_Generic)) {
      let t = new WgtPanel_Generic();
      t.initialize_WgtPanel_Generic(args);
      return t;
   }

   initialize_WgtPanel_Generic(args: Args_WgtPanel_Generic) {
      args      = args || {};
      args      = <Args_WgtPanel_Generic>IArgs_HtmlTag_Utils.init(args);
      this.args = args;

      let anyArgs: Args_AnyWidget = {
         children: args.children,
         title: args.title,
      };
      this.initialize_AnyWidget(anyArgs);
   }

   async localContentBegin(): Promise<string> {
      return `<${this.args.htmlTagType} id="${this.tagId}"${IArgs_HtmlTag_Utils.class(this.args)}${IArgs_HtmlTag_Utils.style(this.args)}>`;

   }

   async localContentEnd(): Promise<string> {
      return `</${this.args.htmlTagType}>`; //<!-- id="${this.tagID}" -->
   }

}