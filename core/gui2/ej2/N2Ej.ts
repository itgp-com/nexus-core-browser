import {Component} from "@syncfusion/ej2-base";
import {N2} from "../N2";
import {addN2Class} from '../N2HtmlDecorator';
import {StateN2, StateN2Ref} from "../StateN2";

export interface StateN2EjRef extends StateN2Ref{
   widget ?: N2Ej;
}
export interface StateN2Ej<WIDGET_LIBRARY_MODEL=any> extends StateN2 {
   ej ?: WIDGET_LIBRARY_MODEL;

   /**
    * Override with specific type used in code completion
    * Contains all the fields that have references to this instance and are usually created by the widget initialization code
    */
   ref ?:StateN2EjRef
}

export abstract class N2Ej<  STATE extends StateN2Ej = StateN2Ej, EJ2COMPONENT extends (Component<HTMLElement> | HTMLElement | any) = any>
              extends N2<STATE, EJ2COMPONENT> {
    static readonly CLASS_IDENTIFIER: string = 'N2Ej';


   protected constructor(state ?:STATE) {
      super(state);
   }


   protected onStateInitialized(state: STATE) {
      addN2Class(state.deco, N2Ej.CLASS_IDENTIFIER);
      super.onStateInitialized(state)
   }


   protected _constructor(state ?: STATE) {
      state.ej = state.ej || {};
      super._constructor(state);
   }

   get classIdentifier(): string { return N2Ej.CLASS_IDENTIFIER; }
}