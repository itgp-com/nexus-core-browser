import {N2Basic, StateN2Basic, StateN2BasicRef} from "../N2Basic";
import {addN2Class} from '../N2HtmlDecorator';


export interface StateN2PanelRef extends StateN2BasicRef {
    widget?: N2Panel;
}

export interface StateN2Panel extends StateN2Basic {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2PanelRef;
}

export class N2Panel<STATE extends StateN2Panel = StateN2Panel> extends N2Basic<STATE> {
    static readonly CLASS_IDENTIFIER: string = 'N2Panel';

    constructor(state?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2Panel.CLASS_IDENTIFIER);
        super.onStateInitialized(state);
    }

} // N2Panel