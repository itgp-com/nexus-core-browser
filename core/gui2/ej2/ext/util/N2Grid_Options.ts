import {EmitType, isNullOrUndefined} from '@syncfusion/ej2-base';
import {CrudOptions, DataManager, DataOptions, Query} from '@syncfusion/ej2-data';
import {DataResult} from '@syncfusion/ej2-data/src/adaptors';
import {AutoComplete} from '@syncfusion/ej2-dropdowns';
import {FilteringEventArgs} from '@syncfusion/ej2-dropdowns/src/drop-down-base/drop-down-base';
import {Workbook} from "@syncfusion/ej2-excel-export";
import {ColumnModel, Filter, Grid, GridModel, PredicateModel, QueryCellInfoEventArgs} from '@syncfusion/ej2-grids';
import * as events from '@syncfusion/ej2-grids/src/grid/base/constant';
import {ToolbarItem, ToolbarItems} from '@syncfusion/ej2-grids/src/grid/base/enum';
import {ExcelExportProperties, RowDataBoundEventArgs} from '@syncfusion/ej2-grids/src/grid/base/interface';
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
import {escape, isArray} from 'lodash';
import {DOMPurifyNexus} from '../../../../BaseUtils';
import {
    CSS_CLASS_ellipsis_container,
    CSS_CLASS_grid_cell_highlight_container,
    EJINSTANCES
} from '../../../../Constants';
import {findElementWithTippyTooltip, isDev} from '../../../../CoreUtils';
import {CSS_CLASS_N2_HIGHLIGHT_SURROUNDINGS} from "../../../highlight/N2Highlight";
import {addClassesToElement} from "../../../N2HtmlDecorator";
import {CSS_CLASS_GRID_FILTER_MENU_PRESENT, CSS_CLASS_row_number_001} from '../../../scss/core';
import {CSS_VARS_EJ2} from '../../../scss/vars-ej2-common';
import {CSS_VARS_CORE} from '../../../scss/vars-material';
import {getN2FromEJ2} from '../../Ej2Utils';
import {N2Ej} from '../../N2Ej';
import {N2ExcelExportSettings, N2Grid, StateN2Grid} from '../N2Grid';
import {isSpinnerCreated} from './Spinner_Options';

export const COL_ROW_NUMBER: string = '__gridrownumber__';
export const EXCEL_TABLE_SUFFIX: string = '_~~xlsx~~_';


export class N2Grid_Options_Utils {

    /**
     * This function should be overwritten (with new content) by the NexusOverwrites module of any application
     * that uses this core library.
     *
     * If it is not overwritten, it returns 7.5
     * @return {number} 7.5 if not overwritten, but is usually overwritten and customized in the NexusOverwrites module
     */
    public static getPixelCharWidth(): number {
        return 7.5;
    }

    /**
     * This function should be overwritten (with new content) by the NexusOverwrites module of any application
     * that uses this core library.
     *
     * If it is not overwritten, it returns false
     * @param args {qArgs:QueryCellInfoEventArgs}
     * @return {boolean} false if not cell content not blurred, true if content is marked as blurred
     */
    public static isBlurred(param: { qArgs: QueryCellInfoEventArgs }): boolean {
        return false;
    } // isBlurred

    /**
     * This function should be overwritten (with new content) by the NexusOverwrites module of any application
     *
     * @param qArgs
     */
    public static isRowDetailPanel(qArgs: QueryCellInfoEventArgs): boolean {
        let val: boolean = false;
        if ((qArgs as any)?.row_detail_panel)
            val = (qArgs as any).row_detail_panel; // mark this as a detail panel cell, used in Search_Base in _add_highlighted_excerpts_to_grid_cells
        return val;
    } // isDetailPane

    /**
     * This function should be overwritten (with new content) by the NexusOverwrites module of any application
     * @param qArgs
     * @param val
     */
    public static setRowDetailPanel(qArgs: QueryCellInfoEventArgs, val: boolean): void {
        (qArgs as any).row_detail_panel = val;
    } // setRowDetailPanel


