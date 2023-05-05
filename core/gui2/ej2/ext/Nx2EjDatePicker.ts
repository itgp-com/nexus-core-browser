import {DatePicker, DatePickerModel} from "@syncfusion/ej2-calendars";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjDatePickerRef extends StateNx2EjBasicRef {
    widget?: Nx2EjDatePicker;
}

export interface StateNx2EjDatePicker extends StateNx2EjBasic<DatePickerModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjDatePickerRef;
} // state class

export class Nx2EjDatePicker<STATE extends StateNx2EjDatePicker = StateNx2EjDatePicker> extends Nx2EjBasic<STATE, DatePicker> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjDatePicker');
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        super.onStateInitialized(state);
    }

    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new DatePicker(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor);

    }
} // main class