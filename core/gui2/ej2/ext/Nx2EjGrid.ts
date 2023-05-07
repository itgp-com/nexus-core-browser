import {KeyboardEvents} from '@syncfusion/ej2-base';
import {Query} from '@syncfusion/ej2-data';
import {Grid, GridModel} from "@syncfusion/ej2-grids";
import {Clipboard} from '@syncfusion/ej2-grids/src/grid/actions/clipboard';
import {ColumnChooser} from '@syncfusion/ej2-grids/src/grid/actions/column-chooser';
import {ColumnMenu} from '@syncfusion/ej2-grids/src/grid/actions/column-menu';
import {ContextMenu} from '@syncfusion/ej2-grids/src/grid/actions/context-menu';
import {Data} from '@syncfusion/ej2-grids/src/grid/actions/data';
import {DetailRow} from '@syncfusion/ej2-grids/src/grid/actions/detail-row';
import {Edit} from '@syncfusion/ej2-grids/src/grid/actions/edit';
import {ExcelExport} from '@syncfusion/ej2-grids/src/grid/actions/excel-export';
import {Filter} from '@syncfusion/ej2-grids/src/grid/actions/filter';
import {Group} from '@syncfusion/ej2-grids/src/grid/actions/group';
import {InfiniteScroll} from '@syncfusion/ej2-grids/src/grid/actions/infinite-scroll';
import {Page} from '@syncfusion/ej2-grids/src/grid/actions/page';
import {PdfExport} from '@syncfusion/ej2-grids/src/grid/actions/pdf-export';
import {Print} from '@syncfusion/ej2-grids/src/grid/actions/print';
import {Reorder} from '@syncfusion/ej2-grids/src/grid/actions/reorder';
import {Resize} from '@syncfusion/ej2-grids/src/grid/actions/resize';
import {RowDD} from '@syncfusion/ej2-grids/src/grid/actions/row-reorder';
import {Scroll} from '@syncfusion/ej2-grids/src/grid/actions/scroll';
import {Search} from '@syncfusion/ej2-grids/src/grid/actions/search';
import {Selection} from '@syncfusion/ej2-grids/src/grid/actions/selection';
import {Toolbar} from '@syncfusion/ej2-grids/src/grid/actions/toolbar';
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

Grid.Inject(
    Clipboard,
    ColumnChooser,
    ColumnMenu,
    ContextMenu,
    DetailRow,
    Edit,
    ExcelExport,
    Filter,
    Group,
    InfiniteScroll,
    KeyboardEvents,
    Page,
    PdfExport,
    Print,
    Reorder,
    Resize,
    RowDD,
    Scroll,
    Search,
    Selection,
    Toolbar,
);
export interface StateNx2EjGridRef extends StateNx2EjBasicRef {
  widget ?: Nx2EjGrid;
}

export interface StateNx2EjGrid<WIDGET_LIBRARY_MODEL extends GridModel = GridModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateNx2EjGridRef;
}

export class Nx2EjGrid<STATE extends StateNx2EjGrid = StateNx2EjGrid> extends Nx2EjBasic<STATE,Grid> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjGrid');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Grid(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }

    /**
     * The function is used to generate updated Query from Grid model.
     *
     * @param {boolean} skipPage - specifies the boolean to skip the page
     * @param {boolean} isAutoCompleteCall - specifies for auto complete call
     * @returns {Query} returns the Query or null if not initialized
     */
    generateQuery(skipPage?: boolean, isAutoCompleteCall?: boolean): Query {
        if ( !this.obj)
            return null;
        return new Data(this.obj).generateQuery(skipPage, isAutoCompleteCall);
    } // generateQuery
}