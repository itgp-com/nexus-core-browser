import {DropDownButton, DropDownButtonModel} from '@syncfusion/ej2-splitbuttons';
import {StringArg, stringArgVal} from '../../../BaseUtils';
import {N2Evt_OnLogic} from '../../N2';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2DropDownButtonRef extends StateN2EjBasicRef {
    widget?: N2DropDownButton;
}

export interface StateN2DropDownButton extends StateN2EjBasic<DropDownButtonModel> {

    /**
     * function or string yielding the text or HTML that will overwrite the 'content' value of the DropDownButtonModel
     */
    label?: StringArg;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2DropDownButtonRef;
}

export class N2DropDownButton<STATE extends StateN2DropDownButton = StateN2DropDownButton> extends N2EjBasic<STATE, DropDownButton> {
    static readonly CLASS_IDENTIFIER: string = 'N2DropDownButton'

    constructor(state ?: STATE) {
        super(state);
        addN2Class(this.state.deco, N2DropDownButton.CLASS_IDENTIFIER);
    }


    onStateInitialized(state: STATE) {
        state.deco.tag = 'button';
        super.onStateInitialized(state);
    }

    onLogic(ev: N2Evt_OnLogic) {
        let state = this.state;
        if (state.label)
            state.ej.content = stringArgVal(state.label); // DropDownButton content label/ html

        super.onLogic(ev);
    }

    createEjObj(): void {
        this.obj = new DropDownButton(this.state.ej);
    }

    get classIdentifier() { return N2DropDownButton.CLASS_IDENTIFIER; }


}