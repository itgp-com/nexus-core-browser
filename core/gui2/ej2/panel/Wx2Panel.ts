import {Ax2Standard, StateAx2Standard} from "../../Ax2Standard";

export interface StateWx2Panel extends StateAx2Standard {
}

export class Wx2Panel extends Ax2Standard {

  protected constructor(state:StateWx2Panel) {
    super(state);
  }

   protected async _initialSetup(state: StateWx2Panel) {
      await super._initialSetup(state);
   }
} // Wx2Panel