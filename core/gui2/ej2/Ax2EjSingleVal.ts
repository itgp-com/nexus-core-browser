import {Ax2Ej}                             from "./Ax2Ej";
import {Ax2EjStandard, StateAx2EjStandard} from "./Ax2EjStandard";

export interface StateEjSingleVal<WIDGET_TYPE extends Ax2Ej = any, WIDGET_LIBRARY_MODEL=any> extends StateAx2EjStandard<WIDGET_TYPE, WIDGET_LIBRARY_MODEL>{

  propertyName ?: string;
}

export class Ax2EjSingleVal extends Ax2EjStandard<StateEjSingleVal<any>> {

  protected constructor(state:StateEjSingleVal) {
    super(state);
  }

} // Wx2AtomicWidget