import {EmitType, isNullOrUndefined} from '@syncfusion/ej2-base';
import {CrudOptions, DataManager, DataOptions, Query} from '@syncfusion/ej2-data';
import {DataResult} from '@syncfusion/ej2-data/src/adaptors';
import {ColumnModel, Filter, Grid, GridModel, QueryCellInfoEventArgs} from '@syncfusion/ej2-grids';
import {ExcelFilter} from '@syncfusion/ej2-grids/src/grid/actions/excel-filter';
import {ToolbarItem, ToolbarItems} from '@syncfusion/ej2-grids/src/grid/base/enum';
import {RowDataBoundEventArgs} from '@syncfusion/ej2-grids/src/grid/base/interface';
import {ExcelFilterBase} from '@syncfusion/ej2-grids/src/grid/common/excel-filter-base';
import {Column} from '@syncfusion/ej2-grids/src/grid/models/column';
import {ClickEventArgs, ItemModel} from '@syncfusion/ej2-navigations';
import {
    createElementParams,
    createSpinner,
    Dialog,
    hideSpinner,
    showSpinner,
    SpinnerArgs
} from '@syncfusion/ej2-popups';
import {TreeGridModel} from '@syncfusion/ej2-treegrid';
import * as _ from 'lodash';
import {CSS_CLASS_GRID_FILTER_MENU_PRESENT, CSS_CLASS_row_number_001} from '../../../scss/core';
import {EJINSTANCES} from '../../N2Ej';
import {N2Grid, StateN2Grid} from '../N2Grid';
import {isSpinnerCreated} from './Spinner_Options';

export let CHAR_WIDTH_PIXELS: number = 8;
export const COL_ROW_NUMBER: string = '__gridrownumber__';

export const rowColumn: ColumnModel = {
    field: COL_ROW_NUMBER,
    headerText: 'Row#',
    headerTextAlign: "Center",
    type: "number",
    textAlign: "Center",
    width: 9 * CHAR_WIDTH_PIXELS,
    allowFiltering: false,
    allowGrouping: false,
    allowSorting: false,
}

export function stateN2Grid_applyWx(state: StateN2Grid): void {

    _.merge(state, {
        ej: {
            allowSorting: true,
            allowMultiSorting: true,
            allowTextWrap: true,
            allowResizing: true,
            allowSelection: true,
            allowKeyboard: true,
            enableFilter: true,
            filterSettings: {
                type: 'FilterBar',
                showFilterBarStatus: true,
                enableCaseSensitivity: false,
                showFilterBarOperator: true,
                ignoreAccent: true,
                mode: 'Immediate',
                immediateModeDelay: 700,
            },
            // width: "100%",
        } as GridModel,
    });

    for (let i = 0; i < state.ej.columns.length; i++) {
        const col: string | Column | ColumnModel = state.ej.columns[i];
        if (col && (col as any)?.type) {
            if ((col as any).type === 'string') {
                (col as ColumnModel).filter = {operator: 'contains'};
            }
        }
    } // for


} // stateN2Grid_applyWx


export function stateN2Grid_excelExport(state: StateN2Grid, fnExcelExport: EmitType<ClickEventArgs>): void {
    _.merge(state, {
        ej: {
            allowExcelExport: true,
        } as GridModel,
    });

    let toolbar: (ToolbarItems | string | ItemModel | ToolbarItem)[] = state.ej.toolbar;
    if (!toolbar) {
        state.ej.toolbar = ['ExcelExport']; // always show the Excel Export button
    } else {
        if (_.isArray(toolbar)) {
            if (toolbar.indexOf('ExcelExport') === -1) {
                toolbar = toolbar.insert(0, 'ExcelExport'); // always show the Excel Export button first
                state.ej.toolbar = toolbar;
            }
        } else {
            // WTF??
            console.error('Cannot handle toolbar type: ' + typeof toolbar)
        }
    } // if (toolbar)

    let fnToolbar: Function = state.ej.toolbarClick;
    state.ej.toolbarClick = (ev: ClickEventArgs) => {


        let menuItemId: string = ev?.item?.id;

        switch (menuItemId) {
            case `${state.tagId}_excelexport`:
                if (fnExcelExport)
                    fnExcelExport(ev);
                else
                    state?.ref?.widget?.obj?.excelExport({}); // default export

                break;
            default:
                // For non-excel execute the original toolbarClick function if it exists
                try {
                    if (fnToolbar)
                        fnToolbar(ev);
                } catch (e) {
                    console.error(e);
                }
                break;

        } //switch

    } // toolbarClick

} // stateN2Grid_excelExport

