import {observable}                    from "knockout";
import {isString}                      from "lodash";
import {Observable}                    from "../../../BaseUtils";
import {Ax2Standard, StateAx2Standard} from "../../Ax2Standard";
import {createWx2HTMLStandard}         from "../../Wx2Utils";

export interface StateWx2Html<WIDGET_TYPE extends Wx2Html=any> extends StateAx2Standard<WIDGET_TYPE> {
   value: Observable<string|HTMLElement>;


}

export class Wx2Html extends Ax2Standard {
   constructor(state:StateWx2Html) {
      super(state);
   }

   onHtml(): HTMLElement {
      if ( this.state.value == null )
         this.state.value = observable('');

      if ( isString(this.state.value()) ) {
         this.state.deco.text = this.state.value();
      } else {
         let elem:HTMLElement = this.state.value() as HTMLElement;


         // merge classes
         if ( this.state.deco.classes != null ) {
            mergeClasses(elem, this.state.deco.classes);
         }
         // merge styles
         if ( this.state.deco.style != null )
            Object.assign(elem.style, this.state.deco.style);


         //merge attributes
         Object.assign(elem.attributes, this.state.deco.attributes);
         this.htmlElement = elem as HTMLElement;
      }

      this.htmlElement = createWx2HTMLStandard(this.state);
      return this.htmlElement;
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