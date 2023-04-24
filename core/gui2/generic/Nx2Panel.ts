import {Nx2Basic, StateNx2Basic, StateNx2BasicRef} from "../Nx2Basic";
import {addNx2Class} from '../Nx2HtmlDecorator';


export interface StateNx2PanelRef extends StateNx2BasicRef{
    widget ?: Nx2Panel;
}

export interface StateNx2Panel extends StateNx2Basic {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?:StateNx2PanelRef;
}

export class Nx2Panel<STATE extends StateNx2Panel = StateNx2Panel> extends Nx2Basic<STATE> {

  constructor(state?:STATE) {
    super(state);
      addNx2Class(this.state.deco, 'Nx2Panel');
  }

   protected onStateInitialized(state: STATE) {
      super.onStateInitialized(state);
   }

} // Nx2Panel