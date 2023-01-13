import * as knockout_lib              from "knockout";
import {escape}                       from "lodash";
import {htmlToElement}                from "../BaseUtils";
import {Ax2Widget}                    from "./Ax2Widget";
import {IHtmlUtils, Ix2HtmlDecorator} from "./Ix2HtmlDecorator";
import {Ix2State}                     from "./Ix2State";

export const ko                  = knockout_lib;
export const tags_no_closing_tag = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];

function hasNoClosingHtmlTag(tag: string): boolean {
   if (!tag) return false;
   return tags_no_closing_tag.indexOf(tag.toLowerCase()) >= 0;
}

export function createWx2HTMLStandard<STATE extends Ix2State>(state: STATE): HTMLElement {
   state           = state || {} as STATE;
   state.decorator = IHtmlUtils.init(state.decorator);

   let decorator: Ix2HtmlDecorator = state.decorator;

   // let html_id: string = ''
   if (!state.noTagIdInHtml && state?.tagId) {
      // if id attribute is generated
      decorator.otherAttr['id'] = state.tagId;
      // html_id = ` id="${widget.tagId}"`;
   }
   let x: string = "";
   x += `<${decorator.tag} ${IHtmlUtils.all(decorator)}>`;
   if ( decorator.value ) {
      let value: string = decorator.value;
      if ( decorator.valuedEscaped )
         value = escape(value);
      x += value;
   }
   if (!hasNoClosingHtmlTag(decorator.tag))
      x += `</${decorator.tag}>`;

   let htmlElement: HTMLElement = htmlToElement(x);

   // Now process the children
   if (state.children) {
      let children: Ax2Widget[] = state.children();
      for (let i = 0; i < children.length; i++) {
         let child: Ax2Widget = children[i];

         let childHtmlElement: HTMLElement = child.htmlElement;
         if (childHtmlElement) {
            htmlElement.appendChild(childHtmlElement);
         }
      } // for children
   } // if (state.children)

   return htmlElement;
} // createHTMLStandard

export function createWx2HtmlStandardForDecorator<DECORATOR extends Ix2HtmlDecorator>(decorator: DECORATOR): HTMLElement {
   decorator = IHtmlUtils.init(decorator) as DECORATOR;

   let x: string = "";
   x += `<${decorator.tag} ${IHtmlUtils.all(decorator)}>`;

   if (!hasNoClosingHtmlTag(decorator.tag)) {
      x += `</${decorator.tag}>`;
   }

   let htmlElement: HTMLElement = htmlToElement(x);
   return htmlElement;
} // createHTMLStandardForDecorator

/**
 * Converts array to ko.ObservableArray (or empty array if not parameters
 * @param children
 */
export function obsChildren(...children: Ax2Widget[]): ko.ObservableArray<Ax2Widget> {
   if (children == null) return ko.observableArray([]);
   let nonNullChildren: Ax2Widget[] = children.filter((child: Ax2Widget) => child != null);
   return ko.observableArray(nonNullChildren);
}