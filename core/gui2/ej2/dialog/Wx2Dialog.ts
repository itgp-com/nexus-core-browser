import {Dialog, DialogModel}               from "@syncfusion/ej2-popups";
import {Ax2EjStandard, StateAx2EjStandard} from "../Ax2EjStandard";
import {StateWx2DialogHeaderOptions}       from "./util/Wx2DialogUtils";


export interface StateWx2Dialog extends StateAx2EjStandard<Ax2EjStandard, DialogModel> {
   /**
    * Options that would add or replace default header behavior
    */
   headerOptions ?: StateWx2DialogHeaderOptions;
}


export class Wx2Dialog {


   constructor() {
   }

   protected async _initialSetup(state: StateWx2Dialog) {
      state.ej = state.ej || {};
      state.ej = new Dialog(state.ej);
   }


} // wx2Dialog