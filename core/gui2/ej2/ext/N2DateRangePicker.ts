import {DateRangePicker, DateRangePickerModel} from "@syncfusion/ej2-calendars";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2DateRangePickerRef extends StateNx2EjBasicRef {
    widget?: N2DateRangePicker;
}

export interface StateN2DateRangePicker extends StateNx2EjBasic<DateRangePickerModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2DateRangePickerRef;
} // state class

export class N2DateRangePicker<STATE extends StateN2DateRangePicker = StateN2DateRangePicker> extends Nx2EjBasic<STATE, DateRangePicker> {
    static readonly CLASS_IDENTIFIER: string = "N2DateRangePicker"

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2DateRangePicker.CLASS_IDENTIFIER);
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new DateRangePicker(this.state.ej);
    }

    get classIdentifier() { return N2DateRangePicker.CLASS_IDENTIFIER; }


} // main class