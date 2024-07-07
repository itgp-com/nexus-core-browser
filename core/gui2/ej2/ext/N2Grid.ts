nexusMain.UIStartedListeners.add((ev:any)=>{
    link_widget_dataSource_NexusDataManager(Grid.prototype);
}); // normal priority

themeChangeListeners().add((_ev: ThemeChangeEvent) => {
    cssForN2Grid(N2Grid.CLASS_IDENTIFIER, 'e-grid');
}); // normal priority

export interface StateN2GridRef<N2_GRID extends N2Grid = N2Grid> extends StateN2EjBasicRef {
    widget?: N2_GRID;
}

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

    onDMDataManagerExecuteQuery ?:(ev:HttpRequestEvtDataManager)=>void;


} //

export function isN2Grid(widget:any) :boolean{
    return widget?._isN2Grid;
}

export class N2Grid<STATE extends StateN2Grid = StateN2Grid> extends N2EjBasic<STATE, Grid> {
    static readonly CLASS_IDENTIFIER: string = 'N2Grid';

    get classIdentifier(): string { return N2Grid.CLASS_IDENTIFIER; }

    private _ddmenu: N2DropDownMenu;
    private _f_existing_actionFailure: (args: FailureEventArgs) => void;
    private _f_existing_queryCellInfo: (args: ExcelQueryCellInfoEventArgs) => void;
    readonly _isN2Grid:boolean = true;

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

        state.maxExcelRowsExported = state.maxExcelRowsExported || 10000; // default to 1000;

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


        //---------------- Column Menu start ---------------------
        const clearSortSuffix = '_colmenu_clearSort';
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


