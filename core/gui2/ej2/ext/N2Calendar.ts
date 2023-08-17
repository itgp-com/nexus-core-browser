import {KeyboardEvents} from '@syncfusion/ej2-base';
import {Calendar, CalendarModel} from '@syncfusion/ej2-calendars';
import {Islamic} from '@syncfusion/ej2-calendars/src/calendar';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


Calendar.Inject(Islamic, KeyboardEvents)

export interface StateN2CalendarRef extends StateN2EjBasicRef {
    widget?: N2Calendar;
}

export interface StateN2Calendar<WIDGET_LIBRARY_MODEL extends CalendarModel = CalendarModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2CalendarRef;
}

export class N2Calendar<STATE extends StateN2Calendar = StateN2Calendar> extends N2EjBasic<STATE, Calendar> {
    static readonly CLASS_IDENTIFIER:string = 'N2Calendar'
    constructor(state ?: STATE) {
        super(state);
        addN2Class(this.state.deco, N2Calendar.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new Calendar(this.state.ej);
    }

    get classIdentifier() {
        return N2Calendar.CLASS_IDENTIFIER;
    }

}