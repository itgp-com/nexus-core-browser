export interface StateN2SwitchRef extends StateN2EjBasicRef {
    widget?: N2Switch;
}

export interface StateN2Switch extends StateN2EjBasic<SwitchModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2SwitchRef;
} // state class

export class N2Switch<STATE extends StateN2Switch = StateN2Switch> extends N2EjBasic<STATE, Switch> {
    static readonly CLASS_IDENTIFIER: string = 'N2Switch';

    constructor(state ?: STATE) {
        super(state);
    }

    onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2Switch.CLASS_IDENTIFIER);
        state.deco.tag = 'input';
        state.deco.otherAttr['type'] = 'checkbox';
        if (!state.wrapper) {
            state.wrapper = {}; // must have a wrapper or else EJ2 will not work
        }
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new Switch(this.state.ej);
    }

    get classIdentifier(): string { return N2Switch.CLASS_IDENTIFIER; }

} // N2Switch

import {Switch, SwitchModel} from '@syncfusion/ej2-buttons';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';