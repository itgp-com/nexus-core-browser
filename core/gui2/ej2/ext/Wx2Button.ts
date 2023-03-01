import {Button, ButtonModel}               from "@syncfusion/ej2-buttons";
import {StringArg, stringArgVal}           from "../../../BaseUtils";
import {Ax2EjStandard, StateAx2EjStandard} from "../Ax2EjStandard";
import {Ix2OnHtml} from "../../Ax2Widget";

export interface StateWx2Button<WIDGET_TYPE extends Wx2Button = Wx2Button> extends StateAx2EjStandard<WIDGET_TYPE, ButtonModel> {

   /**
    * function or string yielding the text or HTML that will overwrite the 'content' value of the ButtonModel
    */
   label?: StringArg;

   /**
    * implement the onClick behavior of the button
    */
   onclick?: (ev: MouseEvent) => void;
}

export class Wx2Button<STATE extends StateWx2Button = any> extends Ax2EjStandard<STATE> {
   constructor(state: STATE) {
      super(state);
   }

   onHtml(args:Ix2OnHtml): HTMLElement {
      let state                    = this.state;
      state.deco.tag               = 'button';
      state.deco.otherAttr['type'] = 'button';
      return super.onHtml(args);
   }

   onLogic(): void {
      let state = this.state;
      if (state.label)
         state.ej.content = stringArgVal(state.label); // Button content label/ html

      let obj: Button           = new Button(this.state.ej);
      this.state.gen.widget.obj = obj;
      obj.appendTo(this.state.gen.htmlElement);


      if (this.state.onclick)
         this.htmlElement.onclick = this.state.onclick;

   }

}