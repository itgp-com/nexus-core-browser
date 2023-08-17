import {Agenda, Day, Month, Schedule, ScheduleModel, Week, WorkWeek} from '@syncfusion/ej2-schedule';
import {Resize} from '@syncfusion/ej2-schedule/src/schedule/actions/resize';
import {Scroll} from '@syncfusion/ej2-schedule/src/schedule/actions/scroll';
import {InlineEdit} from '@syncfusion/ej2-schedule/src/schedule/event-renderer/inline-edit';
import {ICalendarExport} from '@syncfusion/ej2-schedule/src/schedule/exports/calendar-export';
import {ICalendarImport} from '@syncfusion/ej2-schedule/src/schedule/exports/calendar-import';
import {ExcelExport} from '@syncfusion/ej2-schedule/src/schedule/exports/excel-export';
import {Print} from '@syncfusion/ej2-schedule/src/schedule/exports/print';
import {HeaderRenderer} from '@syncfusion/ej2-schedule/src/schedule/renderer/header-renderer';
import {MonthAgenda} from '@syncfusion/ej2-schedule/src/schedule/renderer/month-agenda';
import {TimelineMonth} from '@syncfusion/ej2-schedule/src/schedule/renderer/timeline-month';
import {TimelineViews} from '@syncfusion/ej2-schedule/src/schedule/renderer/timeline-view';
import {TimelineYear} from '@syncfusion/ej2-schedule/src/schedule/renderer/timeline-year';
import {Year} from '@syncfusion/ej2-schedule/src/schedule/renderer/year';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';

Schedule.Inject(
    Agenda,
    Day,
    ExcelExport,
    HeaderRenderer,
    ICalendarExport,
    ICalendarImport,
    InlineEdit,
    Month,
    MonthAgenda,
    Print,
    Resize,
    Scroll,
    TimelineMonth,
    TimelineViews,
    TimelineYear,
    Week,
    WorkWeek,
    Year,
);

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
        addN2Class(this.state.deco, N2Schedule.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new Schedule(this.state.ej);
    }

    get classIdentifier(): string { return N2Schedule.CLASS_IDENTIFIER; }

}