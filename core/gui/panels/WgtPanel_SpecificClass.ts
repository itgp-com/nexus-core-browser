import {AnyWidget}               from "../AnyWidget";
import {Args_AnyWidget}                       from "../Args_AnyWidget";
import {addCssClass, StringArg, stringArgVal} from "../../CoreUtils";
import {Args_AbstractWidget}                  from "../AbstractWidget";


export class Args_WgtPanel extends Args_AnyWidget {
   style ?: StringArg;

   /**
    * HTML tag to be used instead of the default 'div'
    */
   htmlTag ?: string;
}

export class Args_WgtPanel_SpecificClass extends Args_WgtPanel {
   mandatoryClass: StringArg; // this is the class that MUST exist
}

export class WgtPanel_SpecificClass extends AnyWidget {
   args: Args_WgtPanel_SpecificClass;

   protected constructor() {
      super();
   }


   static create(args ?: Args_WgtPanel_SpecificClass): WgtPanel_SpecificClass {
      let instance = new WgtPanel_SpecificClass();
      instance.initialize_WgtPanel_SpecificClass(args);
      return instance;
   }

   initialize_WgtPanel_SpecificClass(args: Args_WgtPanel_SpecificClass) {
      this.args = args;

      Args_AnyWidget.initialize(args, this);
      this.initialize_AnyWidget(args);
   }

   async localContentBegin(): Promise<string> {
      let args = this.args;
      Args_AnyWidget.initialize(this.args, this);

      let style = '';
      let tag   = this.getTag();


      let mandatoryClassString: string = stringArgVal(args.mandatoryClass);

      if (mandatoryClassString)
         if (this.args.cssClasses.indexOf(mandatoryClassString) < 0)
            addCssClass(this.args, mandatoryClassString);


      let classString = Args_AbstractWidget.combineAllWidgetClassesAsString(this.args, true);

      if (args && args.style)
         style = ` style="${stringArgVal(args.style)}"`;
      return `<${tag} id="${this.tagId}" ${classString}${style}>`;
   }

   async localContentEnd(): Promise<string> {
      let tag = this.getTag();
      return `</${tag}>`;
   }


   private getTag(): string {
      let args = this.args;
      let tag  = 'div';
      if (args?.htmlTag)
         tag = args.htmlTag;
      return tag;
   }
}