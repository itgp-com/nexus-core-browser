import {DateTimePicker, DateTimePickerModel} from "@syncfusion/ej2-calendars";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2DateTimePickerRef extends StateNx2EjBasicRef {
    widget?: N2DateTimePicker;
}

export interface StateN2DateTimePicker extends StateNx2EjBasic<DateTimePickerModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2DateTimePickerRef;
} // state class

export class N2DateTimePicker<STATE extends StateN2DateTimePicker = StateN2DateTimePicker> extends Nx2EjBasic<STATE, DateTimePicker> {
    static readonly CLASS_IDENTIFIER: string = "N2DateTimePicker"

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2DateTimePicker.CLASS_IDENTIFIER);
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