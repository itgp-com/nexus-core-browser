import {Nx2Basic, StateNx2Basic} from '../../Nx2Basic';
import {addNx2Class} from '../../Nx2HtmlDecorator';


export interface StateNx2Badge extends StateNx2Basic {

} // state class

/**
 * This class does not have a JavaScript component, but it does use Ej2 styling under the e-badge-xxxxx classes
 */
export class Nx2EjBadge<STATE extends StateNx2Badge = StateNx2Badge> extends Nx2Basic<STATE> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjBadge');
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'span';
        addNx2Class(state.deco, 'e-badge');
        super.onStateInitialized(state);
    }

} // main class