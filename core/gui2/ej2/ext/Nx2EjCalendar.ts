import {Calendar, CalendarModel} from "@syncfusion/ej2-calendars";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjCalendarRef extends StateNx2EjBasicRef {
    widget?: Nx2EjCalendar;
}

export interface StateNx2EjCalendar<WIDGET_LIBRARY_MODEL extends CalendarModel = CalendarModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjCalendarRef;
}

export class Nx2EjCalendar<STATE extends StateNx2EjCalendar = StateNx2EjCalendar> extends Nx2EjBasic<STATE, Calendar> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjCalendar');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Calendar(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}