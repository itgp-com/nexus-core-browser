import {Ax2Widget}        from "../Ax2Widget";
import {Component}        from "@syncfusion/ej2-base";
import {Ix2State}         from "../Ix2State";
import {StateAx2Standard} from "../Ax2Standard";


export interface StateEj<WIDGET_LIBRARY_MODEL=any> extends Ix2State {
}

export abstract class Ax2Ej<
   STATE extends Ix2State = Ix2State,
   EJ2COMPONENT extends (Component<HTMLElement> | HTMLElement | any) = any,
>
   extends Ax2Widget<STATE, EJ2COMPONENT> {


   protected constructor(state:STATE) {
      super(state);
   }


}