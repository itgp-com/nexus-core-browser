import {Ax2Widget}             from "./Ax2Widget";
import {createWx2HTMLStandard} from "./Wx2Utils";
import {StateWx2Panel}         from "./ej2/panel/Wx2Panel";
import {Ix2State}              from "./Ix2State";

export interface StateAx2Standard<WIDGET_TYPE extends Ax2Standard = any> extends Ix2State<WIDGET_TYPE> {
}

export class Ax2Standard extends Ax2Widget  {

  protected constructor(state:StateAx2Standard) {
    super(state);
  }

  onHtml(): HTMLElement {
    this.htmlElement =  createWx2HTMLStandard<StateWx2Panel>(this.state);
    return this.htmlElement;
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