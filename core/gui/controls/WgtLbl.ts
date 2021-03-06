import {Args_WgtSimple, WgtSimple}                          from "./WgtSimple";
import {Args_AnyWidget, IArgs_HtmlTag, IArgs_HtmlTag_Utils} from "../Args_AnyWidget";
import {IDataProviderSimple}     from "../../data/DataProvider";
import {StringArg, stringArgVal} from "../../CoreUtils";


export class Args_WgtLbl extends Args_WgtSimple implements IArgs_HtmlTag {
   htmlTagType ?: string; // div by default
   htmlTagClass ?: string;
   htmlTagStyle ?: string;
   /**
    * String or HTML to define the content of the label
    */
   labelHTML: StringArg;
} // Args_WgtLbl

export class WgtLbl extends WgtSimple<any, Args_AnyWidget, StringArg> {

   args: Args_WgtLbl;

   protected constructor() {
      super();
   }

   static create<DATA_CLASS = any>(args: Args_WgtLbl) {
      args                             = <Args_WgtLbl>IArgs_HtmlTag_Utils.init(args);
      let instance: WgtLbl = new WgtLbl();
      instance.initialize_WgtLbl(args);
      return instance;
   }

   initialize_WgtLbl(args: Args_WgtLbl) {
      if (!args)
         throw "There are no args in call to initialize_WgtDropDown(args) !";
      this.args = args;

      this.initialize_WgtSimple(args)
   } // initialize_WgtLbl


   async localContentBegin(): Promise<string> {
      let x = '';
      if (this.args.wrapper) {
         this.args.wrapper = IArgs_HtmlTag_Utils.init(this.args.wrapper);
         x += `<${this.args.wrapper.htmlTagType} id="${this.wrapperTagID}"${IArgs_HtmlTag_Utils.all(this.args.wrapper)}>`;
      }

      x += `<${this.args.htmlTagType} id="${this.tagId}"${IArgs_HtmlTag_Utils.all(this.args)}>${this.value}</${this.args.htmlTagType}>`;

      if (this.args.wrapper) {
         x += `</${this.args.wrapper.htmlTagType}>`; // <!-- id="${this.wrapperTagID}" -->
      }
      return x;
   }

   async localRefreshImplementation(): Promise<void> {
     let x = this.value; // triggers the function calculation if any
     this.value = x ; // resets the innerHTML
   }


   get value(): StringArg {
      return this.args.labelHTML;
   }

   set value(val: StringArg) {
      this.args.labelHTML = val;
      this.hget.innerHTML = stringArgVal(val);
   }

   getDataProviderSimple(): IDataProviderSimple {
      //there is not data provider for a label currently
     return null;
   }


} // WgtLbl