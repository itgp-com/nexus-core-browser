import {AnyWidget}                                                           from "../AnyWidget";
import {Args_AnyWidget, IArgs_HtmlTag, IArgs_HtmlTag_Utils, IKeyValueString} from "../Args_AnyWidget";
import {AbstractWidget}                                                      from "../AbstractWidget";


export class Args_WgtPanel_Generic_Abstract implements IArgs_HtmlTag {
   htmlTagClass ?: string;
   htmlTagStyle ?: string;
   htmlTagType ?: string;
   htmlOtherAttr ?: IKeyValueString;
   title ?: string           = 'n/a';

   children ?: AbstractWidget[];
}

export abstract class WgtPanel_Generic_Abstract<INIT_TYPE extends Args_WgtPanel_Generic_Abstract> extends AnyWidget {

   args: INIT_TYPE;

   protected constructor() {
      super();
   }

   initialize_WgtPanel_Generic_Abstract(args: INIT_TYPE) {

      args      = args || {} as INIT_TYPE;
      args      = <INIT_TYPE>IArgs_HtmlTag_Utils.init(args);
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