import {SpeedDial, SpeedDialModel} from '@syncfusion/ej2-buttons';
import {StringArg, stringArgVal} from '../../../BaseUtils';
import {N2Evt_OnLogic} from '../../N2';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2SpeedDialRef extends StateN2EjBasicRef {
    widget?: N2SpeedDial;
}

export interface StateN2SpeedDial extends StateN2EjBasic<SpeedDialModel> {

    /**
     * function or string yielding the text or HTML that will overwrite the 'content' value of the SpeedDialModel
     */
    label?: StringArg;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2SpeedDialRef;
}

export class N2SpeedDial<STATE extends StateN2SpeedDial = StateN2SpeedDial> extends N2EjBasic<STATE, SpeedDial> {
    static readonly CLASS_IDENTIFIER: string = 'N2SpeedDial';

    constructor(state ?: STATE) {
        super(state);
        addN2Class(this.state.deco, N2SpeedDial.CLASS_IDENTIFIER);
    }


    onStateInitialized(state: STATE) {
        state.deco.tag = 'button';
        super.onStateInitialized(state);
    }

    onLogic(ev: N2Evt_OnLogic) {
        let state = this.state;
        if (state.label)
            state.ej.content = stringArgVal(state.label); // SpeedDial content label/ html

        super.onLogic(ev);


    }

    createEjObj(): void {
        this.obj = new SpeedDial(this.state.ej);
    }

    get classIdentifier(): string { return N2SpeedDial.CLASS_IDENTIFIER; }

}