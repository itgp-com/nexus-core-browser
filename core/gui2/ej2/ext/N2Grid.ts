nexusMain.UIStartedListeners.add((ev: any) => {
    link_widget_dataSource_NexusDataManager(Grid.prototype);
}); // normal priority

themeChangeListeners().add((_ev: ThemeChangeEvent) => {
    cssForN2Grid(N2Grid.CLASS_IDENTIFIER, 'e-grid');
}); // normal priority

interface N2GridEvent<N2_GRID extends N2Grid = N2Grid> {
    n2grid?: N2_GRID;
}

export interface StateN2GridRef<N2_GRID extends N2Grid = N2Grid> extends StateN2EjBasicRef {
    widget?: N2_GRID;
}

export interface N2Evt_FilterEvent<N2_GRID extends N2Grid = N2Grid> extends FilterEventArgs, N2GridEvent<N2_GRID> {
}

export interface N2Evt_ActionFailure<N2_GRID extends N2Grid = N2Grid> extends FailureEventArgs, N2GridEvent<N2_GRID> {
}

export interface N2ExcelExportSettings {
    excelExportProperties?: ExcelExportProperties;
    isMultipleExport?: boolean;
    workbook?: Workbook;
    isBlob?: boolean;
} // N2ExcelExportSettings

export interface N2PreExcelExport {
    cancel: boolean;
    n2Grid: N2Grid;
    state: StateN2Grid;
} // N2PreExcelExport

export interface N2PostExcelExport {
    result: any,
    n2Grid: N2Grid,
    state: StateN2Grid,
} // N2PostExcelExport

export interface StateN2Grid<WIDGET_LIBRARY_MODEL extends GridModel = GridModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2GridRef;

    /**
     * By default this component implements a custom Excel filter on every filterable column.
     * Set this to true to disable this feature.
     */
    disableCustomFilter?: boolean;
    /**
     * Defaults to false (apply formatter function from column to excel export)
     * If true, the excelQueryCellInfo event will not call any formatter functions when exporting
     * If false, the excelQueryCellInfo event will call the formatter function and set the value to the result of the formatter
     */
    disableExcelAutoFormater?: boolean;

    /**
     * By default the grid will scroll to the first row after paging. Setting this property to true will disable that behavior.
     */
    disableScrollToTopAfterPaging?: boolean;

    /**
     * By default the Excel filter will move the 'contains' filter to the top.
     *
     * Set this to true to disable that behavior and return the default Syncfusion order of filter operations ('contains' at the end)
     */
    disableContainsAtTopOfFilter?: boolean;


    /**
     * If true, the default N2Grid implementation (Excel filter) will not be added to the grid
     */
    disableDefaultFilterBeforeOpen?: boolean;

    /**
     * If true, the default N2Grid implementation will not be added to the grid
     */
    disableDefaultFilterChoiceRequest?: boolean;


    /**
     * By default, in an N2Grid, the Autofit All option in a column menu is disabled.
     * Set this to **true** to enable the Autofit All option in the column menu.
     */
    enableColumnMenuAutofitAll?: boolean;

    /**
     * By default, the grid will show the column menu for each column.
     * Defaults to 1000 max rows.
     */
    maxExcelRowsExported?: number;

    disableDropDownMenu?: boolean;

    disableDefaultGroupingInDropDownMenu?: boolean;

    disableDefaultRefreshInDropDownMenu?: boolean;

    onDMDataManagerExecuteQuery?: (ev: HttpRequestEvtDataManager) => void;

    /**
     * Called when the grid is about to filter the data (part of actionBegin event with reqyestType = 'filtering')
     * This call is before any actionBegin event that the gridModel implements)
     * @param {N2Evt_FilterEvent} args
     */
    onFilterBegin?: (args: N2Evt_FilterEvent) => void;

    /**
     * Same as @link{onFilterBegin} but called after any actionBegin event that the gridModel implements (assuming it has not been cancelled already)
     * @param {N2Evt_FilterEvent} args
     */
    onFilterBegin_post?: (args: N2Evt_FilterEvent) => void;

    /**
     * Called when the grid has finished filtering the data (part of actionComplete event with requestType = 'filtering')
     * This call is before any actionComplete event that the gridModel implements)
     * @param {N2Evt_FilterEvent} args
     */
    onFilterEnd?: (args: N2Evt_FilterEvent) => void;

    /**
     * Same as @link{onFilterEnd} but called after the default actionComplete event that the gridModel implements
     * @param {N2Evt_FilterEvent} args
     */
    onFilterEnd_post?: (args: N2Evt_FilterEvent) => void;


    /**
     * Optional implementation for creating the innerHTML for the current cell
     * @param args
     * @return {HTMLElement} the innerHTML to use for the cell
     */
    onQueryCellInfo_CreateCellHTML?: (args: {
        qArgs: QueryCellInfoEventArgs,
        field: string,
        recFieldVal: RecFieldVal
    }) => HTMLElement;


    /**
     * This event gets called before a tooltip for the cell array is created.
     * If you return 'true' that means that the default tooltip will not be created, and you, the developer is in charge of
     * creating it at all or any other changes you want to do.
     *
     * @param args
     * @return {boolean|void} true to stop the default tooltip from being shown, empty or false to continue with the default code
     */
    onQueryCellInfo_ArrayTooltip?: (args: {
        qArgs: QueryCellInfoEventArgs,
        field: string,
        recFieldVal: RecFieldVal
    }) => boolean | void;

    /**
     * This event gets called before a tooltip for the cell (that contains regular atomic/non array data) is created.
     * If you return 'true' that means that the default tooltip will not be created, and you, the developer is in charge of
     * creating it at all or any other changes you want to do.
     *
     * @param args
     * @return {string|void} string to show as tooltip, empty or void to continue with the default code
     */
    onQueryCellInfo_RegularTooltip?: (args: {
        qArgs: QueryCellInfoEventArgs,
        field: string,
        recFieldVal: RecFieldVal
    }) => string | void;

    /**
     * The contents of this property will be passed to the grid.excelExport(...) call when
     * an Excel export is performed.
     */
    excelExportSettings?: N2ExcelExportSettings;

    /**
     * Called from ExcelExportNexus.doExcelExport before the actual export is performed.
     * Can be async, and the calling code will wait for the promise to resolve before continuing.
     *
     * This is a good place to set the excelExportSettings property
     * It also allows one to cancel the export by setting args.cancel = true
     * @param args N2PreExcelExport
     */
    onPreExcelExport?: (args: N2PreExcelExport) => void | Promise<void>;

    /**
     * Called from ExcelExportNexus.doExcelExport after the actual export is performed.
     * Can be async, and the calling code will wait for the promise to resolve before continuing.
     *
     * This is a good place to reset the excelExportSettings properties
     * It also allows the developer to look at the result of calling grid.excelExport(...)
     * @param args N2PostExcelExport
     */
    onPostExcelExport?: (args: N2PostExcelExport) => void | Promise<void>;

    dropDownMenuState?: StateN2DropDownMenu | (() => StateN2DropDownMenu);


} // StateN2Grid

export function isN2Grid(widget: any): boolean {
    return widget?._isN2Grid;
}

export class N2Grid<STATE extends StateN2Grid = StateN2Grid> extends N2EjBasic<STATE, Grid> {
    static readonly CLASS_IDENTIFIER: string = 'N2Grid';

    get classIdentifier(): string {
        return N2Grid.CLASS_IDENTIFIER;
    }

    private _ddmenu: N2DropDownMenu;
    private _f_existing_actionFailure: (args: FailureEventArgs) => void;
    private _f_existing_queryCellInfo: (args: ExcelQueryCellInfoEventArgs) => void;
    private _f_existing_beforeDataBound: (args: BeforeDataBoundArgs) => void;
    readonly _isN2Grid: boolean = true;

    constructor(state ?: STATE) {
        super(state);
    }


    protected _constructor(state ?: STATE): void {
        super._constructor(state);
    }

