import {Ix2State}              from "../Ix2State";
import {createWx2HTMLStandard} from "../Wx2Utils";
import {Ax2Ej, StateEj}        from "./Ax2Ej";

export interface StateEjStandard<WIDGET_LIBRARY_MODEL=any> extends StateEj<WIDGET_LIBRARY_MODEL> {
}


export abstract class Ax2EjStandard<STATE extends Ix2State> extends Ax2Ej<STATE> {

   protected constructor(state:STATE) {
      super(state);
   }


   public localHtmlImplementation(): HTMLElement {
      return createWx2HTMLStandard<STATE>(this);
   }


   async localClearImplementation(): Promise<void> {
   }

   async localDestroyImplementation(): Promise<void> {
   }

   async localLogicImplementation(): Promise<void> {
   }

   async localRefreshImplementation(): Promise<void> {
   }


}