import {Ax2Widget}             from "./Ax2Widget";
import {StateWx2Panel}         from "./ej2/panel/Wx2Panel";
import {Ix2State}              from "./Ix2State";
import {createWx2HTMLStandard} from "./Wx2Utils";

export interface StateAx2Standard<WIDGET_TYPE extends Ax2Standard = any> extends Ix2State<WIDGET_TYPE> {
}

export class Ax2Standard<STATE extends Ix2State = StateAx2Standard> extends Ax2Widget<STATE>  {

  protected constructor(state:STATE) {
    super(state);
  }

  onHtml(): HTMLElement {
    return createWx2HTMLStandard<StateWx2Panel>(this.state);
  }

  async onClear(){
  }

  async onDestroy(){
  }

  async onLogic() {
  }

  async onRefresh() {
  }

}