    createEjObj(): void {
        this.obj = new Grid(this.state.ej);
    } // createEjObj

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2Grid.CLASS_IDENTIFIER);
        let thisX = this;
        state.ej = state.ej || {};
        let gridModel: GridModel = state.ej;


        if (state.resizeTracked == undefined)
            state.resizeTracked = true; // only set to true if not already set

        let f_existing_onResized = state.onResized;
        state.onResized = (ev: N2Evt_Resized) => {
            if (state.resizeTracked) {

            } // if state.resizeTracked

            try {
                if (f_existing_onResized)
                    f_existing_onResized.call(thisX, ev);
            } catch (e) {
                console.error(e);
            }
        } // onResized


        state.maxExcelRowsExported = state.maxExcelRowsExported || 10000; // default to 10000;

        // only add the column menu if it's not disabled
        if (state.ej?.showColumnMenu == undefined) {
            state.ej.showColumnMenu = true;
        } // if state.ej?.disableShowColumnMenu


        // Default group settings for the grid, but respect the user set ones
        let _groupSettings = gridModel.groupSettings || {}
        gridModel.groupSettings = {
            ...this.defaultGroupSettings(),
            ..._groupSettings,
        };


        //---------------------------------

        if (state?.ej?.actionFailure)
            this._f_existing_actionFailure = state.ej.actionFailure; //this takes precedence over the gridModel standard implementation
        if (!this._f_existing_actionFailure)
            this._f_existing_actionFailure = gridModel.actionFailure; // existing function in place
        gridModel.actionFailure = this.actionFailure;
        //---------------------------------

        if (state?.ej?.queryCellInfo)
            this._f_existing_queryCellInfo = state.ej.queryCellInfo; //this takes precedence over the gridModel standard implementation
        if (!this._f_existing_queryCellInfo)
            this._f_existing_queryCellInfo = gridModel.queryCellInfo; // existing function in place
        gridModel.queryCellInfo = this.queryCellInfo;


        if (state?.ej.beforeDataBound)
            this._f_existing_beforeDataBound = state.ej.beforeDataBound; //this takes precedence over the gridModel standard implementation
        if (!this._f_existing_beforeDataBound)
            this._f_existing_beforeDataBound = gridModel.beforeDataBound; // existing function in place
        gridModel.beforeDataBound = this.beforeDataBound;

        //---------------- Column Menu start ---------------------
        if (state.ej.showColumnMenu) { // only add the column menu if it's not disabled
            const clearSortSuffix = '_colmenu_clearSort';
            const autoFillSuffix = '_colmenu_AutoFitAll';
            const filterSuffix = '_colmenu_Filter';

            if (!gridModel.columnMenuItems) {

                gridModel.columnMenuItems = [
                    'AutoFitAll',
                    'AutoFit',
                    'SortAscending',
                    'SortDescending',
                    // { text: 'Clear Filter', id: 'gridclearfiltering' },
                    // { text: 'Custom Filter', id: 'gridcustomfilter' },
                    {
                        "text": "Clear Sort",
                        "id": state.tagId + clearSortSuffix,
                        "iconCss": ""
                    } as ColumnMenuItemModel,
                    'Group',
                    'Ungroup',
                    'ColumnChooser',
                    'Filter'
                ] as any[];
            } // if ! gridModel.columnMenuItems


            try {
                let f_user_columnMenuOpen = gridModel.columnMenuOpen;
                gridModel.columnMenuOpen = (ev: ColumnMenuOpenEventArgs) => {

                    let grid: Grid = getFirstEj2FromModel(gridModel);

                    let clearSortItem = ev.items.find((elem) => elem.id.endsWith(clearSortSuffix));
                    if (clearSortItem) {
                        // only exists in main menu, in column or filter sub menus it's blank
                        let clearSortElem = document.getElementById(clearSortItem.id);
                        if (clearSortElem) {
                            if (ev.column.allowSorting) {
                                let index = grid.sortSettings.columns.findIndex((col) => col.field == ev.column.field); // -1 means not found
                                if (index < 0) {
                                    // not sorted currently, so remove clear sort option
                                    clearSortElem.style.display = 'none';
                                } else {
                                    // make it visible again if it was hidden by style.display = 'none' previously
                                    clearSortElem.style.display = ''; //
                                }

                            } else {
                                // sorting not allowed, so remove clear sort option
                                clearSortElem.style.display = 'none';
                            }
                        } // if clearSortElem
                    } // if clearSortItem


                    if (!state.enableColumnMenuAutofitAll) {
                        for (let i = 0; i < ev.items.length; i++) {
                            if (ev.items[i].id.endsWith(autoFillSuffix)) {
                                let elem = document.getElementById(ev.items[i].id);
                                if (elem) {
                                    elem.style.display = 'none';
                                }
                            }
                        } // for
                    } // if ! state.enableColumnMenuAutofitAll


                    if (state.disableCustomFilter) {
                        // hide filters in menu
                        for (let i = 0; i < ev.items.length; i++) {
                            if (ev.items[i].id.endsWith(filterSuffix)) {
                                let elem = document.getElementById(ev.items[i].id);
                                if (elem) {
                                    elem.style.display = 'none';
                                }
                            }
                        } // for
                    } // if state.disableCustomFilter


                    if (f_user_columnMenuOpen != null) {
                        f_user_columnMenuOpen.call(grid, ev);
                    }

                } // columnMenuOpen
            } catch (e) {
                console.error(e);
            }


            let f_user_columnMenuClick = gridModel.columnMenuClick;
            gridModel.columnMenuClick = (ev: MenuEventArgs) => {
                let grid: Grid = getFirstEj2FromModel(gridModel);
                try {
                    if (ev.item.id.endsWith(clearSortSuffix)) {
                        // handle Clear Sort
                        let column = (ev as any).column as Column;
                        if (column) {
                            grid.removeSortColumn(column.field);
                        } // if column
                    }
                } catch (e) {
                    console.error(e);
                }

                try {
                    if (f_user_columnMenuClick != null) {
                        f_user_columnMenuClick.call(grid, ev);
                    }
                } catch (e) {
                    console.error(e);
                }
            } // columnMenuClick
        } // if (!state.disableCustomColumnMenu)
        //------------------ Column Menu end ---------------------


        if (state.disableCustomFilter == undefined || !state.disableCustomFilter) {
            stateGrid_CustomExcelFilter(state.ej); // Every N2Grid gets an Excel filter from now on unless disabled by state.disableCustomFilter
        }

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
                            existingExcelQueryCellInfo.call(this, args);
                        } // if existingExcelQueryCellInfo

                    } catch (e) {
                        console.error(e);
                    }
                } // excelQueryCellInfo
            } catch (e) {
                console.error(e);
            }
        } // if state.disableExcelAutoFormater


        //----------------- start contains at top of filter -----------------
        if (state.disableContainsAtTopOfFilter) {
            // do nothing
        } else {
            let existingActionBegin = state.ej.actionBegin;
            let existingActionComplete = state.ej.actionComplete;
            let existingCreated = state.ej.created;


            let filterOperators: any = {
                string: [
                    'Contains',
                    'Starts With',
                    'Ends With',
                    'Equal',
                    'Empty',
                    '',
                    'Does Not Contain',
                    'Does Not Start With',
                    'Does Not End With',
                    'Not Equal',
                    'Not Empty',
                    '',
                    'Custom Filter',
                ],
                number: [
                    'Between',
                    '',
                    'Equal',
                    'Greater Than',
                    'Less Than',
                    'Null',
                    '',
                    'Not Equal',
                    'Greater Than Or Equal',
                    'Less Than Or Equal',
                    'Not Null',
                    '',
                    'Custom Filter',
                ],
                boolean: ['Equal', 'Not Equal', '', 'Custom Filter'],
            };
            filterOperators = {
                ...filterOperators,
                date: filterOperators.number,
                datetime: filterOperators.number,
                dateonly: filterOperators.number,
            };

            // This function prevents the filter dialog from opening for operations that don't require data entry:
            // Syncfusion ticket https://support.syncfusion.com/support/tickets/578055
            // Another ticket: enforce validation for dates that are manually entered
            // Syncusion ticket: https://support.syncfusion.com/support/tickets/602318
            let customFilterOpen = (args: any) => { // beforeCustomFilterOpen internal event

                // This function prevents the filter dialog from opening for operations that don't require data entry:
                // Syncfusion ticket https://support.syncfusion.com/support/tickets/578055
                try {
                    let grid: Grid = this.obj;

                    let filterColumn = args.column; //set the columnname to the global variable

                    (grid.filterModule.filterModule as any).excelFilterBase.dlgObj.beforeOpen = function (args: any) { //bind the beforeOpen to the Dialog component

                        let dropdown_value: string = args.element.querySelector('.e-dropdownlist').value; //get the dropdown value

                        switch (dropdown_value) {
                            case 'Empty':
                                args.cancel = true;       //prevent the custom filter dialog open by setting args.cancel as true
                                grid.filterByColumn(filterColumn, QUERY_OPERATORS.IS_EMPTY, ""); //filter the column by using isempty operator
                                break;
                            case 'Not Empty':
                                args.cancel = true;       //prevent the custom filter dialog open by setting args.cancel as true
                                grid.filterByColumn(filterColumn, QUERY_OPERATORS.IS_NOT_EMPTY, ""); //filter the column by using isnotnull operator
                                break;
                            case 'Null':
                                args.cancel = true;       //prevent the custom filter dialog open by setting args.cancel as true
                                grid.filterByColumn(filterColumn, QUERY_OPERATORS.IS_NULL, ""); //filter the column by using isnull operator
                                break;
                            case 'Not Null':
                                args.cancel = true;       //prevent the custom filter dialog open by setting args.cancel as true
                                grid.filterByColumn(filterColumn, QUERY_OPERATORS.IS_NOT_NULL, ""); //filter the column by using isnotnull operator
                                break;

                        } // switch

                    } // beforeOpen
                } catch (e) {
                    console.error(e);
                }


                // Another ticket: enforce validation for dates that are manually entered
                // Syncusion ticket: https://support.syncfusion.com/support/tickets/602318


            } // customFilterOpen

            state.ej.actionBegin = (args: any) => {
                let grid = thisX.obj;
                let state = thisX.state;
                let requestType = args.requestType;

                // Stamp the n2Grid object into the args
                args.n2grid = thisX;

                //------------ start internal functions

                switch (requestType) {
                    case 'filtering':
                        if (state.onFilterBegin) {
                            try {
                                state.onFilterBegin.call(thisX, args);
                            } catch (e) {
                                console.error(e);
                            }
                        } // if state.onFilterBegin

                        break;
                    case 'filterBeforeOpen':
                        if (state.disableDefaultFilterBeforeOpen == true) {
                            // do nothing
                        } else {
                            thisX.implementExcelFilterValidation.call(thisX);
                        } // if state.disableDefaultFilterBeforeOpen
                        break;

                    case 'filterchoicerequest':

                        if (state.disableDefaultFilterChoiceRequest == true) {
                            // do nothing
                        } else {
                            // @ts-ignore
                            // noinspection UnnecessaryLocalVariableJS
                            let f_getcMenuDS = function getCMenuDS(type) {
                                let model = [];
                                for (let i = 0; i < filterOperators[type].length; i++) {
                                    if (filterOperators[type][i].length) {
                                        model.push({
                                            text: filterOperators[type][i] + '...',
                                        });
                                    } else {
                                        model.push({separator: true});
                                    }
                                }
                                return model;
                            }; // f_getcMenuDS

                            (grid.filterModule.filterModule as any).excelFilterBase.getCMenuDS = f_getcMenuDS;
                        } // if state.disableDefaultFilterChoiceRequest
                        break;

                } // switch

                if (args.cancel)
                    return;

                try {
                    if (existingActionBegin)
                        existingActionBegin.call(this.obj, args);
                } catch (e) {
                    console.error(e);
                }


                if (args.cancel)
                    return;
                switch (requestType) {
                    case 'filtering':
                        if (state.onFilterBegin_post) {
                            try {
                                state.onFilterBegin_post.call(thisX, args);
                            } catch (e) {
                                console.error(e);
                            }
                        } // if state.onFilterBegin
                        break;
                } // switch
            } // actionBegin


            state.ej.actionComplete = (args: any) => {
                let grid = thisX.obj;
                let state = thisX.state;
                let requestType = args.requestType;

                // Stamp the n2Grid object into the args
                args.n2grid = thisX;

                switch (requestType) {
                    case 'filtering':
                        if (state.onFilterEnd) {
                            try {
                                state.onFilterEnd.call(thisX, args);
                            } catch (e) {
                                console.error(e);
                            }
                        } // if state.onFilterEnd
                        break;
                } // switch


                if (existingActionComplete) {
                    try {
                        existingActionComplete.call(this.obj, args);
                    } catch (e) {
                        console.error(e);
                    }
                } // if existingActionComplete


                switch (requestType) {
                    case 'filtering':
                        if (state.onFilterEnd_post) {
                            try {
                                state.onFilterEnd_post.call(thisX, args);
                            } catch (e) {
                                console.error(e);
                            }
                        } // if state.onFilterEnd
                        break;
                } // switch

            } // actionComplete


            // Enables filter dialog from opening for operations that don't require data entry:
            // Syncfusion ticket https://support.syncfusion.com/support/tickets/578055
            state.ej.created = (args: any) => {
                let grid = thisX.obj;
                try {
                    // the beforeCustomFilterOpen event is an internal event, So we need to manually ON that event
                    grid.on('beforeCustomFilterOpen', customFilterOpen);
                } catch (e) {
                    console.error(e);
                }

                // //---------------- start hack to move the filter items to the main column menu (no more filter sub-menu) ---------------------
                // let columnMenuModule: ColumnMenu = grid.columnMenuModule;
                // columnMenuModule['columnMenu']['beforeItemRender'] = (
                //     args: MenuEventArgs
                // ) => {
                //     if (args.item.id === 'gridcustomfilter') {
                //         args.element.classList.add('e-submenu');
                //     }
                // };
                // columnMenuModule['columnMenu']['onClose'] = (
                //     args: OpenCloseMenuEventArgs
                // ) => {
                //     debugger;
                //     grid.filterModule.filterModule['excelFilterBase']['destroyCMenu']();
                // };
                // //-------------------- end hack ---------------------


                if (existingCreated) {
                    existingCreated.call(this.obj, args);
                }
            } // created


        } // if state.disableContainsAtTopOfFilter


        //----------------- end contains at top of filter -----------------

        super.onStateInitialized(state)
    } // onStateInitialized


    public onDOMAdded(ev: N2Evt_DomAdded): void {
        try {
            if (!this.state.disableDropDownMenu)
                if (this.obj) {
                    this.createDropDownMenu(); // not guaranteed that this.obj grid is created yet. TODO Might want to call this from onAfterInitLogic again and add a semaphore that it was not called twice
                } else {
                    if (isDev())
                        console.error('N2Grid.onDOMAdded: this.obj is not initialized yet');
                }
        } catch (e) {
            console.error(e);
        }

        super.onDOMAdded(ev);
    } // onDOMAdded


    public onDMDataManagerExecuteQuery(ev: HttpRequestEvtDataManager): void {
    }


    protected actionFailure = (args: FailureEventArgs) => {
        let retVal: EJBase = (args?.error as any)?.error as EJBase
        if (retVal == null) {

            console.error('Server Error: ', retVal, ' Grid:', this, ' actionFailure args:', args)

            let dlg = new N2Dlg_Modal({
                noStringWrapper: true,
                content: new N2Html({
                    deco: {style: {padding: '2em'}},
                    value: `
<div style="margin:20px;border:solid 1px #d0d0d0; padding:10px;">
<pre>${args.error}</pre>
</div>
`,
                }),
                options: {
                    headerTitle: 'Server Error',
                    panelSize: {
                        width: 'auto',
                        height: 'auto',
                    },
                    closeOnEscape: true,
                    closeOnBackdrop: true,
                }, // options
            }); // dlg
            dlg.show();

        } else {
            if (retVal.i_d && retVal.v_e_r) {
                if (retVal) {
                    console.error('Server Error: ', retVal, ' Grid:', this, ' actionFailure args:', args)

                    let dlg = new N2Dlg_Modal({
                        noStringWrapper: true,
                        content: new N2Html({
                            deco: {style: {padding: '2em'}},
                            value: retVal.errMsgDisplay,
                        }),
                        options: {
                            headerTitle: 'Server Error',
                            panelSize: {
                                width: 'auto',
                                height: 'auto',
                            },
                            closeOnEscape: true,
                            closeOnBackdrop: true,
                        }, // options
                    }); // dlg
                    dlg.show();
                }
            } else {
                console.error(args?.error);
            }
        } // if retVal == null

        if (this._f_existing_actionFailure && this.obj) {
            try {
                this._f_existing_actionFailure.call(this?.obj, args);
            } catch (e) {
                console.error(e);
            }
        } // if if (f_actionFailure && this.obj)
    } // actionFailure

    protected beforeDataBound = (args: BeforeDataBoundArgs) => {
        try {
            if (args.cancel == null || args.cancel == false) {
                let req_id: string = (args.actual as any)?.params?._req_id_;
                if (req_id != null) {
                    if (isNexusDataManager(this?.obj?.dataSource)) {
                        let nexusDM: NexusDataManager = this?.obj?.dataSource as NexusDataManager;
                        let req_id_dm = nexusDM.nexus_settings.req_id
                        if (req_id_dm != null) {
                            if (req_id != req_id_dm) {
                                // cancel if both req_id exist and are different. Ignore if any of them is null (does not exist)
                                args.cancel = true;
                            }
                        } // if req_id_dm
                    } // if isNexusDataManager
                } // if req_id
            } // if args.cancel == null || args.cancel == false
        } catch (e) {
            console.error(e);
        }

        try {
            if (this._f_existing_beforeDataBound) {
                this._f_existing_beforeDataBound.call(this.obj, args);
            }
        } catch (e) {
            console.error(e);
        }
    } // beforeDataBound

    protected queryCellInfo = (args: QueryCellInfoEventArgs) => {

        try {
            this.pre_existing_QueryCellInfo(args);
        } catch (e) {
            console.error(e);
        }

        if (this._f_existing_queryCellInfo) {
            try {
                this._f_existing_queryCellInfo.call(this.obj, args);
            } catch (e) {
                console.error(e);
            }
        } // if this._f_existing_queryCellInfo


        try {
            this.post_existing_QueryCellInfo(args);
        } catch (e) {
            console.error(e);
        }

    } // queryCellInfo

    protected pre_existing_QueryCellInfo = (qArgs: QueryCellInfoEventArgs) => {
        let rec: any = qArgs.data;
        let field: string = qArgs.column.field;
        if (!field)
            return;

        let cell: HTMLElement = qArgs.cell as HTMLElement;
        if (!cell)
            return;

        let isBlurred = false;
        try {
            isBlurred = N2Grid_Options_Utils.isBlurred({qArgs});
        } catch (e) {
            console.error(e);
        }

        if (isDev())
            cell.setAttribute('data-col', field); // tag every cell with its column name so it's easy to debug at development time

        let recFieldVal = rec_field_value(rec, field);
        let isRowDetailPanel = N2Grid_Options_Utils.isRowDetailPanel(qArgs);
        let isDataAnArray: boolean = isArray(recFieldVal.value_visible);
        let isHighlightedHTML = false;

        let content: string | string[];
        if (recFieldVal.is_highlighted) {
            content = recFieldVal.value_visible;
            isHighlightedHTML = true;
        } else {
            content = recFieldVal.value // same as text.value_visible actually
        }

        // if we have content, are in row_detail_panel mode and we're not blurred, then add the CSS_CLASS_detail_long_text class
        if (content && isRowDetailPanel && !isBlurred) { // was in OrcaWidgets/ skinnyElemTooltip 309
            let htmlElement: HTMLElement;
            if (cell.classList.contains(CSS_CLASS_grid_cell_detail))
                htmlElement = cell;
            else
                htmlElement = cell.querySelector(`.${CSS_CLASS_grid_cell_detail}`);

            // htmlElement is not null only if we're inside a detail panel call
            if (htmlElement) {
                // this is not a Grid cell, it's a detail cell and this enables the collapsing/expanding long text functionality
                // without this class present, the text is not collapsible and is shown entirely in the detail pane cell
                // (hint, hint in case we need to selectively disable this functionality, it's as simple as not including this class)
                addClassesToElement(htmlElement, CSS_CLASS_detail_long_text);
                if (htmlElement.id == null)
                    htmlElement.id = getRandomString(`cell_detail_longtxt`);
            }
        } // if content && ! N2Grid_Options_Utils.isBlurred({qArgs})


        let textElem: HTMLElement;
        if (this.state.onQueryCellInfo_CreateCellHTML) {
            try {
                textElem = this.state.onQueryCellInfo_CreateCellHTML.call(this, {qArgs, field, recFieldVal});
            } catch (e) {
                console.error(e + ' Using default implementation');
            }
        } // if this.state.onQueryGridCellHTML


        // fill in the innerHTML if it was not set by the user
        if (textElem == null) {
            if (isDataAnArray) {
                textElem = document.createElement('div');
                if (isRowDetailPanel) {
                    // in row detail, the content is <br> delimited so we can see the list better
                    let multiLineString: string = (content as string[]).map(v => (v != null ? v.replace(/,/g, '&#44;') : '')).join('<br>'); // format array as multi-line string for each array entry
                    textElem.innerHTML = multiLineString;
                } else {
                    // grid cell for array is ', ' delimited
                    let singleLineCommaDelimitedCell = (content as string[]).map(v => v != null ? v.replace(/,/g, '&#44;') : '').join(', '); // format array as comma delimited string, handle nulls                   textElem = document.createElement('div');
                    textElem.innerHTML = singleLineCommaDelimitedCell;
                }
            } else { // isDataAnArray
                if (isHighlightedHTML) {
                    // highlighted content is already formatted as HTML, so just set it
                    let highlightedCellContent: string = content as string;
                    textElem = document.createElement('div');
                    textElem.innerHTML = highlightedCellContent;
                } else {
                    // plain single value
                    // do absolutely nothing - leave things as they are in innerHTML (could be formatted data, which value_visible would not be
                }
            } // if isDataAnArray
        } // if innerHTML == null


        // if innerHTML has been instantiated (array or highlighted text)
        if (textElem) {

            // so if we have a new innerHTML, we need to set the surrounding CSS for innerHTML
            let ellipsisContainerElem = N2Grid_Options_Utils.createEllipsisContainerElement({
                textElem,
                qArgs,
                isHighlightedHTML,
                includeDotTooltipButton: (!isRowDetailPanel), // no button if detail
            });

            cell.innerHTML = ''; // clear all contents
            cell.appendChild(ellipsisContainerElem);
        } // if innerHTML == null


        let existing_tippy_tooltip = findElementWithTippyTooltip(cell);
        if (existing_tippy_tooltip == null) {

            let userHandlesTooltip = false;
            if (isDataAnArray) {
                try {
                    userHandlesTooltip = this.state.onQueryCellInfo_ArrayTooltip?.call(this, {
                        qArgs,
                        field,
                        recFieldVal
                    });
                } catch (e) {
                    console.error(e + ' Using default tooltip implementation for array data.');
                }

                if (!userHandlesTooltip) {
                    // default array tooltip
                    let cell: HTMLElement = qArgs.cell as HTMLElement;
                    if (cell) {
                        try {
                            this.queryCellInfo_ArrayTooltip({qArgs, field, recFieldVal});
                        } catch (e) {
                            console.error(e);
                        }
                    } // if cell
                } // if userHandlesTooltip
            } else {
                // not an array
                if (isHighlightedHTML) {
                    try {
                        userHandlesTooltip = this.state.onQueryCellInfo_RegularTooltip?.call(this, {  // Nexus_Overwrites usually creates an application specific tooltip implementation
                            qArgs,
                            field,
                            recFieldVal
                        });
                    } catch (e) {
                        console.error(e + ' Using default tooltip implementation for array data.');
                    }

                    if (!userHandlesTooltip) {
                        // default regular tooltip
                        let cell: HTMLElement = qArgs.cell as HTMLElement;
                        if (cell) {
                            try {
                                this.queryCellInfo_RegularTooltip({qArgs, field, recFieldVal: recFieldVal}); // Nexus_Overwrites usually creates an application specific tooltip implementation
                            } catch (e) {
                                console.error(e);
                            }
                        } // if cell
                    } // if userHandlesTooltip
                } // if ( isHighlightedHTML)
            } // if isDataAnArray
        } // if ( existing_tippy_tooltip == null)

    } // queryCellInfo


    protected post_existing_QueryCellInfo = (args: QueryCellInfoEventArgs) => {

    } // post_existing_QueryCellInfo


    /**
     * Empty implementation in core. Is overwritten by Nexus_Overwrites in extending application.
     *
     * This method is can also be an extending class, separate from Nexus_Overwrites, if needed.
     * @param args
     */
    public queryCellInfo_ArrayTooltip(args: {
        qArgs: QueryCellInfoEventArgs,
        field: string,
        /**
         * Optional. If null, the data will be read from the 'field' (allows for substituting the data from this field with the data from another)
         */
        recFieldVal?: RecFieldVal
    }): void {
        // this method is overwritten by the extending application from app_specific/Nexus_Overwrites
        // creates application-specific tooltips for data arrays
    } // queryCellInfoTooltipForArrayData

    /**
     * Empty implementation in core. Is overwritten by Nexus_Overwrites in extending application.
     * @param args
     */
    public queryCellInfo_RegularTooltip(args: {
        qArgs: QueryCellInfoEventArgs,
        field: string,
        recFieldVal: RecFieldVal
    }): void {
        // this method is overwritten by the extending application from app_specific/Nexus_Overwrites
        // creates application-specific tooltips for regular data
    }

    /**
     * The function is used to generate updated Query from Grid model.
     *
     * @param {boolean} skipPage - specifies the boolean to skip the page
     * @param {boolean} isAutoCompleteCall - specifies for auto complete call
     * @returns {Query} returns the Query or null if not initialized
     */
    public generateQuery(skipPage?: boolean, isAutoCompleteCall?: boolean): Query {
        if (!this.obj)
            return null;
        return new Data(this.obj).generateQuery(skipPage, isAutoCompleteCall);
    } // generateQuery

    //------------- DropDownMenu section start -----------------


    /**
     * Create or overwrite the drop down menu for the grid based on either the current
     * dropDownMenuState in this.state if defined or the default menu for every N2Grid otherwise.
     *
     * If a menu already exists, it is destroyed first.
     */
    public createDropDownMenu(): void {
        if (this.dropDownMenu) {

            try {
                this.dropDownMenu.destroy();
            } catch (e) { console.error(e);  }

        } // if (this._ddmenu)


        let dropDownState: StateN2DropDownMenu = null;
        if ( this.state.dropDownMenuState ) {
            if ( isFunction(this.state.dropDownMenuState) ) {
                try {
                    dropDownState = this.state.dropDownMenuState.call(this);
                } catch (e) {
                    console.error(e);
                }
            } else {
                dropDownState = this.state.dropDownMenuState;
            }
        } // if ( this.state.dropDownMenuState )

        if (dropDownState == null) {
            dropDownState = this.defaultDropDownMenuState();
        }

        if (dropDownState.target == null)
            dropDownState.target = this.defaultDropDownMenuTarget();

        if (dropDownState.dropdown_state == null)
            dropDownState.dropdown_state = {};

        if (dropDownState.dropdown_state.ej == null)
            dropDownState.dropdown_state.ej = {};

        if (dropDownState.dropdown_state.ej.items == null)
            dropDownState.dropdown_state.ej.items = this.defaultDropDownMenuItems();


        this.dropDownMenu = new N2DropDownMenu(dropDownState);
    } // createDropDownMenu

    public defaultDropDownMenuState(): StateN2DropDownMenu {

        let menu_items = this.defaultDropDownMenuItems();
        let menu_target = this.defaultDropDownMenuTarget();
        return {
            target: menu_target,
            dropdown_state: {
                ej: {
                    items: menu_items,
                }, // ej
            }
        } as StateN2DropDownMenu;
    } // dropDownMenuState

    public defaultDropDownMenuTarget(): HTMLElement {
        return this.obj.element as HTMLElement;
    }

    public defaultDropDownMenuItems(): ItemModel_N2DropDownMenu[] {
        // not guaranteed that this.obj grid is created yet. TODO Might want to call this from onAfterInitLogic again and add a semaphore that it was not called twice
        let menu_items: ItemModel_N2DropDownMenu[] = [];

        if (!this.state.disableDefaultRefreshInDropDownMenu) {
            menu_items.push(N2Grid_DropDownMenu.item_refresh({n2Grid: this}));
            menu_items.push({separator: true,});
        } // if ! this.state.disableDefaultRefreshInDropDownMenu

        if (!this.state.disableDefaultGroupingInDropDownMenu) {
            menu_items.push(N2Grid_DropDownMenu.item_enable_grouping({n2Grid: this}));
            menu_items.push(N2Grid_DropDownMenu.item_disable_grouping({n2Grid: this}));
            menu_items.push({separator: true,});
        } // if ! this.state.disableDefaultGroupingInDropDownMenu

        if (N2GridAuth.allowExcelExport({state: this.state}) && this.state?.ej?.allowExcelExport) {
            menu_items.push(N2Grid_DropDownMenu.item_excel_export({n2Grid: this}));
        }
        return menu_items;
    } // defaultDropDownMenuItems


    get dropDownMenu(): N2DropDownMenu {
        return this._ddmenu;
    }

    set dropDownMenu(value: N2DropDownMenu) {
        this._ddmenu = value;
    }

