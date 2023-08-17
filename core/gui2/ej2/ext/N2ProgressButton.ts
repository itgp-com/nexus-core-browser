import {ProgressButton, ProgressButtonModel} from '@syncfusion/ej2-splitbuttons';
import {StringArg, stringArgVal} from '../../../BaseUtils';
import {N2Evt_OnLogic} from '../../N2';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2ProgressButtonRef extends StateN2EjBasicRef {
    widget?: N2ProgressButton;
}

export interface StateN2ProgressButton extends StateN2EjBasic<ProgressButtonModel> {

    /**
     * function or string yielding the text or HTML that will overwrite the 'content' value of the ProgressButtonModel
     */
    label?: StringArg;

    /**
     * implement the onClick behavior of the button
     */
    onclick?: (ev: MouseEvent) => void;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ProgressButtonRef;
}

export class N2ProgressButton<STATE extends StateN2ProgressButton = StateN2ProgressButton> extends N2EjBasic<STATE, ProgressButton> {
    static readonly CLASS_IDENTIFIER: string = 'N2ProgressButton';

    constructor(state ?: STATE) {
        super(state);
        addN2Class(this.state.deco, N2ProgressButton.CLASS_IDENTIFIER);
    }


    onStateInitialized(state: STATE) {
        state.deco.tag = 'button';
        super.onStateInitialized(state);
    }

    onLogic(ev: N2Evt_OnLogic) {
        let state = this.state;
        if (state.label)
            state.ej.content = stringArgVal(state.label); // ProgressButton content label/ html

        super.onLogic(ev);

        // attach the onclick event to the htmlElementAnchor
        if (this.state.onclick)
            this.htmlElementAnchor.onclick = this.state.onclick;

    }

    createEjObj(): void {
        this.obj = new ProgressButton(this.state.ej);
    }

    get classIdentifier(): string { return N2ProgressButton.CLASS_IDENTIFIER; }

}