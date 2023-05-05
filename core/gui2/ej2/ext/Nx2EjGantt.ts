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
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


// From https://ej2.syncfusion.com/documentation/gantt/module/
Gantt.Inject( ColumnMenu,
    ContextMenu,
    CriticalPath,
    DayMarkers,
    Edit,
    ExcelExport,
    Filter,
    PdfExport,
    Reorder,
    Resize,
    RowDD,
    Selection,
    Sort,
    Toolbar,
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


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Gantt(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}