//------------- DropDownMenu section end -----------------

    protected defaultGroupSettings(): GroupSettingsModel {
        return {
            allowReordering: true,
            showDropArea: true,
            showToggleButton: true,
            showGroupedColumn: true,
            showUngroupButton: true,
        };
    } // defaultGroupSettings


    protected implementExcelFilterValidation(): void {

        let thisN2Grid = this;
        let grid = this.obj;

        let existing_filterBtnClick = (grid.filterModule.filterModule as any).excelFilterBase.filterBtnClick;
        if (existing_filterBtnClick['n2_function'])
            return; // it's already been implemented

        let n2_filterBtnClick = (col: string): void => {
            const isComplex: boolean = !isNullOrUndefined(col) && isComplexField(col);
            const complexFieldName: string = !isNullOrUndefined(col) && getComplexFieldID(col);
            const colValue: string = isComplex ? complexFieldName : col;

            let excelFilterBase = grid.filterModule.filterModule.excelFilterBase

            // @ts-ignore
            const fValue: NumericTextBox = (excelFilterBase.dlgDiv.querySelector('#' + colValue + '-xlfl-frstvalue') as EJ2Intance).ej2_instances[0];
            // @ts-ignore
            const fOperator: DropDownList = (excelFilterBase.dlgDiv.querySelector('#' + colValue + '-xlfl-frstoptr') as EJ2Intance).ej2_instances[0];
            // @ts-ignore
            const sValue: NumericTextBox = (excelFilterBase.dlgDiv.querySelector('#' + colValue + '-xlfl-secndvalue') as EJ2Intance).ej2_instances[0];
            // @ts-ignore
            const sOperator: DropDownList = (excelFilterBase.dlgDiv.querySelector('#' + colValue + '-xlfl-secndoptr') as EJ2Intance).ej2_instances[0];


            if (excelFilterBase.options.column.type === 'date' || excelFilterBase.options.column.type === 'datetime') {
                let firstOperator = fOperator.value;
                let firstValue = fValue.value;

                let secondOperator = sOperator.value;
                let secondValue = sValue.value;


                let f_show_error = (invalid_value: string, format: string) => {

                    let error_elem = document.createElement('div');
                    error_elem.style.padding = '20px';
                    error_elem.style.fontSize = 'large';
                    error_elem.style.textAlign = 'center';


                    //`<div style="padding: 20px;text-align:center;font-size:large;">Invalid value "<span style="font-weight:bold;color:red;">6/6/66</span>"!</div>`
                    if (invalid_value) {
                        error_elem.innerHTML = `Invalid value: "<span style="font-weight:bold;color:red;">${DOMPurifyNexus(invalid_value)}</span>"<p>Please enter a valid first value in format <b>${DOMPurify.sanitize(format)}</b> !`;
                    } else {
                        error_elem.innerHTML = `Please enter a valid value in format <b>${DOMPurifyNexus(format)}</b> !`;
                    }


                    let dialog = new N2Dialog({
                        ej: {
                            content: error_elem,
                            header: 'Invalid value',
                            closeOnEscape: true,
                            height: 'auto',
                            width: `min(400px, 60%)`,
                            minHeight: 150,
                            minWidth: 300,
                            overlayClick: (args: any) => {
                                dialog.hide();
                            }
                        } as DialogModel
                    });
                    dialog.show();
                }


                if (firstOperator && firstValue == null) {
                    fValue.element.focus();
                    let invalid_value = fValue?.element?.value;
                    f_show_error(invalid_value, fValue.format);
                    return;
                }

                if (secondOperator && secondValue == null) {
                    sValue.element.focus();
                    let invalid_value = sValue?.element?.value;
                    f_show_error(invalid_value, sValue.format);
                    return;
                }

            } // if column.type === 'date' || column.type === 'datetime'

            try {
                if (existing_filterBtnClick)
                    existing_filterBtnClick.call(excelFilterBase, col);
            } catch (e) {
                console.error(e);
            }

        } // n2_filterBtnClick

        (n2_filterBtnClick as any)['n2_function'] = true;

        (grid.filterModule.filterModule as any).excelFilterBase.filterBtnClick = n2_filterBtnClick;

    } // actionCompleteValidation

} // N2Grid

