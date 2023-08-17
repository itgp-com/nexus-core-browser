import {N2Basic, StateN2Basic} from '../../N2Basic';
import {addN2Class} from '../../N2HtmlDecorator';


export interface StateN2ButtonGroup extends StateN2Basic {

} // state class

/**
 * This class does not have a JavaScript component, but it does use Ej2 styling under the e-buttonGroup-xxxxx classes
 */
export class N2ButtonGroup<STATE extends StateN2ButtonGroup = StateN2ButtonGroup> extends N2Basic<STATE> {
    static readonly CLASS_IDENTIFIER:string = 'N2ButtonGroup'
    constructor(state ?: STATE) {
        super(state);
        addN2Class(this.state.deco, N2ButtonGroup.CLASS_IDENTIFIER, 'e-btn-group');
    }

    get classIdentifier() { return N2ButtonGroup.CLASS_IDENTIFIER; }
} // main class