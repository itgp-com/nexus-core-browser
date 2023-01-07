import {Component} from "@syncfusion/ej2-base";
import {Ax2Widget} from "../Ax2Widget";
import {Ix2State}  from "../Ix2State";


export interface StateEj<WIDGET_TYPE extends Ax2Ej = any, WIDGET_LIBRARY_MODEL=any> extends Ix2State<WIDGET_TYPE> {
   ej ?: WIDGET_TYPE;
}

export abstract class Ax2Ej<
   STATE extends StateEj = any,
   EJ2COMPONENT extends (Component<HTMLElement> | HTMLElement | any) = any,
>
   extends Ax2Widget<STATE, EJ2COMPONENT> {


   protected constructor(state:STATE) {
      super(state);
   }


   protected _constructor(state: STATE) {
      super._constructor(state);
      state.ej = state.ej || {};
   }
}