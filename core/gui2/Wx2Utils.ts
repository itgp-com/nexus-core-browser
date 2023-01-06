import {Ax2Widget}                    from "./Ax2Widget";
import {Ix2State}                     from "./Ix2State";
import {Ix2HtmlDecorator, IHtmlUtils} from "./Ix2HtmlDecorator";
import {htmlToElement}                from "../BaseUtils";

import * as knockout_lib from "knockout";

export const ko = knockout_lib;
export const tags_no_closing_tag = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];

function hasNoClosingHtmlTag(tag: string): boolean {
   if (!tag) return false;
   return tags_no_closing_tag.indexOf(tag.toLowerCase()) >= 0;
}

export function createWx2HTMLStandard<STATE extends Ix2State>(widget: Ax2Widget<STATE>): HTMLElement {
   let state: STATE = widget.state || {} as STATE;
   state.decorator  = IHtmlUtils.init(state.decorator);

   let decorator: Ix2HtmlDecorator = state.decorator;

   let html_id: string = ''
   if (!state.noTagIdInHtml) {
      // if id attribute is generated
      html_id = ` id="${widget.tagId}"`;
   }
   let x: string = "";
   x += `<${decorator.tag} ${html_id} ${IHtmlUtils.all(decorator)}>`;

   // children logic here

   if (!hasNoClosingHtmlTag(decorator.tag)) {
      x += `</${decorator.tag}>`;
   }

   let htmlElement:HTMLElement = htmlToElement(x);

   widget.htmlElement = htmlElement;   // tag the widget with the htmlElement (the set method also tags the htmlElement with the widget)


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