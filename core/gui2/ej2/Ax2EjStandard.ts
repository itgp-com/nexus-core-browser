import {Ix2State}              from "../Ix2State";
import {createWx2HTMLStandard} from "../Wx2Utils";
import {Ax2Ej, StateEj}        from "./Ax2Ej";

export interface StateAx2EjStandard<WIDGET_TYPE extends Ax2EjStandard = any, WIDGET_LIBRARY_MODEL=any> extends StateEj<WIDGET_TYPE, WIDGET_LIBRARY_MODEL> {
}


export abstract class Ax2EjStandard<STATE extends Ix2State = any> extends Ax2Ej<STATE> {

   protected constructor(state:STATE) {
      super(state);
   }


   public onHtml(): HTMLElement {
      return createWx2HTMLStandard<STATE>(this);
   }


   async onClear(): Promise<void> {
   }

   async onDestroy(): Promise<void> {
   }

   async onLogic(): Promise<void> {
   }

   async onRefresh(): Promise<void> {
   }


}