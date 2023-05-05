import {DateTimePicker, DateTimePickerModel} from "@syncfusion/ej2-calendars";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjDateTimePickerRef extends StateNx2EjBasicRef {
    widget?: Nx2EjDateTimePicker;
}

export interface StateNx2EjDateTimePicker extends StateNx2EjBasic<DateTimePickerModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjDateTimePickerRef;
} // state class

export class Nx2EjDateTimePicker<STATE extends StateNx2EjDateTimePicker = StateNx2EjDateTimePicker> extends Nx2EjBasic<STATE, DateTimePicker> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjDateTimePicker');
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        super.onStateInitialized(state);
    }

    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new DateTimePicker(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor);

    }
} // main class