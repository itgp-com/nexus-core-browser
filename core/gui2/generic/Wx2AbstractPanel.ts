import {Ax2Widget} from "../Ax2Widget";
import {Ix2State}  from "../Ix2State";

export abstract class Wx2AbstractPanel<STATE extends Ix2State> extends Ax2Widget<STATE> {

  protected constructor(state:STATE) {
    super(state);
  }

}