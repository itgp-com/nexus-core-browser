import {Nx2Basic, StateNx2Basic} from '../../Nx2Basic';
import {addNx2Class} from '../../Nx2HtmlDecorator';


export interface StateNx2Avatar extends StateNx2Basic {

} // state class

/**
 * This class does not have a JavaScript component, but it does use Ej2 styling under the e-avatar-xxxxx classes
 */
export class Nx2EjAvatar<STATE extends StateNx2Avatar = StateNx2Avatar> extends Nx2Basic<STATE> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjAvatar');
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'span';
        addNx2Class(state.deco, 'e-avatar');
        super.onStateInitialized(state);
    }

} // main class