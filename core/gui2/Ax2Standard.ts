import {Ax2Widget}             from "./Ax2Widget";
import {createWx2HTMLStandard} from "./Wx2Utils";
import {StateWx2Panel}         from "./ej2/panel/Wx2Panel";
import {Ix2State}              from "./Ix2State";

export interface StateAx2Standard extends Ix2State {
}

export class Ax2Standard extends Ax2Widget  {

  protected constructor(state:StateAx2Standard) {
    super(state);
  }
  protected async _initialSetup(state: StateAx2Standard) {
  }

  localHtmlImplementation(): HTMLElement {
    return createWx2HTMLStandard<StateWx2Panel>(this);
  }

  async localClearImplementation(){
  }

  async localDestroyImplementation(){
  }

  async localLogicImplementation() {
  }

  async localRefreshImplementation() {
  }

}