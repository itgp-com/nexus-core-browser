import {AnyWidget}                                                           from "../AnyWidget";
import {Args_AnyWidget, IArgs_HtmlTag, IArgs_HtmlTag_Utils, IKeyValueString} from "../Args_AnyWidget";
import {AbstractWidget, Args_AbstractWidget}                                 from "../AbstractWidget";


export class Args_WgtPanel_Generic_Abstract extends Args_AnyWidget implements IArgs_HtmlTag {
   htmlTagClass ?: string;
   htmlTagStyle ?: string;
   htmlTagType ?: string;
   htmlOtherAttr ?: IKeyValueString;

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
      let classString = Args_AbstractWidget.combineAllWidgetClassesAsString(this.args, false);
      IArgs_HtmlTag_Utils.init(this.args); // htmlTagClass is not null
      if (classString) {
         if (this.args.htmlTagClass )
            this.args.htmlTagClass += ' '
         this.args.htmlTagClass += classString
      } // if classString

      return `<${this.args.htmlTagType} id="${this.tagId}"${IArgs_HtmlTag_Utils.all(this.args)}}>`;

   }

   async localContentEnd(): Promise<string> {
      return `</${this.args.htmlTagType}>`; //<!-- id="${this.tagID}" -->
   }

}