export interface StateN2Grid_RowNumber_Options {
    pageRowNumberOnly?: boolean;
}

/**
 * Your grid must have a column with field = COL_ROW_NUMBER
 * @param {StateN2Grid} state
 * @param {StateN2Grid_RowNumber_Options} options
 */
export function stateN2Grid_RowNumber(state: StateN2Grid, options: StateN2Grid_RowNumber_Options = {}): void {
    let gridModel: GridModel = state?.ej;
    if (!gridModel)
        return; // nothing to do


    let pageRowNumberOnly: boolean = options?.pageRowNumberOnly; // false by default

    let grid: Grid = null;
    let fnCreated: EmitType<Event> = gridModel.created;
    gridModel.created = (ev: Object) => {
        if (ev)
            grid = ev as Grid; // needed for
        if (fnCreated)
            fnCreated(ev);
    } // created


    let rowNumberCell: HTMLElement;
    let fnQueryCellInfo: EmitType<QueryCellInfoEventArgs> = gridModel.queryCellInfo;
    gridModel.queryCellInfo = (qArgs: QueryCellInfoEventArgs) => {

        // let rec: GRID_TABLE.Rec = qArgs.data as GRID_TABLE.Rec;
        let field = qArgs.column.field;
        let cell: HTMLElement = qArgs.cell as HTMLElement;

        switch (field) {

            case COL_ROW_NUMBER:
                rowNumberCell = cell;
                break;


        } // switch

        if (fnQueryCellInfo)
            fnQueryCellInfo.call(gridModel, qArgs);

    } // queryCellInfo


    let fnRowDataBound: EmitType<RowDataBoundEventArgs> = gridModel.rowDataBound;
    gridModel.rowDataBound = (ev: RowDataBoundEventArgs) => {
        // noinspection JSUnusedAssignment
        let rowNumber: number = 0;

        let rowHTMLElem = ev.row as HTMLElement;
        let x = rowHTMLElem.getAttribute('aria-rowindex');// starts at 1
        let rowIndex = _.toNumber(x); // starts at 1
        if (gridModel.allowPaging && gridModel.pageSettings) {
            if (pageRowNumberOnly)
                rowNumber = rowIndex;
            else if (grid) {
                rowNumber = (grid.pageSettings.currentPage - 1) * grid.pageSettings.pageSize + rowIndex;
            } else {
                rowNumber = rowIndex;
            }
        } else {
            // not paged
            rowNumber = rowIndex;
        }

        if (rowNumber == 0) {
            rowNumberCell.innerText = '';
        } else {
            if (rowNumberCell) {
                rowNumberCell.innerText = rowNumber.toLocaleString();
                rowNumberCell.classList.add(CSS_CLASS_row_number_001); // gray font
            }
        }

        if (fnRowDataBound)
            fnRowDataBound.call(gridModel, ev);
    } // rowDataBound

} // stateN2Grid_RowNumber
/**
 * Interface for defining the options for the stateN2Grid_Spinner function.
 */
export interface stateN2Grid_Spinner_Options {
    /**
     * createSpinner function to use instead of the default.
     */
    fnCreateSpinner?: typeof createSpinner;
    /**
     * Define the target element for the spinner along with the other parameters.
     * If no target is specified, the spinner will be created in the grid's htmlElementAnchor.
     */
    spinnerArgs?: SpinnerArgs;
    /**
     * If you want to create the spinner in a different element than the centerContainer.
     */
    internalCreateElement?: createElementParams;
}

