import {observable}       from "knockout";
import {escape, isString} from "lodash";
import {Observable}       from "../../../BaseUtils";
import {Ax2Standard, StateAx2Standard} from "../../Ax2Standard";
import {createWx2HTMLStandard}         from "../../Wx2Utils";

export interface StateWx2Html<WIDGET_TYPE extends Wx2Html=any> extends StateAx2Standard<WIDGET_TYPE> {
   value: Observable<string|HTMLElement>;


}

export class Wx2Html extends Ax2Standard<StateWx2Html> {


   constructor(state:StateWx2Html) {
      super(state);
   }

   onHtml(): HTMLElement {
      if ( this.state.value == null )
         this.state.value = observable('');

      let val: (string|HTMLElement) = this.state.value();
      if (val == null)
         return null;

      if ( isString(val) ) {
         this.state.deco.text = (this.state.deco.escapeText ? escape(val) : val);
      } else {
         let elem:HTMLElement = this.state.value() as HTMLElement;


         // merge classes
         if ( this.state.deco.class != null ) {
            mergeClasses(elem, this.state.deco.class);
         }
         // merge styles
         if ( this.state.deco.style != null )
            Object.assign(elem.style, this.state.deco.style);


         //merge attributes
         Object.assign(elem.attributes, this.state.deco.otherAttr);
         this.htmlElement = elem as HTMLElement;
      }

      return createWx2HTMLStandard(this.state);
   } //onHtml


   async onRefresh(): Promise<void> {
      if (this.state.staticWidget)
         return;

      let newHtmlElement = this.onHtml();
      let oldHtmlElement = this.htmlElement;
      this.htmlElement = newHtmlElement;
      oldHtmlElement.replaceWith(newHtmlElement); // in document model
   }
} //Wx2Html

function mergeClasses(element1:HTMLElement, classList2:string[]) {
   var classList1 = element1.classList;

   for (let i = 0; i < classList2.length; i++) {
      if (!classList1.contains(classList2[i])) {
         classList1.add(classList2[i]);
      }
   }
}