                // //--------------------- Syncfusion suggested hack to move the filter items to the main column menu (no more filter sub-menu) ---------------------
                // let args = ev;
                // args.items[5].text = args.column.type.replace(/\w+/g,
                //     function (w) {
                //         return w[0].toUpperCase() + w.slice(1).toLowerCase();
                //     }) + ' Filters';
                // args.element.querySelectorAll('li')[5].classList.add('e-submenu');
                // args.items[5].iconCss = 'e-submenu';
                // grid.filterModule.setFilterModel(args.column);
                // let options: IFilterArgs = grid.filterModule.createOptions(args.column, args.element) as IFilterArgs;
                // let excelFilterModule: ExcelFilterBase = grid.filterModule.filterModule['excelFilterBase'];
                // const filterLength: number = (excelFilterModule['existingPredicate'][options.field] && excelFilterModule['existingPredicate'][options.field].length) ||
                //     options.filteredColumns.filter((col: Predicate) => {
                //         return options.field === col.field;
                //     }).length;
                //
                // if (filterLength === 0) {
                //     grid.columnMenuModule['disableItems'].push('Clear Filter');
                // } else {
                //     // remove the clear filter option from the column menu
                //     grid.columnMenuModule['disableItems'] = grid.columnMenuModule['disableItems'].filter((item: string) => {
                //         return item !== 'Clear Filter';
                //     });
                // }
                // excelFilterModule['updateModel'](options);
                // excelFilterModule['menu'] = args.element;
                // excelFilterModule['dlg'] = args.element;
                // excelFilterModule['cmenu'] = grid.createElement('ul', {className: 'e-excel-menu'}) as HTMLUListElement;
                // EventHandler.add(args.element, 'mouseover', (e: any) => {
                //     setTimeout(() => {
                //         if (!e.target || e.target.id !== 'gridcustomfilter') {
                //             if (excelFilterModule['isCMenuOpen']) {
                //                 const submenu: Element = excelFilterModule['menu'].querySelector('.e-submenu');
                //                 if (!isNullOrUndefined(submenu)) {
                //                     submenu.classList.remove('e-selected');
                //                 }
                //                 excelFilterModule['destroyCMenu']();
                //             }
                //             return;
                //         } else {
                //             if (!e.target.classList.contains('e-selected')) {
                //                 excelFilterModule['hoverHandler'](e);
                //             }
                //             // else {
                //             //     const submenu: Element = args.element.querySelector('.e-submenu');
                //             //     if (!isNullOrUndefined(submenu)) {
                //             //         submenu.classList.remove('e-selected');
                //             //     }
                //             //     excelFilterModule['destroyCMenu']();
                //             // }
                //         }
                //     }, 0);
                // }, grid.filterModule.filterModule['excelFilterBase']);
                // //-------------------- end Syncfusion suggested hack ---------------------


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
                        if (ev.items[i].id.endsWith('_colmenu_AutoFitAll')) {
                            let elem = document.getElementById(ev.items[i].id);
                            if (elem) {
                                elem.style.display = 'none';
                            }
                        }
                    } // for

                } // if ! state.enableColumnMenuAutofitAll


                if (f_user_columnMenuOpen != null) {
                    f_user_columnMenuOpen.call(grid, ev);
                }

            } // columnMenuOpen
        } catch (e) { console.error(e); }


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
            } catch (e) { console.error(e); }

            try {
                if (f_user_columnMenuClick != null) {
                    f_user_columnMenuClick.call(grid, ev);
                }
            } catch (e) { console.error(e); }
        } // columnMenuClick

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

                    } catch (e) { console.error(e); }
                } // excelQueryCellInfo
            } catch (e) { console.error(e); }
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

                if (args.requestType == 'filterBeforeOpen') {
                    this.implementExcelFilterValidation.call(this);
                } // if filterBeforeOpen

                if (args.requestType == 'filterchoicerequest') {

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

                } // if filterchoicerequest

                try {
                    if (existingActionBegin)
                        existingActionBegin.call(this.obj, args);
                } catch (e) { console.error(e); }

            } // actionBegin


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
        } catch (e) { console.error(e); }

        super.onDOMAdded(ev);
    } // onDOMAdded


    public onDMDataManagerExecuteQuery(ev:HttpRequestEvtDataManager):void {}



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
            } catch (e) { console.error(e); }
        } // if if (f_actionFailure && this.obj)
    } // actionFailure

    protected queryCellInfo = (args: QueryCellInfoEventArgs) => {

        try {
            this.pre_existing_QueryCellInfo(args);
        } catch (e) { console.error(e); }

        if (this._f_existing_queryCellInfo) {
            try {
                this._f_existing_queryCellInfo.call(this.obj, args);
            } catch (e) { console.error(e); }
        } // if this._f_existing_queryCellInfo

        try {
            this.post_existing_QueryCellInfo(args);
        } catch (e) { console.error(e); }

    } // queryCellInfo

    protected pre_existing_QueryCellInfo = (args: QueryCellInfoEventArgs) => {
        let rec: any = args.data;
        let field: string = args.column.field;
        if (!field)
            return;
        if (containsHighlighing(rec)) {
            // The BIG BIG assumption here is that highlights only apply to text content that has no date, number, or other formatting
            // We simply take the  highlighted value, make a wrapper div, and set highlighted text as content of wrapper div, then make the wrapper the full content of the cell.
            // If the field is not highlighted, then the value_visible is the same as the value

            let recFieldValue = rec_field_value(rec, field);
            if (recFieldValue.is_highlighted) {
                let wrapper_highlight: HTMLElement = highlighted_grid_cell_content();
                wrapper_highlight.innerHTML = recFieldValue.value_visible;
                let cell: HTMLElement = args.cell as HTMLElement;
                cell.innerHTML = ''; // clear
                cell.appendChild(wrapper_highlight);
            }
        } // if containsHighlighing(rec, field
    } // queryCellInfo


    protected post_existing_QueryCellInfo = (args: QueryCellInfoEventArgs) => {

    } // post_existing_QueryCellInfo


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

    protected createDropDownMenu(): void {
        if (this._ddmenu)
            return;

        this._ddmenu = new N2DropDownMenu(this.dropDownMenuState());
    } // createDropDownMenu

    protected dropDownMenuState(): StateN2DropDownMenu {

        let menu_items = this.defaultDropDownMenuItems();
        let menu_target = this.dropDownMenuTarget();
        return {
            target: menu_target,
            dropdown_state: {
                ej: {
                    items: menu_items,
                }, // ej
            }
        } as StateN2DropDownMenu;
    } // dropDownMenuState

    protected dropDownMenuTarget(): HTMLElement {
        return this.obj.element as HTMLElement;
    }

    protected defaultDropDownMenuItems(): ItemModel_N2DropDownMenu[] {
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
                        error_elem.innerHTML = `Invalid value: "<span style="font-weight:bold;color:red;">${DOMPurify.sanitize(invalid_value)}</span>"<p>Please enter a valid first value in format <b>${DOMPurify.sanitize(format)}</b> !`;
                    } else {
                        error_elem.innerHTML = `Please enter a valid value in format <b>${DOMPurify.sanitize(format)}</b> !`;
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
            } catch (e) { console.error(e); }

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
    } catch (e) {}
    if (app_custom_excel_filter_width_number == 0)
        app_custom_excel_filter_width_number = 18;


    let accent = CSS_VARS_CORE.material_accent_color;
    let accentContrastColor = 'white'; // fontColor(accent); // dynamically calculated based on theme color

    let gridHoverBgColor = CSS_VARS_EJ2.grid_hover_bg_color;
    let gridHoverFontColor = fontColor(gridHoverBgColor); // the contrast color to the current background


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

    // Grid cell font type and size
    cssAddSelector(`.${n2GridClass}.e-control.${eGridClass} .e-rowcell`, `
  font-family: var(--app-font-family);
  font-size: var(--app-font-size-regular);    
    `);


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
import {
    EJ2Intance,
    ExcelQueryCellInfoEventArgs,
    Filter,
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
import {ColumnMenuItemModel, ColumnMenuOpenEventArgs, FailureEventArgs} from '@syncfusion/ej2-grids/src/grid/base/interface';
import {Column} from '@syncfusion/ej2-grids/src/grid/models/column';
import {NumericTextBox} from '@syncfusion/ej2-inputs';
import {MenuEventArgs} from '@syncfusion/ej2-navigations';
import {DialogModel} from '@syncfusion/ej2-popups';
import DOMPurify from 'dompurify';
import {isFunction} from 'lodash';
import {cssAddSelector, fontColor, isDev} from '../../../CoreUtils';
import {EJBase} from '../../../data/Ej2Comm';
import {HttpRequestEvtDataManager} from '../../../data/NexusComm';
import {QUERY_OPERATORS} from '../../../gui/WidgetUtils';
import {nexusMain} from '../../../NexusMain';
import {N2Html} from '../../generic/N2Html';
import {containsHighlighing, highlighted_grid_cell_content, rec_field_value} from '../../highlight/N2Highlight';
import {N2Dlg_Modal} from '../../jsPanel/N2Dlg_Modal';
import {N2Evt_DomAdded} from '../../N2';
import {N2GridAuth} from '../../N2Auth';
import {addN2Class} from '../../N2HtmlDecorator';
import {CSS_VARS_EJ2} from '../../scss/vars-ej2-common';
import {CSS_VARS_CORE} from '../../scss/vars-material';
import {ThemeChangeEvent, themeChangeListeners} from '../../Theming';
import {ItemModel_N2DropDownMenu, N2DropDownMenu, StateN2DropDownMenu} from '../derived/N2DropDownMenu';
import {getFirstEj2FromModel} from '../Ej2Utils';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';
import {N2Dialog} from './N2Dialog';
import {N2Grid_DropDownMenu} from './util/N2Grid_DropDownMenu';
import {stateGrid_CustomExcelFilter} from './util/N2Grid_Options';
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