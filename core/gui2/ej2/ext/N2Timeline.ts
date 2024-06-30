
export interface StateN2TimelineRef extends StateN2EjBasicRef {
    widget?: N2Timeline;
}

export interface StateN2Timeline extends StateN2EjBasic<TimelineModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2TimelineRef;
} // state class

export class N2Timeline<STATE extends StateN2Timeline = StateN2Timeline> extends N2EjBasic<STATE, Timeline> {
    static readonly CLASS_IDENTIFIER: string = 'N2Timeline';

    constructor(state ?: STATE) {
        super(state);
    }

    onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2Timeline.CLASS_IDENTIFIER);
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new Timeline(this.state.ej);
    }

    get classIdentifier(): string { return N2Timeline.CLASS_IDENTIFIER; }

} // main class

import {Timeline, TimelineModel} from '@syncfusion/ej2-layouts';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';