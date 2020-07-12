import {WgtSimple}                                          from "../controls/WgtSimple";
import {Args_AnyWidget, IArgs_HtmlTag, IArgs_HtmlTag_Utils} from "../Args_AnyWidget";
import {Args_WgtLbl, WgtLbl}                                from "../controls/WgtLbl";
import {AbstractWidget}                                     from "../AbstractWidget";
import {Args_WgtPanel_Generic, WgtPanel_Generic}            from "./WgtPanel_Generic";

export class Args_WgtPanel_LabeledControl<T extends AbstractWidget> {
   label: WgtLbl;
   separator ?: AbstractWidget;
   control: T;
   wrapper: IArgs_HtmlTag;
}


export class WgtPanel_LabeledControl<CONTROL extends AbstractWidget, DATA_CLASS = any> extends WgtPanel_Generic {

   // args: Args_WgtPanel_LabeledControl<CONTROL>;

   protected constructor() {
      super();
   }

   static create<T extends AbstractWidget, DATA_CLASS = any>(args:Args_WgtPanel_LabeledControl<T> | any): WgtPanel_LabeledControl<T, DATA_CLASS> {
      //any is an options because in Typescript static overloads the same static method in super!!!!!

      if (!args)
         throw "There are no args in call to WgtPanel_LabeledControl.create(args) !";

      //TODO: Check if it's Args_WgtPanel_LabeledControl

      args.wrapper = IArgs_HtmlTag_Utils.init(args.wrapper);


      let argsGenericPanel: Args_WgtPanel_Generic = {
         htmlTagType:  args.wrapper.htmlTagType,
         htmlTagClass: args.wrapper.htmlTagClass,
         htmlTagStyle: args.wrapper.htmlTagStyle,
         children:     [
            args.label
         ]
      };

      if (args.separator)
         argsGenericPanel.children.push(args.separator);
      argsGenericPanel.children.push(args.control);

      return WgtPanel_Generic.create(argsGenericPanel);
   } // create

} // WgtLabeledControl