    public static createEllipsisContainerElement(param: {
        textElem: HTMLElement,
        qArgs: QueryCellInfoEventArgs,
        includeDotTooltipButton?: boolean,
        isHighlightedHTML?: boolean
    }): HTMLElement {

        let isHighlightedHTML: boolean = param?.isHighlightedHTML || false;
        let IncludeDotTooltipButtonHardFalse: boolean = param != null && param.includeDotTooltipButton != null && param.includeDotTooltipButton == false;
        let includeDotTooltipButton: boolean = param?.includeDotTooltipButton || false;
        let textElem: HTMLElement = param?.textElem;
        if (!textElem) {
            console.error('textElem passed to N2Grid_Options_Utils.createEllipsisContainerElement(..) is null or undefined');
            return null;
        }


        let cell: HTMLElement = param?.qArgs.cell as HTMLElement;
        if (!cell) {
            console.error('gridCell passed to N2Grid_Options_Utils.createEllipsisContainerElement(..) is null or undefined');
            return null;
        }

        const ellipsisContainerElem = document.createElement("div");
        ellipsisContainerElem.style.display = "flex";
        ellipsisContainerElem.style.alignItems = "center";
        if (isHighlightedHTML)
            addClassesToElement(ellipsisContainerElem, [CSS_CLASS_grid_cell_highlight_container, CSS_CLASS_N2_HIGHLIGHT_SURROUNDINGS]);

        textElem.style.flex = "1";

        addClassesToElement(textElem, CSS_CLASS_ellipsis_container);

        ellipsisContainerElem.appendChild(textElem);

        // if specifically called with includeDotTooltipButton = true, then always add the button
        // if not, then add it if the cell is a not detail panel cell unless it's a hard false
        let addDotTooltipButton: boolean = includeDotTooltipButton;
        if ( addDotTooltipButton == false &&  !IncludeDotTooltipButtonHardFalse ) {
            if ( ! (N2Grid_Options_Utils.isRowDetailPanel(param.qArgs) == true) ){
                addDotTooltipButton = true; // add button if not a detail panel cell, don't add if a detail panel cell
            } // if (N2Grid_Options_Utils.isRowDetailPanel(param.qArgs) == true)
        } // if (addDotTooltipButton == false)

        if (addDotTooltipButton ) {

            const iconCell = document.createElement("div");
            const icon = document.createElement("i");
            // icon.classList.add("fa-solid", "fa-magnifying-glass");
            icon.classList.add("fa-regular", "fa-comment-dots"); // <i class="fa-regular fa-comment-dots"></i>
            icon.style.cursor = "pointer";
            icon.style.color = CSS_VARS_CORE.app_color_blue;
            icon.style.fontSize = "0.65em";

            iconCell.appendChild(icon);
            ellipsisContainerElem.appendChild(iconCell);

            // add click to iconCell to get const tippyInstance = elem._tippy; and if if (tippyInstance.state.isVisible) then call  tippyInstance.show();
            iconCell.style.cursor = "pointer";
            iconCell.addEventListener('click', () => {
                let tippyElem = findElementWithTippyTooltip(cell);
                if (tippyElem) {
                    const tippyInstance = (cell as any)._tippy;
                    if (tippyInstance) {
                        if (tippyInstance?.state?.isVisible == false) {
                            tippyInstance.show();
                        } // if (tippyInstance?.state?.isVisible == false)
                    } // if ( tippyInstance)
                } // if ( tippyElem )
            }); // iconCell.addEventListener('click', ...)
        } // if (includeDotTooltipButton)
        return ellipsisContainerElem;
    } // createEllipsisContainerElement

} // N2Grid_Options


