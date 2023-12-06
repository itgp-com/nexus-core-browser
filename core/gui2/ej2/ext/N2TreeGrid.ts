import {KeyboardEvents} from '@syncfusion/ej2-base';
import {ColumnChooser, Data, ExcelQueryCellInfoEventArgs} from '@syncfusion/ej2-grids';
import {TreeGrid, TreeGridModel} from '@syncfusion/ej2-treegrid';
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
import {isFunction} from 'lodash';
import {addN2Class} from '../../N2HtmlDecorator';
import {ThemeChangeEvent, themeChangeListeners} from '../../Theming';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';
import {cssForN2Grid} from './N2Grid';


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

export interface StateN2TreeGridRef extends StateN2EjBasicRef {
    widget?: N2TreeGrid;
}

export interface StateN2TreeGrid<WIDGET_LIBRARY_MODEL extends TreeGridModel = TreeGridModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2TreeGridRef;

    /**
     * Defaults to false (apply formatter function from column to excel export)
     * If true, the excelQueryCellInfo event will not call any formatter functions when exporting
     * If false, the excelQueryCellInfo event will call the formatter function and set the value to the result of the formatter
     */
    disableExcelAutoFormater?: boolean;
}

export class N2TreeGrid<STATE extends StateN2TreeGrid = StateN2TreeGrid> extends N2EjBasic<STATE, TreeGrid> {
    static readonly CLASS_IDENTIFIER: string = 'N2TreeGrid';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2TreeGrid.CLASS_IDENTIFIER);

        if (state.disableExcelAutoFormater) {
            // do nothing
        } else {
            try {
                let existingExcelQueryCellInfo = state.ej.excelQueryCellInfo;

                state.ej.excelQueryCellInfo = (args: ExcelQueryCellInfoEventArgs) => {
                    try {
                        let formatter: any = args.column.formatter;
                        if (formatter && isFunction(formatter)) {
                            args.value = formatter(args.column, args.data);
                        } // if formatter

                        if (existingExcelQueryCellInfo) {
                            existingExcelQueryCellInfo.caller(this, args);
                        } // if existingExcelQueryCellInfo

                    } catch (e) { console.error(e); }
                } // excelQueryCellInfo
            } catch (e) { console.error(e); }
        }

        super.onStateInitialized(state)
    }


    createEjObj(): void {
        this.obj = new TreeGrid(this.state.ej);
    }

    get classIdentifier(): string { return N2TreeGrid.CLASS_IDENTIFIER; }
} //N2TreeGrid

themeChangeListeners().add((ev: ThemeChangeEvent) => {
    cssForN2Grid(N2TreeGrid.CLASS_IDENTIFIER, 'e-treegrid');
}); // normal priority