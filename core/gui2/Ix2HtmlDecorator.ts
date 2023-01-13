import {isEmpty}          from "lodash";
import {IKeyValueString}  from "../BaseUtils";
import {cssStyleToString} from "../CoreUtils";
import {CssStyle}         from "../gui/AbstractWidget";
import {Ix2State}         from "./Ix2State";

export interface Ix2HtmlDecorator {
   /**
    * the tag type of the HTMLElement
    */
   tag?: string;
   /**
    * the classes assigned to this HTMLElement
    */
   class?: string[];

   /**
    * the style assigned to this HTMLElement
    */
   style?: CssStyle;

   /**
    * other attributes assigned to this HTMLElement
    */
   otherAttr?: IKeyValueString;

   /**
    * Any string that belongs inside this tab. If this string is actually HTML, it should really be added as <link>Wx2Html</link> children of the widget.
    */
   value ?: string;
   /**
    * set to true to escape the string value before adding it to the HTML
    */
   valuedEscaped ?: boolean;

} // end of Ix2HtmlDecorator


export class IHtmlUtils {

   static initDecorator(state: Ix2State) {
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
      decorator     = IHtmlUtils.init(decorator);
      let c: string = '';
      if (decorator.class.length > 0)
         c = ` class="${decorator.class.join(' ')}"`;
      return c;
   }

   static style(decorator: Ix2HtmlDecorator): string {
      decorator        = IHtmlUtils.init(decorator);
      let htmlTagStyle = '';
      if (decorator.style && !isEmpty(decorator.style))
         htmlTagStyle = ` style="${cssStyleToString(decorator.style)}"`;
      return htmlTagStyle;
   }

   static otherAttr(decorator: Ix2HtmlDecorator): string {
      decorator             = IHtmlUtils.init(decorator);
      let otherAttrArray    = Object.entries(decorator.otherAttr);
      let htmlAttrs: string = (otherAttrArray.length > 0 ? ' ' : '');
      if (decorator.otherAttr) {
         otherAttrArray.forEach(entry => {
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

   static all(decorator: Ix2HtmlDecorator): string {
      return `${IHtmlUtils.class(decorator)}${IHtmlUtils.style(decorator)}${IHtmlUtils.otherAttr(decorator)}`;
   }


} // end of IHtmlUtils