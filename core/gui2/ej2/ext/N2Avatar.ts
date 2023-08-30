import {N2Basic, StateN2Basic} from '../../N2Basic';
import {addN2Class} from '../../N2HtmlDecorator';


export interface StateN2Avatar extends StateN2Basic {

} // state class

/**
 * This class does not have a JavaScript component, but it does use Ej2 styling under the e-avatar-xxxxx classes
 */
export class N2Avatar<STATE extends StateN2Avatar = StateN2Avatar> extends N2Basic<STATE> {
    static readonly CLASS_IDENTIFIER: string = 'N2Avatar'

    constructor(state ?: STATE) {
        super(state);
    }

    onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2Avatar.CLASS_IDENTIFIER, 'e-avatar');
        state.deco.tag = 'span';
        super.onStateInitialized(state);
    }


    get classIdentifier(): string { return N2Avatar.CLASS_IDENTIFIER; }
} // main class