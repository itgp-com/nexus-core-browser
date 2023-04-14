import {Button, ButtonModel} from "@syncfusion/ej2-buttons";
import {StringArg, stringArgVal} from "../../../BaseUtils";
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";
import {Nx2Evt_OnHtml, Nx2Evt_OnLogic} from "../../Nx2";


export interface StateNx2EjButtonRef extends StateNx2EjBasicRef{
   widget ?: Nx2EjButton;
}

export interface StateNx2EjButton extends StateNx2EjBasic< ButtonModel> {

   /**
    * function or string yielding the text or HTML that will overwrite the 'content' value of the ButtonModel
    */
   label?: StringArg;

   /**
    * implement the onClick behavior of the button
    */
   onclick?: (ev: MouseEvent) => void;

   /**
    * Override with specific type used in code completion
    * Contains all the fields that have references to this instance and are usually created by the widget initialization code
    */
   ref ?:StateNx2EjButtonRef;
}

export class Nx2EjButton<STATE extends StateNx2EjButton = StateNx2EjButton> extends Nx2EjBasic<STATE, Button> {
   constructor(state ?: STATE) {
      super(state);
   }

   onHtml(args:Nx2Evt_OnHtml): HTMLElement {
      let state                    = this.state;
      state.deco.tag               = 'button';
      state.deco.otherAttr['type'] = 'button';
      return super.onHtml(args);
   }

   onLogic(args: Nx2Evt_OnLogic) {
      let state = this.state;
      if (state.label)
         state.ej.content = stringArgVal(state.label); // Button content label/ html

      let obj: Button           = new Button(this.state.ej);
      this.state.ref.widget.obj = obj;
      obj.appendTo(this.state.ref.htmlElement);


      if (this.state.onclick)
         this.htmlElement.onclick = this.state.onclick;
      this.htmlElement.classList.add('Nx2EjButton');

   }

}