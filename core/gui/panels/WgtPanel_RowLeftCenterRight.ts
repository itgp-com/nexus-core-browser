import {AnyWidget, Args_AnyWidget}           from "../AnyWidget";
import {AbstractWidget, Args_AbstractWidget} from "../AbstractWidget";
import {WgtPanel_Generic}                    from "./WgtPanel_Generic";
import {IArgs_HtmlTag, IArgs_HtmlTag_Utils}  from "../../BaseUtils";

export class Args_WgtPanel_RowLeftCenterRight extends Args_AnyWidget implements IArgs_HtmlTag {
   htmlTagClass ?: string;
   htmlTagStyle ?: string;
   htmlTagType ?: string;
   hideDefaultClasses ?: boolean;
   left ?: AbstractWidget;
   center ?: AbstractWidget;
   right ?: AbstractWidget;
}

/**
 * 3 equally spaced horizontal panels
 */
export class WgtPanel_RowLeftCenterRight extends AnyWidget {
   args: Args_WgtPanel_RowLeftCenterRight;


   protected constructor() {
      super();
   }


   static create(args: Args_WgtPanel_RowLeftCenterRight) {
      let instance = new WgtPanel_RowLeftCenterRight();
      instance.initialize_WgtPanel_RowLeftCenterRight(args);
      return instance;
   }

   initialize_WgtPanel_RowLeftCenterRight(args: Args_WgtPanel_RowLeftCenterRight) {
      args      = args || {};
      args      = <Args_WgtPanel_RowLeftCenterRight>IArgs_HtmlTag_Utils.init(args);
      this.args = args;

      if (!args.left)
         args.left = WgtPanel_Generic.create();
      if (!args.center)
         args.center = WgtPanel_Generic.create();
      if (!args.right)
         args.right = WgtPanel_Generic.create();

      // see https://stackoverflow.com/questions/32551291/in-css-flexbox-why-are-there-no-justify-items-and-justify-self-properties/33856609#33856609
      let leftBox: AbstractWidget = WgtPanel_Generic.create({
                                                               htmlTagClass: "flex-lcr-box flex-lcr-box-left",
                                                               children:     [
                                                                  args.left
                                                                  // WgtPanel_Generic.create({
                                                                  //                            htmlTagType: 'span',
                                                                  //                            children:    [args.leftPanel]
                                                                  //                         })
                                                               ]
                                                            });
      let centerBox: AbstractWidget = WgtPanel_Generic.create({
                                                               htmlTagClass: "flex-lcr-box",
                                                               children:     [
                                                                  args.center
                                                                  // WgtPanel_Generic.create({
                                                                  //                            htmlTagType: 'span',
                                                                  //                            children:   [ args.centerPanel]
                                                                  //                         })
                                                               ]
                                                            });

      let rightBox: AbstractWidget = WgtPanel_Generic.create({
                                                               htmlTagClass: "flex-lcr-box flex-lcr-box-right",
                                                               children:     [
                                                                  args.right
                                                                  // WgtPanel_Generic.create({
                                                                  //                            htmlTagType: 'span',
                                                                  //                            children:    [args.rightPanel]
                                                                  //                         })
                                                               ]
                                                            });

      let anyArgs: Args_AnyWidget = {
         children: [leftBox, centerBox, rightBox]
      };
      this.initialize_AnyWidget(anyArgs);

   } // initialize_WgtPanel_RowLeftCenterRight

   async localContentBegin(): Promise<string> {
      let classString = Args_AbstractWidget.combineAllWidgetClassesAsString(this.args, false);
      IArgs_HtmlTag_Utils.init(this.args); // htmlTagClass is not null
      if (classString) {
         if (this.args.htmlTagClass )
            this.args.htmlTagClass += ' '
         this.args.htmlTagClass += classString
      } // if classString

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