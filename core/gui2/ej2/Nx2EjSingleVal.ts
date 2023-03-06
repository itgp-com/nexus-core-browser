import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "./Nx2EjBasic";

export interface StateNx2EjSingleValRef extends StateNx2EjBasicRef{
  widget ?: Nx2EjSingleVal;
}

export interface StateNx2EjSingleVal<WIDGET_LIBRARY_MODEL=any> extends StateNx2EjBasic< WIDGET_LIBRARY_MODEL>{

  name ?: string;
  /**
   * Override with specific type used in code completion
   * Contains all the fields that have references to this instance and are usually created by the widget initialization code
   */
  ref ?:StateNx2EjSingleValRef;
}

export class Nx2EjSingleVal extends Nx2EjBasic<StateNx2EjSingleVal<any>> {

  protected constructor(state:StateNx2EjSingleVal) {
    super(state);
  }

} //