/**
 * Apply the CSS styles to the selectors defined by n2GridClass and eGridClass
 * The function applies to N2 Grid and TreeGrid
 *
 * @param {string} n2GridClass one of ['N2Grid', 'N2TreeGrid', ]
 * @param {string} eGridClass one of ['e-grid', 'e-treegrid',]
 */
export function cssForN2Grid(n2GridClass: string, eGridClass: string) {

    let app_custom_excel_filter_width_number: number;
    try {
        app_custom_excel_filter_width_number = Number.parseInt(CSS_VARS_CORE.app_custom_excel_filter_width_number);
    } catch (e) {
    }
    if (app_custom_excel_filter_width_number == 0)
        app_custom_excel_filter_width_number = 18;


    let accent = CSS_VARS_CORE.material_accent_color;
    let accentContrastColor = 'white'; // fontColor(accent); // dynamically calculated based on theme color

    let gridHoverBgColor = CSS_VARS_EJ2.grid_hover_bg_color;
    let gridHoverFontColor = fontColor(gridHoverBgColor); // the contrast color to the current background


    cssAdd(`
.${CSS_CLASS_ellipsis_container}, .${N2Grid.CLASS_IDENTIFIER} .e-rowcell .${CSS_CLASS_ellipsis_container} {
  width: 100%; 
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.${n2GridClass}.e-control.${eGridClass} .e-rowcell {
  font-family: var(--app-font-family);
  font-size: var(--app-font-size-regular);        
}
 
 
    `); // CSS for N2Grid and N2TreeGrid


    // Removes blue background from grid editable checkbox and restores border and font color
    cssAddSelector(`.${n2GridClass} .e-checkbox-wrapper .e-frame.e-check, .${n2GridClass} .e-css.e-checkbox-wrapper .e-frame.e-check`,
        `
    background-color: transparent;
    border-color: unset;
    color: black;`);

    // Make tops of grid filters change colors for enabled filters
    cssAddSelector(`.${n2GridClass} .e-filtertext:not(.e-disable)`, `
        background-color: $app-filter-text-background-color !important;
        padding-left: 1ch !important;`);


    cssAddSelector(`.${n2GridClass} .e-tbar-btn, .e-tbtn-txt`,
        `  background-color: ${accent} !important;`
    );


    cssAddSelector(`.${n2GridClass} .e-tbar-btn-text, .${n2GridClass} .e-btn-icon.e-excelexport`,
        `color: ${accentContrastColor} !important;`
    );


    cssAddSelector(`.${n2GridClass}.e-control .e-toolbar .e-tbar-btn .e-tbar-btn-text`,
        `font-family: var(--app-font-family);
font-size: var(--app-font-size-regular);`
    );

    //Make tops of grid filters change colors for enabled filters
    cssAddSelector(`.${n2GridClass} .e-filtertext:not(.e-disable) `, `
     background-color: var(--app-filter-text-background-color) !important;
  padding-left: 1ch !important;
    `);


    //  Grid opacity
    cssAddSelector(`.${n2GridClass}.e-control.${eGridClass} .e-rowcell:not(.e-editedbatchcell), .e-control.${eGridClass} .e-detailrowcollapse:not(.e-editedbatchcell), .e-control.${eGridClass} .e-detailrowexpand:not(.e-editedbatchcell), .e-control.${eGridClass} .e-gridcontent .e-rowdragdrop:not(.e-editedbatchcell), .e-control.${eGridClass} .e-emptyrow:not(.e-editedbatchcell)`, `
     opacity: 1 !important;
    `);

    // Reduce the padding of the header grid cells from 1.8em default
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-gridheader .e-sortfilter .e-headercelldiv, .${eGridClass} .e-gridheader .e-stackedheadercelldiv,
.${n2GridClass}.${eGridClass} .e-gridheader .e-headercell .e-headercelldiv.e-headerchkcelldiv,
.${n2GridClass}.${eGridClass} .e-gridheader .e-sortfilter .e-centeralign.e-headercell[aria-sort=none] .e-headercelldiv, 
.${n2GridClass}.${eGridClass} .e-gridheader .e-sortfilter .e-centeralign.e-headercell[aria-sort=none] .e-stackedheadercelldiv, 
.${n2GridClass}.${eGridClass} .e-gridheader .e-sortfilter .e-centeralign.e-headercell:not([aria-sort]) .e-headercelldiv, 
.${n2GridClass}.${eGridClass} .e-gridheader .e-sortfilter .e-centeralign.e-headercell:not([aria-sort]) .e-stackedheadercelldiv
`, `
    padding-right: 0.5em;
    `);

    // Make row hovered over readable by turning the font color to the contrasting color of the background
    cssAddSelector(`.${n2GridClass}.${eGridClass}.e-gridhover tr[role=row]:not(.e-disable-gridhover):not(.e-editedrow):not(.e-detailrow):hover .e-rowcell:not(.e-cellselectionbackground):not(.e-active):not(.e-updatedtd):not(.e-indentcell),
.${n2GridClass}.${eGridClass}.e-gridhover tr[role=row]:not(.e-disable-gridhover):not(.e-detailrow):hover .e-detailrowcollapse:not(.e-cellselectionbackground):not(.e-active):not(.e-updatedtd):not(.e-indentcell),
.${n2GridClass}.${eGridClass}.e-gridhover tr[role=row]:not(.e-disable-gridhover):hover .e-rowdragdrop:not(.e-cellselectionbackground):not(.e-active):not(.e-updatedtd):not(.e-indentcell),
.${n2GridClass}.${eGridClass}.e-rtl .e-gridhover tr[role=row]:not(.e-disable-gridhover):hover .e-rowdragdrop:not(.e-cellselectionbackground):not(.e-active):not(.e-updatedtd):not(.e-indentcell),
.${n2GridClass}.${eGridClass}.e-gridhover tr[role=row]:not(.e-disable-gridhover):not(.e-detailrow):hover .e-detailrowexpand:not(.e-cellselectionbackground):not(.e-active):not(.e-updatedtd):not(.e-indentcell)`, `
        color: ${gridHoverFontColor} !important;
    `);

    //   // Grid cell font type and size
    //   cssAddSelector(`.${n2GridClass}.e-control.${eGridClass} .e-rowcell`, `
    // font-family: var(--app-font-family);
    // font-size: var(--app-font-size-regular);
    //   `);


    // left divider color for row cell, header and filter cells
    cssAddSelector(`.${n2GridClass}.e-control.${eGridClass} .e-rowcell, .${n2GridClass}.e-control.${eGridClass} .e-filterbarcell, .${n2GridClass}.e-control.${eGridClass} .e-headercell`, `
  border-left: 1px solid var(--grid-header-border-color);
    `);

    // eliminate resize handler cell visible border
    cssAddSelector(`.${n2GridClass}.e-control.${eGridClass} .e-headercell .e-rhandler`, `
  border-right-width: 0px !important;
  border-right-style: solid !important;
  border-right-color: var(--grid-table-background-color) !important;    
    `);

    cssAddSelector(`.${n2GridClass}.e-control.${eGridClass} .e-tableborder `, `
      border-right-color: var(--grid-header-border-color) !important;
    `);

    // Controls the left/right padding in grid cells
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-rowcell, .${eGridClass} .e-filterbarcell, .${eGridClass} .e-filterbarcelldisabled, .${eGridClass} .e-headercell, .${eGridClass} .e-detailheadercell`, `
      padding: 5px;
    `);

    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-gridheader tr th:first-child:has(.e-headerchkcelldiv)`, `
      padding-left: 5px;
    `);


    // this selector is used to denote a disabled row in the grid
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-rowcell.screen-grid-col-disabled `, `
      background-color: ${CSS_VARS_CORE.app_row_disabled_background_color_lightgray};
    `);
    // this selector is used to denote a disabled row in the grid
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-headercell.screen-grid-col-disabled `, `
   background-color: ${CSS_VARS_CORE.app_row_disabled_background_color_lightgray} !important;   
    `);

    // Ej2 defaults the width to 57px for some strange reason
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-grouptext`, `
    width: unset;
    `);

    // group area background color
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-groupdroparea`, `
            background-color: var(--app-filter-text-background-color);     
            color: #000;
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
            border-top-color: #e0e0e0;
    `);