/**
 * Function to handle the spinner state for the N2Grid.
 * @param {StateN2Grid} state - The state of the N2Grid.
 * @param {stateN2Grid_Spinner_Options} [options] - Optional configuration for the spinner.
 */
export function stateN2Grid_Spinner(state: StateN2Grid, options?: stateN2Grid_Spinner_Options) {
    if (!state) return; // Exit if no state provided

    state.ej = state.ej || {} as GridModel;
    let gridModel: GridModel = state.ej;

    let spinnerArgs: SpinnerArgs; // Placeholder for spinner arguments
    let target: HTMLElement; // Target element for the spinner

    // Override the created function
    let fnCreateSpinner = () => {
        try {
            let n2Grid: N2Grid = state?.ref?.widget;
            if (!n2Grid) return; // Exit if no widget found

            let htmlElementAnchor: HTMLElement = n2Grid.htmlElementAnchor;
            spinnerArgs = options?.spinnerArgs || {
                target: htmlElementAnchor,
            } as SpinnerArgs;

            target = spinnerArgs.target as HTMLElement;

            // Use custom createSpinner function if provided, else use default
            if (options?.fnCreateSpinner) {
                options.fnCreateSpinner(spinnerArgs, options?.internalCreateElement);
            } else {
                createSpinner(spinnerArgs, options?.internalCreateElement);
            }
        } catch (e) {
            console.error('Error creating spinner: ', e);
        }
    };

    let dm: DataManager = gridModel.dataSource as DataManager;
    if (!dm) {
        console.warn('No DataManager found in gridModel.dataSource inside stateN2Grid_Spinner');
        return; // nothing to do
    }

    // Store original beforeSend function
    let fnBeforeSend = dm.adaptor.beforeSend;

    // Override beforeSend function to show spinner
    dm.adaptor.beforeSend = (dm: DataManager, request: XMLHttpRequest): void => {

        if (!target) {
            try {
                let n2Grid: N2Grid = state?.ref?.widget;
                if (!n2Grid)
                    return; // nothing to do

                let htmlElementAnchor: HTMLElement = n2Grid.htmlElementAnchor;
                spinnerArgs = options?.spinnerArgs || {
                    target: htmlElementAnchor,
                } as SpinnerArgs;

                target = spinnerArgs.target as HTMLElement;
            } catch (e) {
                console.error('Error getting target element for spinner: ', e);
            }
        }

        if (target) {
            if (!isSpinnerCreated(target)) {
                fnCreateSpinner();
            } // if spinner created
            showSpinner(target);
        } // if target

        if (fnBeforeSend) fnBeforeSend(dm, request);
    };

    // Store original processResponse function
    let fnProcessResponse = dm.adaptor.processResponse;

    // Override processResponse function to hide spinner
    dm.adaptor.processResponse = (data: DataResult, ds?: DataOptions, query?: Query, xhr?: XMLHttpRequest, request?: Object, changes?: CrudOptions): DataResult => {
        if (target)
            hideSpinner(target);

        if (fnProcessResponse) {
            return fnProcessResponse.call(dm.adaptor, data, ds, query, xhr, request, changes);
        } else {
            return data;
        }
    };
} // stateN2Grid_Spinner

