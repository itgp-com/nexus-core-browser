import {IArgs_HtmlTag, IArgs_HtmlTag_Utils}    from "../Args_AnyWidget";
import {Args_WgtLbl_Abstract, WgtLbl_Abstract} from "./WgtLbl_Abstract";


export class Args_WgtLbl extends Args_WgtLbl_Abstract implements IArgs_HtmlTag {
} // Args_WgtLbl

export class WgtLbl extends WgtLbl_Abstract{

   protected constructor() {
      super();
   }

   static create(args: Args_WgtLbl) {
      args                 = <Args_WgtLbl>IArgs_HtmlTag_Utils.init(args);
      let instance: WgtLbl = new WgtLbl();
      instance.initialize_WgtLbl(args);
      return instance;
   }

   initialize_WgtLbl(args: Args_WgtLbl) {
      if (!args)
         throw "There are no args in call to initialize_WgtLbl(args) !";
      this.args = args;

      this.initialize_WgtLbl_Abstract(args)
   } // initialize_WgtLbl

} // WgtLbl