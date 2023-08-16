import {Nx2Basic, StateNx2Basic} from '../../Nx2Basic';
import {addNx2Class} from '../../Nx2HtmlDecorator';


export interface StateN2Badge extends StateNx2Basic {

} // state class

/**
 * This class does not have a JavaScript component, but it does use Ej2 styling under the e-badge-xxxxx classes
 */
export class N2Badge<STATE extends StateN2Badge = StateN2Badge> extends Nx2Basic<STATE> {
    static readonly CLASS_IDENTIFIER:string = "N2Badge"
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco,  N2Badge.CLASS_IDENTIFIER, 'e-badge');
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'span';
        super.onStateInitialized(state);
    }
    get classIdentifier() {
        return N2Badge.CLASS_IDENTIFIER;
    }

} // main class