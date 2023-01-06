import {Ax2Widget}                      from "../Ax2Widget";
import {StateEjStandard, Ax2EjStandard} from "./Ax2EjStandard";

export interface StateEjSingleVal<WIDGET_LIBRARY_MODEL=any> extends StateEjStandard<WIDGET_LIBRARY_MODEL>{

  propertyName ?: string;
}

export class Ax2EjSingleVal extends Ax2EjStandard<StateEjSingleVal<any>> {

  protected constructor(state:StateEjSingleVal) {
    super(state);
  }

} // Wx2AtomicWidget