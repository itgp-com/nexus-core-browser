import {TimePicker, TimePickerModel} from '@syncfusion/ej2-calendars';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2TimePickerRef extends StateN2EjBasicRef {
    widget?: N2TimePicker;
}

export interface StateN2TimePicker extends StateN2EjBasic<TimePickerModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2TimePickerRef;
} // state class

export class N2TimePicker<STATE extends StateN2TimePicker = StateN2TimePicker> extends N2EjBasic<STATE, TimePicker> {
    static readonly CLASS_IDENTIFIER: string = 'N2TimePicker';

    constructor(state ?: STATE) {
        super(state);
    }

    onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2TimePicker.CLASS_IDENTIFIER);
        state.deco.tag = 'input';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new TimePicker(this.state.ej);
    }

    get classIdentifier(): string { return N2TimePicker.CLASS_IDENTIFIER; }

} // main class