export function rowNumberCol(): ColumnModel {
    return {
        field: COL_ROW_NUMBER,
        headerText: 'Row#',
        headerTextAlign: "Center",
        type: "number",
        textAlign: "Center",
        width: 9 * N2Grid_Options_Utils.getPixelCharWidth(),
        allowFiltering: false,
        allowGrouping: false,
        allowSorting: false,
        allowEditing: false,
        allowSearching: false,
    } as ColumnModel;
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


export function stateN2Grid_excelExport(state: StateN2Grid, fnExcelExport ?: EmitType<ClickEventArgs>): void {
    _.merge(state, {
        ej: {
            allowExcelExport: true,
        } as GridModel,
    });

    let toolbar: (ToolbarItems | string | ItemModel | ToolbarItem)[] = state.ej.toolbar;
    if (!toolbar) {
        state.ej.toolbar = ['ExcelExport']; // always show the Excel Export button
    } else {
        if (isArray(toolbar)) {
            if (toolbar.indexOf('ExcelExport') === -1) {
                toolbar = toolbar.splice(0, 0, 'ExcelExport'); // always show the Excel Export button first
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

export interface Grid_RowNumber_Options {
    pageRowNumberOnly?: boolean;
}

/**
 * Your grid must have a column with field = COL_ROW_NUMBER otherwise this function will insert one as the first column when called
 * @param {StateN2Grid} state
 * @param {Grid_RowNumber_Options} options
 */
export function stateN2Grid_RowNumber(gridModel: GridModel, options: Grid_RowNumber_Options = {}): void {
    if (!gridModel)
        return; // nothing to do

    const _ROW_NUMNER_APPLIED: string = '__row_num_done__';

    if ((gridModel as any)[_ROW_NUMNER_APPLIED])
        return; // already applied

    let pageRowNumberOnly: boolean = options?.pageRowNumberOnly; // false by default

    let grid: Grid = null;
    let fnCreated: EmitType<Event> = gridModel.created;
    gridModel.created = (ev: Object) => {
        grid = N2Ej.ejInstance(gridModel); // get the first grid
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

    (gridModel as any)[_ROW_NUMNER_APPLIED] = true;
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
                type: 'Bootstrap5', // more visible circle
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

export function stateGrid_CustomExcelFilter(gridModel: (GridModel | TreeGridModel)) {
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
                    let ejs: any[] = (gridModel as any)[EJINSTANCES];
                    if (ejs != null) {
                        for (let i = 0; i < ejs.length; i++) {
                            let grid: Grid = ejs[i];
                            if (grid) {
                                if (!grid.element.classList.contains(CSS_CLASS_GRID_FILTER_MENU_PRESENT)) {
                                    grid.element.classList.add(CSS_CLASS_GRID_FILTER_MENU_PRESENT);
                                } // if not already present
                            } // if grid
                        } // for
                    } // if ejs != null
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

                if (args.requestType == events.filterBeforeOpen) {
                    try {

                        try {
                            let dlgElem = args?.filterModel?.dlg;
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
                        } catch (e) {
                            console.error(e);
                        }

                        let excelFilterBase: ExcelFilterBase = args?.filterModel;
                        if (excelFilterBase) {
                            excelFilterBase.options.dataSource = [];


                            /**
                             * One of the ugliest, but most effective hacks under the sun.
                             * Before the Custom Filter dialog is created, this happens:
                             *     ExcelFilterBase.prototype.createdDialog = function (target, column) {
                             *         this.renderCustomFilter(target, column);
                             *         this.dlgObj.element.style.left = '0px';
                             *         if (!this.options.isResponsiveFilter) {
                             *             this.dlgObj.element.style.top = '0px';
                             *         }
                             *         else {
                             *             var content = document.querySelector('.e-responsive-dialog > .e-dlg-header-content');
                             *             var height = content.offsetHeight + 4;
                             *             this.dlgObj.element.style.top = height + 'px';
                             *         }
                             *         if (!this.options.isResponsiveFilter && Browser.isDevice && window.innerWidth < 440) {
                             *             this.dlgObj.element.style.width = '90%';
                             *         }
                             *         this.parent.notify(events.beforeCustomFilterOpen, { column: column, dialog: this.dialogObj });
                             *         this.dlgObj.show();
                             *         applyBiggerTheme(this.parent.element, this.dlgObj.element.parentElement);
                             *     };
                             *
                             * Basically the grid's localObserver (which is protected) needs to have a beforeCustomFilterOpen boundedEvent array implemented
                             *  (which it is not) in order for the beforeCustomFilterOpen event to be triggered on something. This is not
                             *  exposed though any of the interfaces, yet we need it if we're going to control the contents of the dialog in
                             *  any way
                             *
                             * events.beforeCustomFilterOpen
                             *
                             **/
                            try {

                                let grid: Grid = (excelFilterBase as any).parent as any;
                                let localObserver = (grid as any).localObserver;
                                if (localObserver) {
                                    let boundedEvents = ((grid as any).localObserver as any).boundedEvents;
                                    if (boundedEvents) {
                                        let existingEvents = boundedEvents[events.beforeCustomFilterOpen];
                                        if (!existingEvents) {
                                            existingEvents = [];
                                            ((grid as any).localObserver as any).boundedEvents[events.beforeCustomFilterOpen] = existingEvents;
                                        } // if existingEvents

                                        let f = (args: { column: string, dialog: Dialog }): void => {
                                            // let dialogElem = args.dialog.element; // ?? don't know what this is, but it's not a dialog
                                            // this is dialogElem.outerHTML in the debugger
                                            // <div class="e-filter-popup e-excelfilter" id="qguPe_575_70348string_excelDlg" uid="grid-column7" aria-label="Excel filter dialog"></div>
                                            try {

                                                let dialogAutoCompleteArray: AutoComplete[] = []
                                                let autoCompleteElems = document.querySelectorAll(`.e-xlflmenu.e-control.e-dialog    .e-xlfl-maindiv .e-xlfl-valuediv .e-control.e-autocomplete.e-lib.e-input`);
                                                for (let i = 0; i < autoCompleteElems.length; i++) {
                                                    let autoCompleteElem = autoCompleteElems[i];
                                                    let ejInstances = (autoCompleteElem as any)['ej2_instances'];
                                                    for (let j = 0; j < ejInstances.length; j++) {
                                                        let obj = ejInstances[j];
                                                        if (obj instanceof AutoComplete) {
                                                            dialogAutoCompleteArray.push(obj);
                                                        }
                                                    } // for j - ejInstances
                                                } // for i - autoCompleteElems


                                                for (let i = 0; i < dialogAutoCompleteArray.length; i++) {
                                                    let ac: AutoComplete = dialogAutoCompleteArray[i];
                                                    ac.minLength = 999999;
                                                    ac.noRecordsTemplate = '';
                                                    if ((ac as any).nexus == true) {
                                                        // do nothing - already modified
                                                    } else {
                                                        ac.filtering = (ev: FilteringEventArgs) => {
                                                            ac.value = ev.text; // set right away
                                                        };
                                                        (ac as any).nexus = true;
                                                    } // if ( (ac as any).nexus == true)
                                                }// for

                                            } catch (e) {
                                                console.error(e);
                                            }

                                            // focus on the first input element
                                            let inputElems = document.querySelectorAll(`.e-xlflmenu.e-control.e-dialog    .e-xlfl-maindiv .e-xlfl-valuediv .e-control.e-lib.e-input`);
                                            for (let i = 0; i < inputElems.length; i++) {
                                                let inputElem = inputElems[i];

                                                let id: string = inputElem.id;
                                                if (id) {
                                                    // Create a MutationObserver with the handler function
                                                    let observer = new MutationObserver(createDOMInsertionHandler(id));
                                                    // Start observing the DOM for changes
                                                    observer.observe(document.body, {
                                                        childList: true,
                                                        subtree: true
                                                    });
                                                    break; // out of the loop
                                                } // if id
                                            } // for i - inputElems

                                        }; // f

                                        // any object found will do
                                        let previouslyAdded = existingEvents.some((obj: any) => {
                                            return obj.nexus == true;
                                        });
                                        if (!previouslyAdded) {
                                            existingEvents.push({context: grid, handler: f, nexus: true});
                                        }

                                    } // if boundedEvents
                                } // if localObserver
                            } catch (e) {
                                console.error(e);
                            }

                            try {
                                if ((excelFilterBase as any)['getAllDataReplaced'] == true) {
                                    //don't do it twice, go to the next grid in the for loop
                                } else {
                                    excelFilterBase['getAllData'] = () => {
                                        var _this = excelFilterBase;
                                        var query = new Query();
                                        var args = {
                                            requestType: events.filterChoiceRequest,
                                            query: query,
                                            filterChoiceCount: null as any
                                        };
                                        var filterModel = 'filterModel';
                                        (args as any)["" + filterModel] = _this;
                                        (_this as any).parent.trigger(events.actionBegin, args, function (args: any) {
                                            // args.filterChoiceCount = !isNullOrUndefined(args.filterChoiceCount) ? args.filterChoiceCount : 1000;
                                            // query.take(args.filterChoiceCount);
                                            // if (!args.query.distincts.length) {
                                            //     _this.customQuery = true;
                                            //     _this.queryGenerate(query);
                                            // }
                                            // if (_this.parent.dataSource && 'result' in _this.parent.dataSource) {
                                            let f = _this['filterEvent'] as any;
                                            if (_.isFunction(f)) {
                                                f.call(_this, args, query); // _this.filterEvent(args, query);
                                            }
                                            // }
                                            // else {
                                            //     _this.processDataOperation(query, true);
                                            // }
                                        });
                                    }; // remove this function so it doesn't trigger any request to the back-end whatsoever
                                    (excelFilterBase as any)['getAllDataReplaced'] = true;
                                }
                            } catch (e) {
                                console.error(e);
                            }


                            try {
                                if ((excelFilterBase as any)['selectHandlerReplaced'] == true) {
                                    // don't do it twice, go to the next grid in the for loop
                                } else {
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
                                    (excelFilterBase as any)['selectHandlerReplaced'] = true; // mark it as replaced
                                } // if excelFilterBase['selectHandlerReplaced'] == true
                            } catch (e) {
                                console.error(e);
                            }

                        } // if excelFilterBase

                    } catch (e) {
                        console.error(e);
                    }

                } // if filterbeforeopen


                if (args.requestType === events.filterChoiceRequest || args.requestType === events.filterSearchBegin) {
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
                } // if filterchoicerequest || filtersearchbegin


                if (prevActionBegin) {
                    try {
                        prevActionBegin(args); //keep the context
                    } catch (e) {
                        console.error(e);
                    }
                } // if prevActionBegin
            }, // actionBegin
            actionComplete: (args) => {
                if (args.requestType === 'filtering') {

                    try {

                        let ejs: any[] = (gridModel as any)[EJINSTANCES];
                        if (ejs != null) {
                            for (let i = 0; i < ejs.length; i++) {
                                let grid: Grid = ejs[i];
                                let message: string = getGridFilterMessage(grid);
                                grid.updateExternalMessage((message ? `<div style="color:green;">${escape(message)}</div>` : null));
                            } // for
                        } // if ejs != null
                    } catch (e) {
                        console.error(e);
                    }
                } // if filtering

                try {
                    if (args.requestType == 'paging') {
                        let ejInstances = (gridModel as any)[EJINSTANCES];
                        if (ejInstances != null && ejInstances.length > 0) {
                            for (let i = 0; i < ejInstances.length; i++) {
                                let grid = ejInstances[0];

                                let n2Grid: N2Grid = getN2FromEJ2(grid) as N2Grid;
                                if (n2Grid?.state?.disableScrollToTopAfterPaging)
                                    continue; // skip this grid

                                if (grid != null) {
                                    try {
                                        grid.getContent().firstElementChild.scrollTop = 0; // scroll to top
                                        // grid.getContent().firstElementChild.scrollLeft = 0; // scroll to left
                                    } catch (e) {
                                        console.error(e);
                                    }
                                } // if grid
                            } // for
                        } // if ejInstances
                    } // if paging
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

            }, // actionComplete
        } as GridModel
    ); // Object.assign

}// stateN2Grid_Spinner


//---------------- start code to be fixed --------------

function getGridFilterMessage(gObj: Grid): string {


    let filterStatusMsg: string = '';
    try {
        let predicate: PredicateModel;
        let previousFilterStatusMsg: string = '';
        let stringValue: string = ''
        let column;


        let filterColumns = gObj.filterSettings.columns;

        let filterModule = gObj.filterModule;
        let l10n: any = filterModule.serviceLocator.getService('localization');
        let valueFormatter: any = filterModule.serviceLocator.getService('valueFormatter');

        if (gObj.pagerModule) {
            previousFilterStatusMsg = gObj.pagerModule?.pagerObj?.externalMessage
        }

        let thisX: any = filterModule as any

        updateValues(gObj);

        if (filterColumns.length > 0 && previousFilterStatusMsg !== l10n?.getConstant('InvalidFilterMessage')) {
            for (let index = 0; index < filterColumns.length; index++) {
                predicate = filterColumns[index];
                let raw_operator = predicate.operator;

                column = gObj.grabColumnByUidFromAllCols(filterColumns[index].uid) || gObj.grabColumnByFieldFromAllCols(filterColumns[index].field);

                if (index)
                    filterStatusMsg += ' and ';


                if (!isNullOrUndefined(column.format)) {
                    let flValue = (column.type === 'date' || column.type === 'datetime' || column.type === 'dateonly') ?
                        valueFormatter.fromView(thisX.values[column.field], column.getParser(), (column.type === 'dateonly' ? 'date' : column.type)) :
                        thisX.values[column.field];
                    if (!(column.type === 'date' || column.type === 'datetime' || column.type === 'dateonly')) {
                        let formater: any = filterModule.serviceLocator.getService('valueFormatter');
                        stringValue = formater.toView(flValue, column.getParser()).toString();
                    } else {
                        stringValue = (filterModule as any).setFormatForFlColumn(flValue, column);
                    }
                } else {
                    // predicate = (columns[index] as any).properties;
                    // if (predicate) {
                    let column_type = column.type;
                    let value: any = predicate.value;

                    switch (raw_operator) {
                        case 'isnotnull':
                            value = null;
                            break;
                        case 'isnull':
                            value = null;
                            break;

                        case 'isempty':
                            value = null;
                            break;
                        case 'isnotempty':
                            value = null;
                            break;
                    }

                    if (value != null) {
                        switch (column_type) {
                            case 'date':
                                stringValue = (value as Date).toLocaleDateString();
                                break;
                            case 'datetime':
                                stringValue = (value as Date).toLocaleString(); // contains time
                                break;
                            case 'number':
                                stringValue = value.toLocaleString();
                                break;
                            case 'boolean':
                                stringValue = value ? 'true' : 'false';
                                break;
                            default:
                                stringValue = value.toString(); // it's never null, so make a string since we don't know what it is
                                if (isDev())
                                    console.log('Unknown column type: ' + column_type + ' for column ' + column.field + `(${column.headerText}) when creating filter message for grid ` + gObj);
                        } // switch column_type
                    } // if value != null

                    if (stringValue && value != null) {
                        // surround with single quotes
                        stringValue = `'${stringValue}'`;
                    }

                }


                let headerText = (column.headerText || column.field || (_.isString(column.headerTemplate) ? column.headerTemplate.replace('<br>', ' / ').replace('<p>', ' / ') : 'column')) // if not text then DB col name

                let operator: string = '';

                /*
                 '<': 'lessthan',
                 '>': 'greaterthan',
                 '<=': 'lessthanorequal',
                 '>=': 'greaterthanorequal',
                 '==': 'equal',
                 '!=': 'notequal',
                 '*=': 'contains',
                 '$=': 'endswith',
                 '^=': 'startswith'
                 */
                switch (raw_operator) {
                    case 'lessthan':
                        operator = '<';
                        break;
                    case 'greaterthan':
                        operator = '>';
                        break;
                    case 'lessthanorequal':
                        operator = '<=';
                        break;
                    case 'greaterthanorequal':
                        operator = '>=';
                        break;
                    case 'equal':
                        operator = '=';
                        break;
                    case 'notequal':
                        operator = 'not equal';
                        break;
                    case 'contains':
                        operator = 'contains';
                        break;
                    case 'doesnotcontain':
                        operator = 'does not contain';
                        break;
                    case 'endswith':
                        operator = 'ends with';
                        break;
                    case 'doesnotendwith':
                        operator = 'does not end with';
                        break;

                    case 'startswith':
                        operator = 'starts with';
                        break;
                    case 'doesnotstartwith':
                        operator = 'does not start with';
                        break;
                    case 'isnotnull':
                        operator = 'is not null';
                        break;
                    case 'isnull':
                        operator = 'is null';
                        break;
                    case 'like':
                        operator = 'like';
                        break;
                    case 'isempty':
                        operator = 'is empty';
                        break;
                    case 'isnotempty':
                        operator = 'is not empty';
                        break;
                    case 'wildcard':
                        operator = 'wildcard';
                        break;
                    default:
                        operator = raw_operator;

                }

                filterStatusMsg += `${headerText} ${operator} ${stringValue} `;

            }
        }
    } catch (e) {
        console.error(e);
    }

    return filterStatusMsg;
} // getGridFilterMessage

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


//----------------------------------------------


const COLUMN__WIDTH_ADJUSTED_FOR_CUSTOM_FILTERS: string = '_n2_cwa_';

/**
 * Calculates the grid column width so that filter and sorting widgets in the column heading have space to display without overlapping the text
 * @param {ColumnModel[]} columns
 */
export function adjustColumnWidthForCustomExcelFilters(columns: ColumnModel[]) {
    let baseFontSize = Number.parseInt(CSS_VARS_CORE.app_font_size_base_number);
    let app_custom_excel_filter_width_number: number;
    try {
        app_custom_excel_filter_width_number = Number.parseInt(CSS_VARS_CORE.app_custom_excel_filter_width_number);
    } catch (e) {
    }
    if (app_custom_excel_filter_width_number == 0)
        app_custom_excel_filter_width_number = 18;


    if (columns) {
        for (const column of columns) {
            if ((column as any)[COLUMN__WIDTH_ADJUSTED_FOR_CUSTOM_FILTERS] == true)
                continue; // already adjusted


            /*
             extra calculation explained:
             For columns that are right and left justified, most of the time we need to make room for 3*18px (filter arrow + sorting arrow + bubble )
             For centered columns, the bubble arrow is part of the centered text, and as such we need to introduce the filter arrow and sorting arrow widths as extra padding to keep the heading centered and nothing overwriting
             */

            let extra: number = 0
            let filterArrowWidth = app_custom_excel_filter_width_number
            let sortArrowWidth = app_custom_excel_filter_width_number
            let sortBubbleWidth = app_custom_excel_filter_width_number

            if (column.allowFiltering !== false) // undefined same as true
                extra += filterArrowWidth;
            let isSorted: boolean = (column.allowSorting !== false); // undefined same as true
            if (isSorted) {
                extra += sortArrowWidth; // sort arrow
                extra += sortBubbleWidth// bubble
            } // if (isSorted)


            if (column.headerTextAlign == "Center") {
                extra += filterArrowWidth; // need to allow space on the opposite side for the filter arrow so it is balanced
                if (isSorted) {
                    extra += sortArrowWidth; // sort arrow
                }

                // We do not balance for the sort bubble because it is part of the centered text of the heading
                // It gets created as a sub-div of the heading) and as such there is no balancing necessary since it is part of the heading and is centered with the heading
                // Therefore only the filter and the arrow width need to be added as padding on the opposite side to keep centered
            } else if (column.headerTextAlign == null || column.headerTextAlign == "Left" || column.headerTextAlign == "Right") {
                extra += 6; // avoid overwriting the last character (based on the css rules set by N2Grid cssForN2Grid(...) function
            }// if (column.headerTextAlign == "Center")

            if (extra > 0) {
                let width: string | number = column.width;

                if (typeof width === 'string' && width.endsWith('ch')) {
                    const numberValue = parseFloat(width.slice(0, -2)); // Extract the number part of the string
                    width = numberValue * N2Grid_Options_Utils.getPixelCharWidth();
                }

                if (typeof width === 'string' && width.endsWith('em')) {
                    const numericValue = parseFloat(width.slice(0, -2)); // Extract the number part of the string
                    width = numericValue * baseFontSize;
                }


                if (_.isNumber(width)) {
                    let headerText: string = (column.headerTemplate ? column.headerTemplate as string : column.headerText) || '';
                    let defaultWidth: number = calculateDefaultHeaderWidth(headerText);

                    if (defaultWidth + extra < width) {
                        // do nothing if the width is already big enough for the default width and the extra (there's enough room for the filter and sort icons)
                    } else {
                        // width should be adjusted
                        //
                        // if (width < defaultWidth)
                        //     width = defaultWidth; // width should at least cover the header text itself


                        column.width = defaultWidth + extra;
                        (column as any)[COLUMN__WIDTH_ADJUSTED_FOR_CUSTOM_FILTERS] = true;

                    } // if ( defaultWidth + extra < width)

                } // if (isNumber(width))

            }
        } // for
    } // if (columns)


} // adjustColumnWidthForFilters

function calculateDefaultHeaderWidth(headerText: string): number {


    // Create a temporary div element
    const tempDiv = document.createElement('div');


    // Set the styles for the div
    tempDiv.style.fontFamily = CSS_VARS_CORE.app_font_family; // 'Roboto-Regular, sans-serif';
    tempDiv.style.fontSize = CSS_VARS_EJ2.grid_header_font_size; //'12px';
    tempDiv.style.fontWeight = CSS_VARS_EJ2.grid_header_font_weight; // '500';
    tempDiv.style.height = `${CSS_VARS_CORE.app_custom_excel_filter_width_number}px`;
    tempDiv.style.position = 'absolute';  // So it doesn't affect layout
    tempDiv.style.left = '-9999px';       // Move it off-screen
    tempDiv.style.whiteSpace = 'nowrap';  // Prevent wrapping

    // Insert the text into the div
    tempDiv.innerHTML = DOMPurifyNexus(headerText);

    // Append the div to the body
    document.body.appendChild(tempDiv);

    // Measure the width of the div
    const width = tempDiv.offsetWidth;

    // Remove the div from the body
    document.body.removeChild(tempDiv);

    return width;
}

//-------------------------------------------

/**
 * Function to handle the DOM insertion and focus
 *
 * Listens for the insertion of a DOM element with the specified ID and sets focus on it, then disconnects and destroys the observer.
 *
 */
function createDOMInsertionHandler(tag_id: string) {
    return function (mutationsList: MutationRecord[], observer: MutationObserver) {
        mutationsList.forEach((mutation: MutationRecord) => {
            if (mutation.type === 'childList') {
                try {
                    // Check if the input element with the specified ID has been inserted
                    const inputElement = document.getElementById(tag_id) as HTMLInputElement;
                    if (inputElement) {
                        // Set focus on the input element
                        setTimeout(() => { // setTimeout not absolutely needed, but it adds a layer of protection against the element not being ready
                            inputElement.focus();
                        }, 10);

                        if (observer) {
                            // Disconnect the observer since we don't need it anymore
                            observer.disconnect();

                            // Remove (destroy) the observer
                            observer = null;
                        } // if (observer)
                    } // if (inputElement)
                } catch (e) {
                    console.error(e);
                }
            }
        });
    };
} // createDOMInsertionHandler


export class ExcelExportNexus {
    public static async doExcelExport(args: Args_DoExcelExport): Promise<any> {
        try {
            let grid: Grid = args.grid;
            if (grid && grid.allowExcelExport) {
                let n2Grid = getN2FromEJ2(grid);
                let state = n2Grid?.state as StateN2Grid;
                let excelExportSettings: N2ExcelExportSettings = state?.excelExportSettings;

                let excelExportProperties: ExcelExportProperties = excelExportSettings?.excelExportProperties;
                let isMultipleExport: boolean = excelExportSettings?.isMultipleExport;
                let workbook: Workbook = excelExportSettings?.workbook;
                let isBlob: boolean = excelExportSettings?.isBlob;
                return await grid.excelExport(excelExportProperties, isMultipleExport, workbook, isBlob)
            }
        } catch (e) {
            console.error(e);
        }
    } // doExcelExport
}

export interface Args_DoExcelExport {
    grid: Grid;
}