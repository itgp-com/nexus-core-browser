import {DateRangePicker, DateRangePickerModel} from "@syncfusion/ej2-calendars";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjDateRangePickerRef extends StateNx2EjBasicRef {
    widget?: Nx2EjDateRangePicker;
}

export interface StateNx2EjDateRangePicker extends StateNx2EjBasic<DateRangePickerModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjDateRangePickerRef;
} // state class

export class Nx2EjDateRangePicker<STATE extends StateNx2EjDateRangePicker = StateNx2EjDateRangePicker> extends Nx2EjBasic<STATE, DateRangePicker> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjDateRangePicker');
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        super.onStateInitialized(state);
    }

    protected createEjObj(): void {
        this.obj = new DateRangePicker(this.state.ej);
    }

    protected appendEjToHtmlElement(): void {
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }

} // main class