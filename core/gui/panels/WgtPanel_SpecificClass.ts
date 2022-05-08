import {AnyWidget}               from "../AnyWidget";
import {Args_AnyWidget}          from "../Args_AnyWidget";
import {AbstractWidget}          from "../AbstractWidget";
import {StringArg, stringArgVal} from "../../CoreUtils";


export class Args_WgtPanel {
   prefixClasses ?: StringArg;
   suffixClasses ?: StringArg;
   style ?: StringArg;
   children ?: AbstractWidget[];

   /**
    * HTML tag to be used instead of the default 'div'
    */
   htmlTag ?: string;
}

export class Args_WgtPanel_SpecificClass  extends Args_WgtPanel{
   mandatoryClass: StringArg; // this is the class that MUST exist
}

export class WgtPanel_SpecificClass extends AnyWidget {
   args: Args_WgtPanel_SpecificClass;

   protected constructor() {
      super();
   }


   static create(args ?: Args_WgtPanel_SpecificClass): WgtPanel_SpecificClass {
      let instance =  new WgtPanel_SpecificClass();
      instance.initialize_WgtPanel_SpecificClass(args);
      return instance;
   }

   initialize_WgtPanel_SpecificClass(args: Args_WgtPanel_SpecificClass){
      this.args = args;

      let descriptor: Args_AnyWidget = {
         id:               this.constructor.name,
      }; //Args_AnyWidget

      if ( args && args.children)
         descriptor.children = args.children;
      this.initialize_AnyWidget(descriptor);
   }

   async localContentBegin(): Promise<string> {
      let args = this.args;

      let prefix = '';
      let suffix = '';
      let style  = '';
      let tag    = this.getTag();

      if (args && args.prefixClasses)
         prefix = stringArgVal(args.prefixClasses) + ' ';
      if (args && args.suffixClasses)
         suffix = ' ' + stringArgVal(args.suffixClasses);
      if (args && args.style)
         style = ` style="${stringArgVal(args.style)}"`;
      return `<${tag} id="${this.tagId}" class="${prefix}${args.mandatoryClass}${suffix}"${style}>`;
   }
   async localContentEnd(): Promise<string> {
      let tag    = this.getTag();
      return `</${tag}>`;
   }


   private getTag():string{
      let args = this.args;
      let tag    = 'div';
      if ( args?.htmlTag)
         tag=args.htmlTag;
      return tag;
   }
}