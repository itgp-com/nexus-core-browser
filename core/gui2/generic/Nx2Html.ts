import {escape, isString} from "lodash";
import {Nx2Basic, StateNx2Basic, StateNx2BasicRef} from "../Nx2Basic";
import {createNx2HtmlBasic} from "../Nx2Utils";
import {Nx2Evt_OnHtml} from "../Nx2";

export interface StateNx2HtmlRef extends StateNx2BasicRef{
   widget ?: Nx2Html;
}

export interface StateNx2Html extends StateNx2Basic {
   value ?: (string|HTMLElement);
   /**
    * Override with specific type used in code completion
    * Contains all the fields that have references to this instance and are usually created by the widget initialization code
    */
   ref ?:StateNx2HtmlRef;
} // state

export class Nx2Html<STATE extends StateNx2Html = StateNx2Html> extends Nx2Basic<STATE> {

   constructor(state:STATE) {
      super(state);
   }

   onHtml(args:Nx2Evt_OnHtml): HTMLElement {
      if ( this.state.value == null )
         this.state.value = '';

      let val: (string|HTMLElement) = this.state.value;
      if (val == null)
         return null;

      if ( isString(val) ) {
         this.state.deco.text = (this.state.deco.escapeText ? escape(val) : val);
      } else {
         let elem:HTMLElement = this.state.value as HTMLElement;


         // merge classes
         if (this.state.deco.classes != null ) {
            mergeClasses(elem, this.state.deco.classes);
         }
         // merge styles
         if ( this.state.deco.style != null )
            Object.assign(elem.style, this.state.deco.style);


         //merge attributes
         Object.assign(elem.attributes, this.state.deco.otherAttr);
         this.htmlElement = elem as HTMLElement;
      }

      return createNx2HtmlBasic(this.state);
   } //onHtml


   // onRefresh(): void {
   //    if (this.state.staticWidget)
   //       return;
   //
   //    let oldHtmlElement = this.htmlElement;
   //    this.htmlElement = null; // just in case
   //    this.initHtml(); // replaces htmlElement
   //    oldHtmlElement.replaceWith(this.htmlElement); // in document model
   // }
} //Nx2Html

function mergeClasses(element1:HTMLElement, classList2:string[]) {
   let classList1 = element1.classList;

   for (let i = 0; i < classList2.length; i++) {
      if (!classList1.contains(classList2[i])) {
         classList1.add(classList2[i]);
      }
   }
}