// This is here for the grid cell to not wrap on <br>
    cssAddSelector(`.${n2GridClass} td.e-rowcell br`, `
     display: none;
    `);


    //------------------- General sorting - disable color change for sorted columns -------------
    cssAddSelector(`.${n2GridClass}.${eGridClass} th.e-headercell[aria-sort=ascending] .e-headertext, 
.${n2GridClass}.${eGridClass} th.e-headercell[aria-sort=descending] .e-headertext, 
.${n2GridClass}.${eGridClass} th.e-headercell[aria-sort=ascending] .e-sortfilterdiv, 
.${n2GridClass}.${eGridClass} th.e-headercell[aria-sort=descending] .e-sortfilterdiv`, `
        color: unset;
        opacity: unset;
    `);

    //--------------- Custom Excel filter --------------------

    const STYLE_CENTER_VERTICAL: string = `
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto 2px;
        height: 16px;`;

    // Move the hidden div that the floating dialog opening next to to the left if the menu is on the left side (if text is right justified)
    cssAddSelector(`.${n2GridClass}.e-control.${eGridClass}  .e-rightalign .e-filtermenudiv`, `
    float: unset;
    width: 40px;
	`);


    // Reverse the space reservation and reserve 32px to the front of the header cell for the filter and sort icon
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-gridheader .e-sortfilter .e-rightalign.e-fltr-icon .e-headercelldiv`, `
            margin: -7px -7px -7px 32px;
    `);

    /**
     * This is the filter icon that appears in the right of the header of a column that has a filter applied (e-filtered exists).
     */
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-filtermenudiv.e-filtered::before`, `
        color: var(--material-accent-font-color);
        background-color: var(--material-accent-color);
        padding: 3px;
        border: solid 1px var(--grid-header-border-color);
        border-radius: 5px;
        ${STYLE_CENTER_VERTICAL}
        right: 0;
   `);

    /**
     * This is the filter icon that appears on the left of the header of a column that has a filter applied (e-filtered exists) and the header is right justified.
     */
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-rightalign .e-filtermenudiv.e-filtered::before`, `
        right: unset;
        left: 0;
    `);


    /**
     * This is the filter icon that appears in the right of the header of a column that has no filter (e-filtered doesn't exist).
     */
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-filtermenudiv:not(.e-filtered)::before`, `
        padding: 3px;
        border: solid 1px var(--grid-header-border-color);
        border-radius: 5px;
        ${STYLE_CENTER_VERTICAL}
        right: 0;
    `);

    /**
     * This is the filter icon that appears on the left of the header of a column that has no filter (e-filtered doesn't exist) and the header is right justified.
     */
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-rightalign .e-filtermenudiv:not(.e-filtered)::before`, `
        right: unset;
        left: 0;
    `);

    // when right-align the left padding was 1.8em by default. Now it's 17px, exactly 1px less than the size of the sort bubble so things line up
    cssAddSelector(`.${n2GridClass}.${eGridClass}  .e-gridheader .e-sortfilter .e-rightalign .e-headercelldiv, .${n2GridClass}.${eGridClass} .e-gridheader .e-rightalign .e-stackedheadercelldiv`, `
        padding: 0 0.6em 0 17px;
    `);


    //-------------------- sort icons if there's a filter menu present ---------------------------
    // this has right=36px because there's a filter menu present amd the filtersort icon
    cssAddSelector(`.${n2GridClass}.${eGridClass}.grid_filter_menu_present .e-gridheader .e-sortnumber`, `
        margin: 2px 15px 2px 0;
        ${STYLE_CENTER_VERTICAL}
        width: 16px;
        right: 36px;
        `
    );

    // if the header is right justified and there's a filter menu present, move the sort number to the left, still 36px just like the right above
    cssAddSelector(`.${n2GridClass}.${eGridClass}.grid_filter_menu_present .e-gridheader  .e-rightalign .e-sortnumber`, `
        right: unset;
        left: 36px;
    `);


    // this has right=0 because there's a filter menu present
    cssAddSelector(`.${n2GridClass}.${eGridClass}.grid_filter_menu_present .e-sortfilterdiv.e-ascending::before,
