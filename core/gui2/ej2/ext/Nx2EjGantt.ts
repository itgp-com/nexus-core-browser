import {KeyboardEvents} from '@syncfusion/ej2-base';
import {
    ColumnMenu,
    ContextMenu,
    CriticalPath,
    DayMarkers,
    Edit,
    ExcelExport,
    Filter,
    Gantt,
    GanttModel,
    PdfExport,
    Reorder,
    Resize,
    RowDD,
    Selection,
    Sort,
    Toolbar,
    VirtualScroll
} from "@syncfusion/ej2-gantt";
import {ConnectorLineEdit} from '@syncfusion/ej2-gantt/src/gantt/actions/connector-line-edit';
import {Dependency} from '@syncfusion/ej2-gantt/src/gantt/actions/dependency';
import {FocusModule} from '@syncfusion/ej2-gantt/src/gantt/actions/keyboard';
import {TaskbarEdit} from '@syncfusion/ej2-gantt/src/gantt/actions/taskbar-edit';
import {DateProcessor} from '@syncfusion/ej2-gantt/src/gantt/base/date-processor';
import {GanttChart} from '@syncfusion/ej2-gantt/src/gantt/base/gantt-chart';
import {Splitter} from '@syncfusion/ej2-gantt/src/gantt/base/splitter';
import {GanttTreeGrid} from '@syncfusion/ej2-gantt/src/gantt/base/tree-grid';
import {ChartRows} from '@syncfusion/ej2-gantt/src/gantt/renderer/chart-rows';
import {ConnectorLine} from '@syncfusion/ej2-gantt/src/gantt/renderer/connector-line';
import {Timeline} from '@syncfusion/ej2-gantt/src/gantt/renderer/timeline';
import {Tooltip} from '@syncfusion/ej2-gantt/src/gantt/renderer/tooltip';
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


// From https://ej2.syncfusion.com/documentation/gantt/module/
Gantt.Inject(
    Dependency,
    ChartRows,
    ColumnMenu,
    ConnectorLine,
    ConnectorLineEdit,
    ContextMenu,
    CriticalPath,
    DateProcessor,
    DayMarkers,
    Edit,
    ExcelExport,
    Filter,
    FocusModule,
    GanttChart,
    GanttTreeGrid,
    KeyboardEvents,
    PdfExport,
    Reorder,
    Resize,
    RowDD,
    Selection,
    Sort,
    Splitter,
    TaskbarEdit,
    Timeline,
    Toolbar,
    Tooltip,
    VirtualScroll);

export interface StateNx2EjGanttRef extends StateNx2EjBasicRef {
    widget?: Nx2EjGantt;
}

export interface StateNx2EjGantt<WIDGET_LIBRARY_MODEL extends GanttModel = GanttModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjGanttRef;
}

export class Nx2EjGantt<STATE extends StateNx2EjGantt = StateNx2EjGantt> extends Nx2EjBasic<STATE, Gantt> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjGantt');
    }

    createEjObj(): void {
        this.obj = new Gantt(this.state.ej);
    }



}