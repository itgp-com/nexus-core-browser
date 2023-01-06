import {CssStyle}         from "../gui/AbstractWidget";
import {IKeyValueString}  from "../BaseUtils";
import {cssStyleToString} from "../CoreUtils";
import {Ix2State}         from "./Ix2State";

export interface Ix2HtmlDecorator {
   /**
    * the tag type of the HTMLElement
    */
   tag ?: string;
   /**
    * the classes assigned to this HTMLElement
    */
   class ?: string[];

   /**
    * the style assigned to this HTMLElement
    */
   style ?: CssStyle;

   /**
    * other attributes assigned to this HTMLElement
    */
   otherAttr ?: IKeyValueString;

} // end of Ix2HtmlDecorator


export class IHtmlUtils {

   static initDecorator(state:Ix2State) {
      state.decorator = IHtmlUtils.init(state.decorator);
   }

   /**
    * Initializes the decorator with default values.
    * If the original decorator is null, a new one is created.
    * @param decorator
    */
   static init(decorator: Ix2HtmlDecorator): Ix2HtmlDecorator {
      if (!decorator)
         decorator = {};
      if (!decorator.tag)
         decorator.tag = 'div';// default to 'div'
      if (!decorator.class)
         decorator.class = [];
      if (!decorator.style)
         decorator.style = {};
      if (!decorator.otherAttr)
         decorator.otherAttr = {};
      return decorator;
   } //init

   static class(decorator: Ix2HtmlDecorator): string {
      decorator             = IHtmlUtils.init(decorator);
      let c:string  = '';
      if (decorator.class.length > 0)
         c = ` class="${decorator.class.join(' ')}"`;
      return c;
   }

   static style(decorator: Ix2HtmlDecorator): string {
      decorator             = IHtmlUtils.init(decorator);
      let htmlTagStyle = '';
      if (decorator.style)
         htmlTagStyle = ` style="${cssStyleToString(decorator.style)}"`;
      return htmlTagStyle;
   }

   static otherAttr(decorator: Ix2HtmlDecorator): string {
      decorator          = IHtmlUtils.init(decorator);
      let htmlAttrs = '';
      if (decorator.otherAttr) {
         Object.entries(decorator.otherAttr).forEach(entry => {
            let key   = entry[0];
            let value = entry[1];
            //use key and value here
            if (value == null) {
               htmlAttrs += ` ${key}` // attributes like 'required' that don't have an equal something after the name
            } else {
               htmlAttrs += ` ${key}="${value}"`;
            }
         });
      }
      return htmlAttrs;
   }

   static all(args: Ix2HtmlDecorator): string {
      return `${IHtmlUtils.class(args)}${IHtmlUtils.style(args)}${IHtmlUtils.otherAttr(args)}`;
   }


} // end of IHtmlUtils