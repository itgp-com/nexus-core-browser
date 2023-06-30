import {KeyboardEvents} from '@syncfusion/ej2-base';
import {ColumnChooser, Data} from '@syncfusion/ej2-grids';
import {TreeGrid, TreeGridModel} from "@syncfusion/ej2-treegrid";
import {TreeClipboard} from '@syncfusion/ej2-treegrid/src/treegrid/actions/clipboard';
import {ColumnMenu} from '@syncfusion/ej2-treegrid/src/treegrid/actions/column-menu';
import {ContextMenu} from '@syncfusion/ej2-treegrid/src/treegrid/actions/context-menu';
import {DetailRow} from '@syncfusion/ej2-treegrid/src/treegrid/actions/detail-row';
import {Edit} from '@syncfusion/ej2-treegrid/src/treegrid/actions/edit';
import {ExcelExport} from '@syncfusion/ej2-treegrid/src/treegrid/actions/excel-export';
import {Filter} from '@syncfusion/ej2-treegrid/src/treegrid/actions/filter';
import {Freeze} from '@syncfusion/ej2-treegrid/src/treegrid/actions/freeze-column';
import {Page} from '@syncfusion/ej2-treegrid/src/treegrid/actions/page';
import {PdfExport} from '@syncfusion/ej2-treegrid/src/treegrid/actions/pdf-export';
import {Print} from '@syncfusion/ej2-treegrid/src/treegrid/actions/print';
import {Reorder} from '@syncfusion/ej2-treegrid/src/treegrid/actions/reorder';
import {Resize} from '@syncfusion/ej2-treegrid/src/treegrid/actions/resize';
import {RowDD} from '@syncfusion/ej2-treegrid/src/treegrid/actions/rowdragdrop';
import {Selection as TreeGridSelection} from '@syncfusion/ej2-treegrid/src/treegrid/actions/selection';
import {Sort} from '@syncfusion/ej2-treegrid/src/treegrid/actions/sort';
import {Aggregate} from '@syncfusion/ej2-treegrid/src/treegrid/actions/summary';
import {Toolbar} from '@syncfusion/ej2-treegrid/src/treegrid/actions/toolbar';
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


TreeGrid.Inject(
    Aggregate,
    ColumnChooser,
    ColumnMenu,
    ContextMenu,
    Data,
    DetailRow,
    Edit,
    ExcelExport,
    Filter,
    Freeze,
    KeyboardEvents,
    Page,
    PdfExport,
    Print,
    Reorder,
    Resize,
    RowDD,
    Sort,
    Toolbar,
    TreeClipboard,
    TreeGridSelection,
);

export interface StateNx2EjTreeGridRef extends StateNx2EjBasicRef {
  widget ?: Nx2EjTreeGrid;
}

export interface StateNx2EjTreeGrid<WIDGET_LIBRARY_MODEL extends TreeGridModel = TreeGridModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateNx2EjTreeGridRef;
}

export class Nx2EjTreeGrid<STATE extends StateNx2EjTreeGrid = StateNx2EjTreeGrid> extends Nx2EjBasic<STATE,TreeGrid> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjTreeGrid');
    }

    protected createEjObj(): void {
        this.obj = new TreeGrid(this.state.ej);
    }

    protected appendEjToHtmlElement(): void {
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }

}