
export interface StateN2TextAreaRef extends StateN2EjBasicRef {
    widget?: N2TextArea;
}

export interface StateN2TextArea extends StateN2EjBasic<TextAreaModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2TextAreaRef;
} // state class

export class N2TextArea<STATE extends StateN2TextArea = StateN2TextArea> extends N2EjBasic<STATE, TextArea> {
    static readonly CLASS_IDENTIFIER: string = 'N2TextArea';

    constructor(state ?: STATE) {
        super(state);
    }

    onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2TextArea.CLASS_IDENTIFIER);
        state.deco.tag = 'textarea';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new TextArea(this.state.ej);
    }

    get classIdentifier(): string { return N2TextArea.CLASS_IDENTIFIER; }

} // main class

import {TextArea, TextAreaModel} from '@syncfusion/ej2-inputs';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';