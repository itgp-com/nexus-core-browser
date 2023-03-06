import {Component} from "@syncfusion/ej2-base";
import {Nx2} from "../Nx2";
import {StateNx2, StateNx2Ref} from "../StateNx2";

export interface StateNx2EjRef extends StateNx2Ref{
   widget ?: Nx2Ej;
}
export interface StateNx2Ej<WIDGET_LIBRARY_MODEL=any> extends StateNx2 {
   ej ?: WIDGET_LIBRARY_MODEL;

   /**
    * Override with specific type used in code completion
    * Contains all the fields that have references to this instance and are usually created by the widget initialization code
    */
   ref ?:StateNx2EjRef
}

export abstract class Nx2Ej<  STATE extends StateNx2Ej = StateNx2Ej, EJ2COMPONENT extends (Component<HTMLElement> | HTMLElement | any) = any>
              extends Nx2<STATE, EJ2COMPONENT> {


   protected constructor(state:STATE) {
      super(state);
   }


   protected _constructor(state: STATE) {
      state.ej = state.ej || {};
      super._constructor(state);
   }
}