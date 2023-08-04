import {TimePicker, TimePickerModel} from "@syncfusion/ej2-calendars";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjTimePickerRef extends StateNx2EjBasicRef {
    widget?: Nx2EjTimePicker;
}

export interface StateNx2EjTimePicker extends StateNx2EjBasic<TimePickerModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjTimePickerRef;
} // state class

export class Nx2EjTimePicker<STATE extends StateNx2EjTimePicker = StateNx2EjTimePicker> extends Nx2EjBasic<STATE, TimePicker> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjTimePicker');
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new TimePicker(this.state.ej);
    }



} // main class