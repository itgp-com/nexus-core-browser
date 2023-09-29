import {escape, isString} from "lodash";
import {N2Basic, StateN2Basic, StateN2BasicRef} from "../N2Basic";
import {addN2Class} from '../N2HtmlDecorator';
import {createN2HtmlBasic} from "../N2Utils";
import {N2Evt_OnHtml} from "../N2";

export interface StateN2HtmlRef extends StateN2BasicRef{
   widget ?: N2Html;
}

export interface StateN2Html extends StateN2Basic {
   value ?: (string|HTMLElement);
   /**
    * Override with specific type used in code completion
    * Contains all the fields that have references to this instance and are usually created by the widget initialization code
    */
   ref ?:StateN2HtmlRef;
} // state

export class N2Html<STATE extends StateN2Html = StateN2Html> extends N2Basic<STATE> {
static readonly CLASS_IDENTIFIER: string = 'N2Html'
   constructor(state:STATE) {
      super(state);
   }

   protected onStateInitialized(state: STATE) {
      addN2Class(state.deco, N2Html.CLASS_IDENTIFIER);
      super.onStateInitialized(state)
   }


   onHtml(args:N2Evt_OnHtml): HTMLElement {
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

      return createN2HtmlBasic(this.state);
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
} //N2Html

function mergeClasses(element1:HTMLElement, classList2:string|string[]) {
   let classList1 = element1.classList;

   let classArray2 = (classList2? (Array.isArray(classList2) ? classList2 : [classList2]) : []);

   for (let i = 0; i < classArray2.length; i++) {
      if (!classList1.contains(classArray2[i])) {
         classList1.add(classArray2[i]);
      }
   }
}