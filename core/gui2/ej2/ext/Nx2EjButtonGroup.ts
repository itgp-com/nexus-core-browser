import {Nx2Basic, StateNx2Basic} from '../../Nx2Basic';
import {addNx2Class} from '../../Nx2HtmlDecorator';


export interface StateNx2ButtonGroup extends StateNx2Basic {

} // state class

/**
 * This class does not have a JavaScript component, but it does use Ej2 styling under the e-buttonGroup-xxxxx classes
 */
export class Nx2EjButtonGroup<STATE extends StateNx2ButtonGroup = StateNx2ButtonGroup> extends Nx2Basic<STATE> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjButtonGroup');
    }

    onStateInitialized(state: STATE) {
        addNx2Class(state.deco, 'e-btn-group');
        super.onStateInitialized(state);
    }

} // main class