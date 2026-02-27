export interface StateN2ScheduleRef extends StateN2EjBasicRef {
    widget?: N2Schedule;
}

export interface StateN2Schedule<WIDGET_LIBRARY_MODEL extends ScheduleModel = ScheduleModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ScheduleRef;
}

export class N2Schedule<STATE extends StateN2Schedule = StateN2Schedule> extends N2EjBasic<STATE, Schedule> {
    static readonly CLASS_IDENTIFIER: string = 'N2Schedule';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2Schedule.CLASS_IDENTIFIER);
        super.onStateInitialized(state);
    }


    createEjObj(): void {
        this.obj = new Schedule(this.state.ej);
    }

    get classIdentifier(): string {
        return N2Schedule.CLASS_IDENTIFIER;
    }

} // N2Schedule

import {
    Agenda,
    Day,
    DragAndDrop,
    ExcelExport,
    HeaderRenderer,
    ICalendarExport,
    ICalendarImport,
    Month,
    MonthAgenda,
    Print,
    Resize,
    RecurrenceEditor,
    Schedule,
    ScheduleModel,
    TimelineMonth,
    TimelineViews,
    TimelineYear,
    Week,
    WorkWeek,
    Year,
} from '@syncfusion/ej2-schedule';

import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';

Schedule.Inject(

    Day,
    Week,
    WorkWeek,
    Month,
    Year,
    Agenda,
    MonthAgenda,
    TimelineViews,
    TimelineMonth,
    TimelineYear,

    DragAndDrop,

    Resize,
    ExcelExport,

    ICalendarExport,
    ICalendarImport,

    Print
);