export function stateGrid_CustomExcelFilter(gridModel: (GridModel|TreeGridModel)) {
    if (gridModel == null)
        throw new Error('gridModel cannot be null! in function stateGrid_CustomExcelFilter(gridModel:GridModel)');

    let prevCreated = gridModel.created
    let prevActionBegin = gridModel.actionBegin;
    let prevActionComplete = gridModel.actionComplete;


    Object.assign(gridModel,
        {
            allowFiltering: true,

            filterSettings: {type: 'Excel', showFilterBarStatus: true, showFilterBarOperator: true,},
            created: (args) => {
                try {
                    for (let i = 0; i < gridModel[EJINSTANCES].length; i++) {
                        let grid: Grid = gridModel[EJINSTANCES][i];
                        if (grid) {
                            if (!grid.element.classList.contains(CSS_CLASS_GRID_FILTER_MENU_PRESENT)) {
                                grid.element.classList.add(CSS_CLASS_GRID_FILTER_MENU_PRESENT);
                            } // if not already present
                        } // if grid
                    } // for
                } catch (e) {
                    console.error(e);
                }

                try {
                    if (prevCreated)
                        prevCreated(args);
                } catch (e) {
                    console.error(e);
                }
            },

            actionBegin: (args) => {
                if (args.requestType === "filterchoicerequest" || args.requestType === "filtersearchbegin") {
                    args.filterChoiceCount = 0; // do not individually filter anything

                    let dlgElem = args.filterModel.dlg;
                    if (dlgElem) {
                        let dlgContent = dlgElem.querySelector('.e-dlg-content'); // this is the panel for individual values that should not exist
                        if (dlgContent) {
                            dlgContent.innerHTML = ``;
                            //                           dlgContent.innerHTML = `<div style="    display: flex;
                            //   justify-content: center; /* Center horizontally */
                            //   align-items: center;     /* Center vertically */
                            // "><h5 style="color:green;">Hello</h5></div>`

                        } // if dlgContent
                    } // if dlgElem


                    try {
                        for (let i = 0; i < gridModel[EJINSTANCES].length; i++) {
                            let grid: Grid = gridModel[EJINSTANCES][i];
                            if (grid) {

                                let filterModule: Filter = grid.filterModule;
                                if (filterModule) {
                                    if (filterModule.filterModule instanceof ExcelFilter) {
                                        let excelFilter: ExcelFilter = filterModule.filterModule as ExcelFilter;
                                        let excelFilterBase: ExcelFilterBase = excelFilter.excelFilterBase;
                                        if (excelFilterBase['selectHandlerReplaced'] == true)
                                            return; // don't do it twice
                                        if (excelFilterBase) {
                                            let prevSelectHandler = excelFilterBase['selectHandler'];
                                            excelFilterBase['selectHandler'] = (e: any) => {
                                                e['excelFilterBase'] = excelFilterBase;
                                                e['options'] = excelFilterBase.options;
                                                e['column'] = excelFilterBase.options?.column;
                                                try {
                                                    prevSelectHandler.call(excelFilterBase, e); // call in context

                                                    let dialog: Dialog = excelFilterBase['dlgObj'] as any;
                                                    if (dialog) {

                                                        setTimeout(() => {
                                                            let header = dialog.header;
                                                            dialog.header = `${header}: '${e?.column?.headerText}'`;
                                                        });
                                                    }
                                                } catch (ex) {
                                                    console.error(ex);
                                                }
                                            }; // excelFilterBase['selectHandler'] = ...
                                            excelFilterBase['selectHandlerReplaced'] = true; // mark it as replaced
                                        } // if excelFilterBase
                                    } // if filterModule.filterModule instanceof ExcelFilter
                                } // if filterModule
                            } // if grid
                        } // for i
                    } catch (e) {
                        console.error(e);
                    }


                    if (prevActionBegin) {
                        try {
                            prevActionBegin(args);
                        } catch (e) {
                            console.error(e);
                        }
                    } // if prevActionBegin
                } // if filterchoicerequest || filtersearchbegin
            }, // actionBegin
            actionComplete: (args) => {
                if (args.requestType === 'filtering') {

                    try {
                        for (let i = 0; i < gridModel[EJINSTANCES].length; i++) {
                            let grid: Grid = gridModel[EJINSTANCES][i];
                            let message: string = getGridFilterMessage(grid);
                            grid.updateExternalMessage((message ? `<div style="color:green;">${getGridFilterMessage(grid)}</div>` : null));
                        }
                    } catch (e) {
                        console.error(e);
                    }

                    if (prevActionComplete) {
                        try {
                            prevActionComplete(args);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                } // if filtering

            }, // actionComplete
        } as GridModel
    ); // Object.assign

}// stateN2Grid_Spinner


//---------------- start code to be fixed --------------

function getGridFilterMessage(gObj: Grid): string {

    let filterStatusMsg: string;
    let getFormatFlValue;
    let column;


    let columns = gObj.filterSettings.columns;

    let filterModule = gObj.filterModule;
    let l10n: any = filterModule.serviceLocator.getService('localization');
    let valueFormatter: any = filterModule.serviceLocator.getService('valueFormatter');

    let thisX: any = filterModule as any

    updateValues(gObj);

    if (columns.length > 0 && filterStatusMsg !== l10n?.getConstant('InvalidFilterMessage')) {
        filterStatusMsg = '';
        for (let index = 0; index < columns.length; index++) {
            column = gObj.grabColumnByUidFromAllCols(columns[parseInt(index.toString(), 10)].uid)
                || gObj.grabColumnByFieldFromAllCols(columns[parseInt(index.toString(), 10)].field);
            if (index) {
                filterStatusMsg += ' and ';
            }
            if (!isNullOrUndefined(column.format)) {
                let flValue = (column.type === 'date' || column.type === 'datetime' || column.type === 'dateonly') ?
                    valueFormatter.fromView(thisX.values[column.field], column.getParser(), (column.type === 'dateonly' ? 'date' : column.type)) :
                    thisX.values[column.field];
                if (!(column.type === 'date' || column.type === 'datetime' || column.type === 'dateonly')) {
                    let formater: any = filterModule.serviceLocator.getService('valueFormatter');
                    getFormatFlValue = formater.toView(flValue, column.getParser()).toString();
                } else {
                    getFormatFlValue = (filterModule as any).setFormatForFlColumn(flValue, column);
                }
                filterStatusMsg += column.headerText + ': ' + getFormatFlValue;
            } else {
                filterStatusMsg += column.headerText + ': ' + thisX.values[column.field];
            }
        }
    }
    return filterStatusMsg;
}

function updateValues(gObj: Grid): any {
    let filter: Filter = gObj.filterModule;
    let thisX = filter as any;
    let filterSettings = gObj.filterSettings;

    for (var i = 0; i < filterSettings.columns.length; i++) {
        thisX.column = gObj.grabColumnByUidFromAllCols(filterSettings.columns[parseInt(i.toString(), 10)].uid);
        let filterValue = filterSettings.columns[parseInt(i.toString(), 10)].value;
        filterValue = !isNullOrUndefined(filterValue) && filterValue.toString();
        if (!isNullOrUndefined(thisX.column.format)) {
            applyColumnFormat(filter, filterValue);
        } else {
            var key = filterSettings.columns[parseInt(i.toString(), 10)].field;
            thisX.values["" + key] = filterSettings.columns[parseInt(i.toString(), 10)].value;
        }
        let filterElement = thisX.getFilterBarElement(thisX.column.field);
        if (filterElement) {
            if (thisX.cellText[filterSettings.columns[parseInt(i.toString(), 10)].field] !== ''
                && !isNullOrUndefined(thisX.cellText[filterSettings.columns[parseInt(i.toString(), 10)].field])) {
                filterElement.value = thisX.cellText[thisX.column.field];
            } else {
                filterElement.value = filterSettings.columns[parseInt(i.toString(), 10)].value;
            }
        }
    }
}

function applyColumnFormat(filter: Filter, filterValue: any) {
    let thisX = filter as any;
    var getFlvalue = (thisX.column.type === 'date' || thisX.column.type === 'datetime' || thisX.column.type === 'dateonly') ?
        new Date(filterValue) : parseFloat(filterValue);
    if ((thisX.column.type === 'date' || thisX.column.type === 'datetime' || thisX.column.type === 'dateonly') && filterValue &&
        Array.isArray(thisX.value) && filterValue.split(',').length > 1) {
        thisX.values[thisX.column.field] = ((filterValue).split(',')).map(function (val: any) {
            if (val === '') {
                val = null;
            }
            return thisX.setFormatForFlColumn(new Date(val), thisX.column);
        });
    } else {
        thisX.values[thisX.column.field] = thisX.setFormatForFlColumn(getFlvalue, thisX.column);
    }
}