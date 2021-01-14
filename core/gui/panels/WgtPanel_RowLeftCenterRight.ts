import {AnyWidget}                                          from "../AnyWidget";
import {Args_AnyWidget, IArgs_HtmlTag, IArgs_HtmlTag_Utils} from "../Args_AnyWidget";
import {AbstractWidget}                                     from "../AbstractWidget";
import {WgtPanel_Generic}                                   from "./WgtPanel_Generic";

export class Args_WgtPanel_RowLeftCenterRight implements IArgs_HtmlTag {
   htmlTagClass ?: string;
   htmlTagStyle ?: string;
   htmlTagType ?: string;
   hideDefaultClasses ?: boolean;
   leftPanel ?: WgtPanel_Generic;
   centerPanel ?: WgtPanel_Generic;
   rightPanel ?: WgtPanel_Generic;
}

/**
 * 3 equally spaced horizontal panels
 */
export class WgtPanel_RowLeftCenterRight extends AnyWidget {
   args: Args_WgtPanel_RowLeftCenterRight;


   protected constructor() {
      super();
   }


   static create_WgtPanel_RowLeftCenterRight(args: Args_WgtPanel_RowLeftCenterRight) {
      let instance = new WgtPanel_RowLeftCenterRight();
      instance.initialize_WgtPanel_RowLeftCenterRight(args);
      return instance;
   }

   initialize_WgtPanel_RowLeftCenterRight(args: Args_WgtPanel_RowLeftCenterRight) {
      args      = args || {};
      args      = <Args_WgtPanel_RowLeftCenterRight>IArgs_HtmlTag_Utils.init(args);
      this.args = args;

      if (!args.leftPanel)
         args.leftPanel = WgtPanel_Generic.create();
      if (!args.centerPanel)
         args.centerPanel = WgtPanel_Generic.create();
      if (!args.rightPanel)
         args.rightPanel = WgtPanel_Generic.create();

      // see https://stackoverflow.com/questions/32551291/in-css-flexbox-why-are-there-no-justify-items-and-justify-self-properties/33856609#33856609
      let leftBox: AbstractWidget = WgtPanel_Generic.create({
                                                               htmlTagClass: "flex-lcr-box flex-lcr-box-left",
                                                               children:     [
                                                                  WgtPanel_Generic.create({
                                                                                             htmlTagType: 'span',
                                                                                             children:    [args.leftPanel]
                                                                                          })
                                                               ]
                                                            });
      let centerBox: AbstractWidget = WgtPanel_Generic.create({
                                                               htmlTagClass: "flex-lcr-box",
                                                               children:     [
                                                                  WgtPanel_Generic.create({
                                                                                             htmlTagType: 'span',
                                                                                             children:   [ args.centerPanel]
                                                                                          })
                                                               ]
                                                            });

      let rightBox: AbstractWidget = WgtPanel_Generic.create({
                                                               htmlTagClass: "flex-lcr-box flex-lcr-box-right",
                                                               children:     [
                                                                  WgtPanel_Generic.create({
                                                                                             htmlTagType: 'span',
                                                                                             children:    [args.rightPanel]
                                                                                          })
                                                               ]
                                                            });

      let anyArgs: Args_AnyWidget = {
         children: [leftBox, centerBox, rightBox]
      };
      this.initialize_AnyWidget(anyArgs);

   } // initialize_WgtPanel_RowLeftCenterRight

   async localContentBegin(): Promise<string> {
      if (!this.args.hideDefaultClasses) {
         this.args.htmlTagClass = this.args.htmlTagClass || '';
               this.args.htmlTagClass += ' flex-container-lcr';
      }
      return `<${this.args.htmlTagType} id="${this.tagId}"${IArgs_HtmlTag_Utils.class(this.args)}${IArgs_HtmlTag_Utils.style(this.args)}>`;

   }

   async localContentEnd(): Promise<string> {
      return `</${this.args.htmlTagType}>`; //<!-- id="${this.tagID}" -->
   }


} // WgtPanel_RowLeftCenterRight