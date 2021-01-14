import {AnyWidget}               from "./AnyWidget";
import {StringArg, voidFunction} from "../CoreUtils";
import {AbstractWidget, wu}      from "../../core/index";
import {BeforeInitLogicEvent} from "./BeforeInitLogicListener";
import {AfterInitLogicEvent}    from "./AfterInitLogicListener";


export interface IKeyValueString {
   [key:string]: string
}

export interface IArgs_HtmlTag {
   htmlTagType ?: string; // div by default
   htmlTagClass ?: string;
   htmlTagStyle ?: string;
   htmlOtherAttr ?: IKeyValueString; // {string:string};
}

export class IArgs_HtmlTag_Utils {

   static init(args:IArgs_HtmlTag):IArgs_HtmlTag{
      if (!args)
         args = {};
      if (!args.htmlTagType)
         args.htmlTagType = 'div' ;// default to 'div'
      if ( !args.htmlTagClass)
         args.htmlTagClass = '';
      return args;
   }


   static class(args:IArgs_HtmlTag):string{
      args = IArgs_HtmlTag_Utils.init(args);
      let htmlTagClass = '';
      if (args.htmlTagClass)
         htmlTagClass = ` class="${args.htmlTagClass}"`;

      return htmlTagClass;
   }
   static style(args:IArgs_HtmlTag):string{
      args = IArgs_HtmlTag_Utils.init(args);
      let htmlTagStyle = '';
      if (args.htmlTagStyle)
         htmlTagStyle = ` style="${args.htmlTagStyle}"`;
      return htmlTagStyle;
   }

   static otherAttr(args:IArgs_HtmlTag):string{
      args = IArgs_HtmlTag_Utils.init(args);
      let htmlAttrs = '';
      if (args.htmlOtherAttr) {
         Object.entries(args.htmlOtherAttr).forEach(entry => {
            let key = entry[0];
            let value = entry[1];
            //use key and value here
            htmlAttrs += ` ${key}="${value}"`;
         });
      }
      return htmlAttrs;
   }

   static all(args:IArgs_HtmlTag):string{
      return `${IArgs_HtmlTag_Utils.class(args)}${IArgs_HtmlTag_Utils.style(args)}${IArgs_HtmlTag_Utils.otherAttr(args)}`;
   }


}


export class Args_AnyWidget {

   id?: string;
   title ?: string;
   colName?: string;
   readonly ?: boolean = false;
   required?: boolean  = true;
   formGroup_id ?: string;
   /**
    * The id of the div that will be used for the error message in validation
    */
   error_id ?: string;

   /*
    Example:
    validation: {date: [true, 'Enter valid format']}

    or

    validation:{email: [true, 'Enter valid Email']}

    */
   validation ?: any;

   parent ?: AbstractWidget;

   children ?: AbstractWidget[];

   /**
    * Returns the HTML to be inserted before the children's HTML.
    * It is a function so the string is evaluated after the initialization is done. If it was a mere string, the string instantiation would happen at the time the descriptor was created, which is before the widget is instantiated
    */
   localContentBegin ?: StringArg; // ()=>string;

   /**
    * Returns the HTML to be inserted after the children's HTML
    * It is a function so the string is evaluated after the initialization is done. If it was a mere string, the string instantiation would happen at the time the descriptor was created, which is before the widget is instantiated*
    */
   localContentEnd ?: StringArg; // ()=>string;

   extraTagIdCount ?: number = 0;

   initLogic ?: voidFunction;
   refresh ?: voidFunction;
   clear ?: voidFunction;
   destroy ?: voidFunction;
   beforeInitLogicListener ?: (ev:BeforeInitLogicEvent) => void;
   afterInitLogicListener ?:(ev :AfterInitLogicEvent)=>void;


   static initialize(descriptor: Args_AnyWidget, widget:AnyWidget): void {

      if ( descriptor.colName) {
         if (!descriptor.id)
            descriptor.id = descriptor.colName;
      } else {
         if ( descriptor.id)
            descriptor.colName = descriptor.id;
      }

      if (!descriptor.id)
         descriptor.id = wu.getRandomString( (widget ? widget.thisClassName : 'widget') ); // generate an id regardless

      if (!descriptor.required)
         descriptor.required = false;

      if (!descriptor.readonly)
         descriptor.readonly = false;

      if (!descriptor.error_id)
         descriptor.error_id = `${descriptor.id}ErrorMsg`;
      if (!descriptor.formGroup_id)
         descriptor.formGroup_id = `${descriptor.id}FormGroup`;
   } // initialize
}