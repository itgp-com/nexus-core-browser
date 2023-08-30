import {DatePicker, DatePickerModel} from '@syncfusion/ej2-calendars';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2DatePickerRef extends StateN2EjBasicRef {
    widget?: N2DatePicker;
}

export interface StateN2DatePicker extends StateN2EjBasic<DatePickerModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2DatePickerRef;
} // state class

export class N2DatePicker<STATE extends StateN2DatePicker = StateN2DatePicker> extends N2EjBasic<STATE, DatePicker> {
    static readonly CLASS_IDENTIFIER: string = 'N2DatePicker'

    constructor(state ?: STATE) {
        super(state);
    }

    onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2DatePicker.CLASS_IDENTIFIER);
        state.deco.tag = 'input';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new DatePicker(this.state.ej);
    }

    get classIdentifier() { return N2DatePicker.CLASS_IDENTIFIER; }


} // main class