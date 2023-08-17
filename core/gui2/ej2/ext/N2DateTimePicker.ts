import {DateTimePicker, DateTimePickerModel} from '@syncfusion/ej2-calendars';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2DateTimePickerRef extends StateN2EjBasicRef {
    widget?: N2DateTimePicker;
}

export interface StateN2DateTimePicker extends StateN2EjBasic<DateTimePickerModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2DateTimePickerRef;
} // state class

export class N2DateTimePicker<STATE extends StateN2DateTimePicker = StateN2DateTimePicker> extends N2EjBasic<STATE, DateTimePicker> {
    static readonly CLASS_IDENTIFIER: string = 'N2DateTimePicker'

    constructor(state ?: STATE) {
        super(state);
        addN2Class(this.state.deco, N2DateTimePicker.CLASS_IDENTIFIER);
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new DateTimePicker(this.state.ej);
    }

    get classIdentifier() { return N2DateTimePicker.CLASS_IDENTIFIER; }


} // main class