.${n2GridClass}.${eGridClass}.grid_filter_menu_present .e-sortfilterdiv.e-descending::before`,
        `
        margin-left: -10px;
        padding: 2px 3px 4px 3px;
        border: solid 1px var(--grid-header-border-color);
        border-radius: 5px;
        ${STYLE_CENTER_VERTICAL}
        right: ${app_custom_excel_filter_width_number}px;
    `);

    // if the header is right justified and there's a filter menu present, move the sort filter icon to the left
    cssAddSelector(`.${n2GridClass}.${eGridClass}.grid_filter_menu_present  .e-rightalign .e-sortfilterdiv.e-ascending::before,
.${n2GridClass}.${eGridClass}.grid_filter_menu_present .e-headercelldiv[style*="text-align: right;"] + .e-sortfilterdiv.e-descending::before`,
        `
        right: unset;
        left: ${app_custom_excel_filter_width_number}px;
    `);


    //-------------------- sort icons if there's a filter menu IS NOT PRESENT ---------------------------
    // this has right=18px because there's no filter menu present, but there is the filtersort icon
    cssAddSelector(`.${n2GridClass}.${eGridClass}:not(.grid_filter_menu_present) .e-gridheader .e-sortnumber`, `
        margin: 1px ${app_custom_excel_filter_width_number}px 0px 0px;
        ${STYLE_CENTER_VERTICAL}
        width: 16px;
        right: ${app_custom_excel_filter_width_number}px;
        `
    );

    // if the header is right justified, move the sort icon to the left, still 18px just like the right above
    cssAddSelector(`.${n2GridClass}.${eGridClass}:not(.grid_filter_menu_present) .e-gridheader .e-rightalign .e-sortnumber`, `
        right: unset;
        left: ${app_custom_excel_filter_width_number}px;
    `);


    // this has right=0 because there's no filter menu present
    cssAddSelector(`.${n2GridClass}.${eGridClass}:not(.grid_filter_menu_present) .e-sortfilterdiv.e-ascending::before,
