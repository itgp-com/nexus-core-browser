import {DatePicker, DatePickerModel} from "@syncfusion/ej2-calendars";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2DatePickerRef extends StateNx2EjBasicRef {
    widget?: N2DatePicker;
}

export interface StateN2DatePicker extends StateNx2EjBasic<DatePickerModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2DatePickerRef;
} // state class

export class N2DatePicker<STATE extends StateN2DatePicker = StateN2DatePicker> extends Nx2EjBasic<STATE, DatePicker> {
    static readonly CLASS_IDENTIFIER: string = "N2DatePicker"

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2DatePicker.CLASS_IDENTIFIER);
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new DatePicker(this.state.ej);
    }

    get classIdentifier() { return N2DatePicker.CLASS_IDENTIFIER; }


} // main class