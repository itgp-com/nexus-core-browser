import {Dialog, DialogModel}               from "@syncfusion/ej2-popups";
import {Ax2EjStandard, StateAx2EjStandard} from "../Ax2EjStandard";

export interface StateWx2Dialog extends StateAx2EjStandard<Ax2EjStandard, DialogModel> {
}


export class Wx2Dialog {


   constructor() {
   }

   protected async _initialSetup(state: StateWx2Dialog) {
      state.ej = state.ej || {};
      state.ej = new Dialog(state.ej);
   }


}