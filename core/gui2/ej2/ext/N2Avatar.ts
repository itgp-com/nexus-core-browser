import {Nx2Basic, StateNx2Basic} from '../../Nx2Basic';
import {addNx2Class} from '../../Nx2HtmlDecorator';


export interface StateN2Avatar extends StateNx2Basic {

} // state class

/**
 * This class does not have a JavaScript component, but it does use Ej2 styling under the e-avatar-xxxxx classes
 */
export class N2Avatar<STATE extends StateN2Avatar = StateN2Avatar> extends Nx2Basic<STATE> {
    static readonly CLASS_IDENTIFIER: string = "N2Avatar"

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2Avatar.CLASS_IDENTIFIER, 'e-avatar');
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'span';
        super.onStateInitialized(state);
    }


    get classIdentifier(): string { return N2Avatar.CLASS_IDENTIFIER; }
} // main class