import {Agenda, Day, Month, Schedule, ScheduleModel, Week, WorkWeek} from "@syncfusion/ej2-schedule";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

Schedule.Inject(Agenda, Day, Month, Week, WorkWeek);

export interface StateNx2EjScheduleRef extends StateNx2EjBasicRef {
    widget?: Nx2EjSchedule;
}

export interface StateNx2EjSchedule<WIDGET_LIBRARY_MODEL extends ScheduleModel = ScheduleModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjScheduleRef;
}

export class Nx2EjSchedule<STATE extends StateNx2EjSchedule = StateNx2EjSchedule> extends Nx2EjBasic<STATE, Schedule> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjSchedule');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Schedule(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}