.${n2GridClass}.${eGridClass}:not(.grid_filter_menu_present) .e-sortfilterdiv.e-descending::before`,
        `
        margin-left: 2px;
        padding: 3px;
        border: 1px solid var(--grid-header-border-color);
        border-radius: 5px;
        ${STYLE_CENTER_VERTICAL}
        right: 0px;
    `);

    // if the header is right justified, move the sort icon to the left
    cssAddSelector(`.${n2GridClass}.${eGridClass}:not(.grid_filter_menu_present) .e-rightalign .e-sortfilterdiv.e-ascending::before,
.${n2GridClass}.${eGridClass}:not(.grid_filter_menu_present) .e-rightalign .e-sortfilterdiv.e-descending::before`,
        `
        right: unset;
        left: 0px;
    `);


    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-frozenheader > .e-table, .${n2GridClass}.${eGridClass} .e-frozencontent > .e-table, .${n2GridClass}.${eGridClass} .e-frozencontent .e-virtualtable > .e-table, .${n2GridClass}.${eGridClass} .e-frozenheader .e-virtualtable > .e-table`, `
        border-right-color: var(--grid-header-border-color);
    `);
    //---------------------

    // align sort and menu vertically
    cssAddSelector(`.${n2GridClass}.${eGridClass}:not(.grid_filter_menu_present) .e-columnheader.e-wrap .e-sortfilterdiv, .${n2GridClass}.${eGridClass}:not(.grid_filter_menu_present) .e-columnheader .e-sortfilterdiv`, `
        margin: -19px 10px;    
    `);


    // now center the menu character in the menufilter div ::before
    cssAddSelector(`
    .${n2GridClass}.${eGridClass} .e-icon-filter::before, 
    .${n2GridClass}.${eGridClass} .e-icon-filter.e-filtered::before, 
    .${n2GridClass}.${eGridClass} .e-grid-menu .e-icon-filter::before, 
    .${n2GridClass}.${eGridClass} .e-grid-menu .e-icon-filter.e-filtered::before`, `
line-height: 8px;
`);


    // disable excel sort menu items in the filter menu specific to excel filters (the sort exists on the main column already)
    // .e-excel-ascending,
    // .e-excel-descending,
    // .e-separator.e-excel-separator {
    //   display: none;
    // }
    cssAddSelector(`
    .${n2GridClass}.${eGridClass} .e-menu-item.e-excel-ascending, 
    .${n2GridClass}.${eGridClass} .e-menu-item.e-excel-descending, 
    .${n2GridClass}.${eGridClass} .e-menu-item.e-separator.e-excel-separator`,
        `display: none;`);


    let cridClasslist: string[]

    cssAddSelector(
        `.${n2GridClass}.${eGridClass}.e-control.e-lib`,
        `
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        border-bottom-left-radius:10px;
        border-bottom-right-radius:10px;
        `);

    // this needs to match the grid above
    cssAddSelector(
        `.${n2GridClass}.${eGridClass}.e-control.e-lib .e-gridpager.e-pager`,
        `
  border-bottom-left-radius:10px; 
  border-bottom-right-radius:10px;
  `);

    cssAddSelector(
        `.${n2GridClass}.${eGridClass} .e-gridheader.e-lib, .${n2GridClass} .e-columnheader`,
        `
  background-color: var(--app-color-panel-background);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  `);


    cssAddSelector(
        `.${n2GridClass}.${eGridClass} .e-columnheader .e-headercell`,
        `
  background-color: var(--app-color-panel-background);
  `);

    //   cssAddSelector(
    //       `.${n2GridClass}.${eGridClass} .e-columnheader .e-headercelldiv span`,
    //       `
    // font-weight: bold;
    // `);

    /* Ensure positioning context for the span in e-headertext below */
    cssAddSelector(
        `.${n2GridClass}.${eGridClass} .e-headercelldiv`, `
         position:relative; 
            line-height: 1.1;
  `);

    // this applies to regular text header cells so they center vertically
    cssAddSelector(`.${n2GridClass}.${eGridClass} .e-headercelldiv .e-headertext`, `
        display: inline-flex; /* Use inline-flex to make it work with text-align */
        align-items: center; /* Vertically center content inside the span */
        height: 100%; /* Ensure it takes the full height of the parent */
    `);


    // cssAddSelector(
    //     ``,
    //     ``);

} // cssForN2Grid

import {isNullOrUndefined, KeyboardEvents} from '@syncfusion/ej2-base';
import {Query} from '@syncfusion/ej2-data';
import {DropDownList} from '@syncfusion/ej2-dropdowns';
import {Workbook} from "@syncfusion/ej2-excel-export";
import {
    ColumnMenuItemModel,
    ColumnMenuOpenEventArgs,
    EJ2Intance,
    ExcelQueryCellInfoEventArgs,
    FailureEventArgs,
    Filter,
    FilterEventArgs,
    getComplexFieldID,
    Grid,
    GridModel,
    GroupSettingsModel,
    isComplexField,
    Page,
    QueryCellInfoEventArgs,
    Selection,
    Sort
} from '@syncfusion/ej2-grids';
import {Clipboard} from '@syncfusion/ej2-grids/src/grid/actions/clipboard';
import {ColumnChooser} from '@syncfusion/ej2-grids/src/grid/actions/column-chooser';
import {ColumnMenu} from '@syncfusion/ej2-grids/src/grid/actions/column-menu';
import {ContextMenu} from '@syncfusion/ej2-grids/src/grid/actions/context-menu';
import {Data} from '@syncfusion/ej2-grids/src/grid/actions/data';
import {DetailRow} from '@syncfusion/ej2-grids/src/grid/actions/detail-row';
import {Edit} from '@syncfusion/ej2-grids/src/grid/actions/edit';
import {ExcelExport} from '@syncfusion/ej2-grids/src/grid/actions/excel-export';
import {Group} from '@syncfusion/ej2-grids/src/grid/actions/group';
import {InfiniteScroll} from '@syncfusion/ej2-grids/src/grid/actions/infinite-scroll';
import {PdfExport} from '@syncfusion/ej2-grids/src/grid/actions/pdf-export';
import {Print} from '@syncfusion/ej2-grids/src/grid/actions/print';
import {Reorder} from '@syncfusion/ej2-grids/src/grid/actions/reorder';
import {Resize} from '@syncfusion/ej2-grids/src/grid/actions/resize';
import {RowDD} from '@syncfusion/ej2-grids/src/grid/actions/row-reorder';
import {Scroll} from '@syncfusion/ej2-grids/src/grid/actions/scroll';
import {Search} from '@syncfusion/ej2-grids/src/grid/actions/search';
import {Toolbar} from '@syncfusion/ej2-grids/src/grid/actions/toolbar';
import {BeforeDataBoundArgs, ExcelExportProperties} from "@syncfusion/ej2-grids/src/grid/base/interface";
import {Column} from '@syncfusion/ej2-grids/src/grid/models/column';
import {NumericTextBox} from '@syncfusion/ej2-inputs';
import {DialogModel} from '@syncfusion/ej2-popups';
import {MenuEventArgs} from "@syncfusion/ej2-splitbuttons";
import DOMPurify from 'dompurify';
import {isArray, isFunction} from 'lodash';
import {DOMPurifyNexus, getRandomString} from '../../../BaseUtils';
import {CSS_CLASS_detail_long_text, CSS_CLASS_ellipsis_container, CSS_CLASS_grid_cell_detail} from "../../../Constants";
import {findElementWithTippyTooltip, fontColor, isDev} from '../../../CoreUtils';
import {cssAdd, cssAddSelector} from '../../../CssUtils';
import {EJBase} from '../../../data/Ej2Comm';
import {HttpRequestEvtDataManager} from '../../../data/NexusComm';
import {isNexusDataManager, NexusDataManager} from "../../../data/NexusDataManager";
import {QUERY_OPERATORS} from '../../../gui/WidgetUtils';
import {nexusMain} from '../../../NexusMain';
import {N2Html} from '../../generic/N2Html';
import {rec_field_value, RecFieldVal} from '../../highlight/N2Highlight';
import {N2Dlg_Modal} from '../../jsPanel/N2Dlg_Modal';
import {N2Evt_DomAdded, N2Evt_Resized} from '../../N2';
import {N2GridAuth} from '../../N2Auth';
import {addClassesToElement, addN2Class} from '../../N2HtmlDecorator';
import {CSS_VARS_EJ2} from '../../scss/vars-ej2-common';
import {CSS_VARS_CORE} from '../../scss/vars-material';
import {ThemeChangeEvent, themeChangeListeners} from '../../Theming';
import {ItemModel_N2DropDownMenu, N2DropDownMenu, StateN2DropDownMenu} from '../derived/N2DropDownMenu';
import {getFirstEj2FromModel} from '../Ej2Utils';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';
import {N2Dialog} from './N2Dialog';
import {N2Grid_DropDownMenu} from './util/N2Grid_DropDownMenu';
import {N2Grid_Options_Utils, stateGrid_CustomExcelFilter} from './util/N2Grid_Options';
import {link_widget_dataSource_NexusDataManager} from './util/N2Wrapper_dataSource';

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
    Sort,
    Search,
    Selection,
    Toolbar,
);