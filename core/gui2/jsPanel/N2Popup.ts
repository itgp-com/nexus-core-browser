export interface N2PopupResult<T = any> {
    ok: boolean;
    cancelled: boolean; // cancel button pressed
    closed: boolean;    // dialog closed via X or other means
    // Result is either null, a single record, or an array of records for multi-select
    result: T[] | T | null;
}

export interface StateN2Popup<T = any> extends StateN2Dlg {
    // Mandatory StateN2Grid to describe N2Grid look and functionality
    stateN2Grid: StateN2Grid;

    // Optional factory for custom N2Grid creation
    n2GridFactory?: (popup: N2Popup<T>, stateN2Grid?: StateN2Grid) => N2Grid<StateN2Grid>;

    // allow multi-select and cross-page cache
    allowMultiple?: boolean; // default: false (single select)

    // optional unique row key for identifying the row for caching between pages. Return the unique key as string or number. If not provided, object identity via JSON.stringify is used as fallback (may not be stable).
    rowKey?: (row: T) => string | number;

    // title convenience (maps to header if provided)
    popupTitle?: string | HTMLElement | N2 | N2[];

    // spinner HTML when opening
    spinner_html?: string;

    // Search hook and options
    onSearch?: (popup: N2Popup<T>, text: string) => Promise<Query>;
    searchPlaceholder?: string;
    /** initial value for the search box; can be a string, a promise that resolves to string, or a function returning string or promise */
    initialSearch?: string | Promise<string> | (() => string | Promise<string>);
    /** properties to override the default N2TextField state used for the search input */
    searchTextFieldProps?: StateN2TextField;
    /** optional tooltip model for the search input (tippy.js props or string content) */
    searchTooltip?: Props;
    /** optional tooltip model for the search button (tippy.js props or string content) */
    searchButtonTooltip?: Props;
    /** icon css for the search button; defaults to 'fas fa-search' */
    searchButtonIconCss?: string;

    // right panel/content customization
    // If provided, takes precedence over buttonsFactory
    rightPanelFactory?: (popup: N2Popup<T>) => HTMLElement | N2;
    // Customize buttons; default creates OK/Cancel vertical stack
    buttonsFactory?: (popup: N2Popup<T>) => HTMLElement | N2;
    okText?: string;
    okIconCss?: string;      // e.g., 'fas fa-check'
    cancelText?: string;
    cancelIconCss?: string;  // e.g., 'fas fa-times'

    // Hook when OK is pressed (before dialog closes); return false to prevent close
    onOK?: (popup: N2Popup<T>, selected: T[] | T | null) => boolean | void | Promise<boolean | void>;
    // Hook when Cancel is pressed
    onCancel?: (popup: N2Popup<T>) => void;
}

/**
 * N2Popup is a dialog-centric component that presents a grid and returns
 * either a single selected record or multiple records based on configuration.
 * It supports cross-page selection caching and a switch to toggle between the
 * current data source and the selected-records view.
 */
export class N2Popup<T = any, STATE extends StateN2Popup<T> = StateN2Popup<T>> extends N2Dlg<STATE> {
    static readonly CLASS_IDENTIFIER = 'N2Popup';

    // panel layout with grid in center and right-side buttons
    private panel: N2PanelGrid<N2Grid>;
    // main grid (original DS)
    private mainGrid: N2Grid<StateN2Grid>;
    // grid backed by selected records (local array DS)
    private selectedGrid?: N2Grid<StateN2Grid>;
    // toggle switch to view selected vs current page
    private viewSelectedSwitch: N2TextSwitch;
    // search field (optional)
    private searchField?: N2TextField;
    // OK/Cancel buttons (default) or custom buttons container
    private okBtn: N2Html;
    private cancelBtn: N2Html;


    // selection cache across all pages: unique by rowKey
    private selectedMap: Map<string, T> = new Map();

    // resolver for the promise returned by show()
    private _resolve?: (r: N2PopupResult<T>) => void;
    // intent flags set by buttons; resolved on dialog close
    private _okPressed: boolean = false;
    private _cancelPressed: boolean = false;

    // currently displayed grid (HTMLElement owner)
    private showingSelected = false;


    private spinnerInitialized: boolean = false;

    // Track last search value sent to the server to avoid duplicate requests
    private lastSearchSent?: string;
    // When true, the next change event from the search field will be ignored (used for search button/init)
    private suppressNextChange: boolean = false;

    constructor(state?: STATE) {
        super(state);
        try {
            loadCSS();
        } catch (e) {
            console.error(e);
        }
    }

    onStateInitialized(state: STATE) {
        if (state.header == null && state.popupTitle != null) state.header = state.popupTitle;
        // Default size similar to SimpleN2Popup
        const jsOpts: JsPanelOptions = state.options || {};
        if (jsOpts.panelSize == null && jsOpts.contentSize == null) {
            jsOpts.panelSize = {width: '85%', height: '85%'};
        }


        // if ( jsOpts.headerControls == null ) {
        //     jsOpts.headerControls = {
        //         smallify: "remove",
        //         maximize: "remove",
        //         normalize: "remove",
        //         minimize: "remove",
        //     }
        // } // if headerControls == null

        state.options = jsOpts;

        if (!state.stateN2Grid) state.stateN2Grid = {};
        if (!state.stateN2Grid.ej) state.stateN2Grid.ej = {} as GridModel;

        try {
            let previous = state.stateN2Grid.onDOMAdded;
            state.stateN2Grid.onDOMAdded = function (ev: N2Evt_DomAdded): void {
                try {
                    if (previous) previous.call(this, ev);
                } catch (e) {
                    console.error(e);
                } finally {

                    ev.element.setAttribute('tabindex', '-1'); // not focusable
                }
            } // onDOMAdded
        } catch (e) {
            console.error(e);
        }

        // Ensure selection settings based on allowMultiple
        this.ensureSelectionMode();

        // content assembly happens here - create mainGrid via factory or provided StateN2Grid
        if (state.n2GridFactory) {
            this.mainGrid = state.n2GridFactory(this, state.stateN2Grid);
        } else {
            this.mainGrid = new N2Grid(state.stateN2Grid || {ej: {} as GridModel} as StateN2Grid);
        }


        // Build optional top bar (search)
        const topBar = this.buildTopBar();
        // Build right panel (buttons and switch)
        const rightPanelElem = this.buildRightPanel();

        this.panel = new N2PanelGrid({
            top: topBar || undefined,
            center: this.mainGrid,
            right: rightPanelElem,
        } as any as StateN2PanelGrid);

        // Add content to dialog
        this.state.content = this.panel;

        const orcaMainScreenElem = document.body;
        // Add spinner on open similar to SimpleN2Popup
        const spinnerHtmlLine = state.spinner_html
            ? `<div style="padding:0 10px 5px 10px;">${DOMPurify.sanitize(state.spinner_html)}</div>`
            : '';

        try {
            let previous = state.onDialogBeforeOpen;
            state.onDialogBeforeOpen = (evt) => {
                try {
                    if (orcaMainScreenElem) {
                        createSpinner({target: orcaMainScreenElem, type: 'Bootstrap5'});
                        //                        createOrcaSpinner01({
                        //                            spinner_target: orcaMainScreenElem,
                        //                            text_content: `
                        // ${spinnerHtmlLine}
                        // <div class="${CSS_FLEX_ROW_DIRECTION}" style="justify-content:center;width:100%; flex-grow:1;">
                        //    <div class="${CSS_CLASS_ORCA_SPINNING_ORCA}"><i class="fas fa-spinner fa-xl fa-spin ${CSS_CLASS_orca_color_font_blue_01}"></i></div>
                        // </div>`,
                        //                        });
                        showSpinner(orcaMainScreenElem);
                    }
                } catch (e) {
                    console.error(e);
                }
                if (previous)
                    previous.call(this, evt);
            };
        } catch (e) {
            console.error(e);
        }

        try {
            let previous = state.onDialogOpen;
            state.onDialogOpen = async (evt) => {

                // wire selection listeners after grid is created
                try {
                    this.wireSelectionHandlers(this.mainGrid);
                } catch (e) {
                    console.error(e);
                } finally {
                    if (orcaMainScreenElem) {
                        setTimeout(() => {
                            hideSpinner(orcaMainScreenElem);
                        }, 100);
                    }
                }

                // apply initial search if provided
                try {
                    await this.applyInitialSearchIfAny();
                } catch (e) { console.error(e); }

                if (previous)
                    previous.call(this, evt);
            };
        } catch (e) {
            console.error(e);
        }

        // try {
        //      let previous = state.onDialogBeforeClose
        //      state.onDialogBeforeClose = (evt) => {
        //
        //                 if (previous)
        //                     previous.call(this, evt);
        //      };
        // } catch (e) { console.error(e); }
        //

        try {
            let previous = state.onDialogClose;
            state.onDialogClose = (evt) => {
                // First call any user-defined onDialogClose
                try {
                    if (previous) previous.call(this, evt);
                } catch (e) {
                    console.error(e);
                }

                // Then unlock the show() promise, using instance data/intent
                if (this._resolve) {
                    let result: N2PopupResult<T>;
                    if (this._okPressed) {
                        result = {ok: true, cancelled: false, closed: false, result: this.collectSelected()};
                    } else if (this._cancelPressed) {
                        result = {ok: false, cancelled: true, closed: false, result: null};
                    } else {
                        result = {ok: false, cancelled: false, closed: true, result: null};
                    }
                    try {
                        this._resolve(result);
                    } catch (e) {
                        console.error(e);
                    }
                    this._resolve = undefined;
                    this._okPressed = false;
                    this._cancelPressed = false;
                }
            };
        } catch (e) {
            console.error(e);
        }

        super.onStateInitialized(state);
    }

    get classIdentifier(): string {
        return N2Popup.CLASS_IDENTIFIER;
    }

    /**
     * Shows the dialog and returns a Promise with the chosen records or null.
     */
    async show(): Promise<N2PopupResult<T>> {
        // Reset intent flags each time we show
        this._okPressed = false;
        this._cancelPressed = false;
        return new Promise<N2PopupResult<T>>((resolve) => {
            this._resolve = resolve;
            super.show();
        });
    }

    private ensureSelectionMode() {
        let thisX: N2Popup = this;
        let allowMultiple = !!this.state.allowMultiple;
        let state = this.state.stateN2Grid;

        const model: GridModel = state.ej;
        const sel: SelectionSettingsModel = model.selectionSettings || {};
        sel.type = allowMultiple ? 'Multiple' : 'Single';
        sel.mode = 'Row';
        sel.checkboxOnly = false;
        // Enable checkbox selection UX and persist selection across paging

        if (!allowMultiple) {
            sel.checkboxMode = 'ResetOnRowClick';

            function rowSelecting(args: RowSelectingEventArgs): void {
                if (args.target && args.target.classList.contains('e-icons')) {
                    let grid: Grid = thisX?.mainGrid?.obj as Grid;
                    if (grid)
                        grid.clearSelection();
                }
            }

            let old_rowSelecting = model.rowSelecting;
            model.rowSelecting = (args: RowSelectingEventArgs) => {
                if (old_rowSelecting) {
                    try {
                        old_rowSelecting.call(this, args);
                    } catch {
                    }
                }
                rowSelecting(args);
            };
        }

        model.selectionSettings = sel;

        // Prepend checkbox column if not present
        const cols: any[] = (model.columns as any[]) || [];
        const hasCheckbox = cols.some(c => c && (c.type === 'checkbox' || c.isCheckboxColumn));
        if (!hasCheckbox) {
            const checkboxCol: any = {
                type: 'checkbox',
                headerTemplate: '<div style="background: transparent;opacity: 0"></div> ',
                displayAsCheckBox: true,
                width: 50,
                maxWidth: 50,
                minWidth: 40,
                allowSorting: false,
                allowFiltering: false,
                allowGrouping: false,
                allowReordering: false,
                showColumnMenu: false,
                showInColumnChooser: false,
                allowSearching: false,
            } as ColumnModel;
            model.columns = [checkboxCol, ...cols];
            // If using frozenColumns numeric, increment to preserve user's originally frozen left columns
            const fc: any = (model as any).frozenColumns;
            if (typeof fc === 'number') {
                (model as any).frozenColumns = fc + 1;
            }
        } else {
            model.columns = cols; // ensure array assigned
        }
    } // ensureSelectionMode

    private buildTopBar(): N2 {
        let thisX: N2Popup = this;
        let state = this.state;
        if (!state.onSearch) return null;

        let children: Elem_or_N2[] = []

        // helper to get current search box value
        const getSearchValue = (): string => {
            const v = (this.searchField?.obj as any)?.value ?? this.searchField?.htmlInputElement?.value ?? '';
            return (v ?? '').toString();
        };

        // Debounced handler for input changes
        // Intentionally non-async: event handlers won't await a debounced function.
        // Delegate to async performSearch(), which handles its own async/UX flow.
        const f_doSearch: (txt: string) => void = debounce(async (txt: string) => {
            await this.performSearch(txt);
        }, 250);


        // Build search field with optional user overrides
        const defaultTextFieldState: StateN2TextField = {
            wrapper: { classes: [CSS_CORE_FLEX_CENTER_ALL_FULL] },
            ej: {
                placeholder: this.state.searchPlaceholder ?? 'Search...',
                change: (args: ChangedEventArgs) => {
                    const value: string = (args as any).value;
                    if (this.suppressNextChange) {
                        // consume one change event (usually following a button-triggered search)
                        this.suppressNextChange = false;
                        if (value === this.lastSearchSent) return;
                    }
                    f_doSearch(value);
                },
                showClearButton: true,
                autocomplete: 'off',
            }
        } as any;

        const mergedTfState: StateN2TextField = {
            ...defaultTextFieldState,
            ...(state.searchTextFieldProps as any || {}),
            ej: {
                ...defaultTextFieldState.ej,
                ...((state.searchTextFieldProps as any)?.ej || {}),
            } as any,
        } as any;

        this.searchField = new N2TextField(mergedTfState);
        children.push(this.searchField);

        // Add a round search button
        const searchBtnIcon = state.searchButtonIconCss ?? `fas fa-search ${CSS_CLASS_N2POPUP_BTN_ICON}`;
        const searchBtn = new N2Html({
            deco: { classes: [CSS_CLASS_N2_ROUNDED_BUTTON, CSS_CLASS_N2POPUP_BTN_SEARCH] },
            value: `<i class="${searchBtnIcon}"></i>`,
            onClick: () => {
                this.suppressNextChange = true; // avoid double-trigger via change
                f_doSearch(getSearchValue());
            }
        });
        children.push(searchBtn);

        // hidden input htmlelement to capture the focusout event
        const hiddenFocusCatcher = document.createElement('input');
        hiddenFocusCatcher.style.position = 'absolute';
        hiddenFocusCatcher.style.opacity = '0';
        hiddenFocusCatcher.style.width = '1px';
        hiddenFocusCatcher.style.height = '1px';
        hiddenFocusCatcher.style.border = 'none';
        hiddenFocusCatcher.style.padding = '0';
        hiddenFocusCatcher.style.margin = '0';
        hiddenFocusCatcher.setAttribute('tabindex', '0'); // make focusable
        children.push(hiddenFocusCatcher);

        this.viewSelectedSwitch = new N2TextSwitch({
            deco: {
                style: `
                display:${state.allowMultiple ? 'flex' : 'none'};
                `
            },
            checked: false,
            disabled: true,
            pill_value: this.getSwitchLabel(false),
            onChange: async (ev: StateN2TextSwitchOnChangeEvent) => {
                const checked = ev.checked;
                await this.toggleSelectedView(!!checked);
                // update pill label when toggled
                this.updateSwitchLabel();
            },
        } as any);
        children.push(this.viewSelectedSwitch);

        let bar = new N2Row({
            deco: {classes: [CSS_CLASS_N2POPUP_TOPBAR]},
            children: children,
        })

        // Apply tooltips if provided
        try {
            // Defer until elements exist in DOM
            setTimeout(() => {
                try {
                    const fieldElem = this.searchField?.htmlElement;
                    if (fieldElem && (state as any).searchTooltip) {
                        htmlElement_addTooltip(fieldElem, state.searchTooltip as any);
                    }
                    const btnElem = (searchBtn as any)?.htmlElement as HTMLElement;
                    if (btnElem && (state as any).searchButtonTooltip) {
                        htmlElement_addTooltip(btnElem, state.searchButtonTooltip as any);
                    }
                } catch (_) { }
            }, 0);
        } catch { }

        return bar;
    }

    private buildRightPanel(): N2 {
        // build switch first (shows count and toggles between views)

        // const container = document.createElement('div');
        // container.classList.add('n2popup-right');
        // container.style.display = 'flex';
        // container.style.flexDirection = 'column';
        // container.style.gap = '8px';

        //
        // // add switch at top
        // container.appendChild(this.viewSelectedSwitch.htmlElement);

        let children: (HTMLElement | N2)[] = [];
        const customRight = this.state.rightPanelFactory?.(this);
        if (customRight) return customRight as any;

        const buttonsHost = this.state.buttonsFactory?.(this) ?? this.defaultButtons();
        children.push(buttonsHost);

        const container = new N2Panel({
            deco: {classes: [CSS_CLASS_N2POPUP_RIGHT]},
            children: children,
        })
        return container;
    }

    private defaultButtons(): N2 {
        let thisX: N2Popup = this;
        const state = this.state;
        const okText = state.okText ?? 'OK';
        const okIcon = state.okIconCss ?? `fas fa-check ${CSS_CLASS_N2POPUP_BTN_ICON}`;
        const cancelText = state.cancelText ?? 'Cancel';
        const cancelIcon = state.cancelIconCss ?? `fas fa-times ${CSS_CLASS_N2POPUP_BTN_ICON}`;


        this.okBtn = new N2Html({
            wrapper: {
                classes: [CSS_CLASS_N2POPUP_BTN_RIGHT_WRAPPER]

            },
            deco: {
                classes: [CSS_CLASS_N2_ROUNDED_BUTTON, CSS_CLASS_N2POPUP_BTN_OK],
            },
            value: `<i class="${okIcon}"></i> <span class="${CSS_CLASS_N2POPUP_BTN_LABEL}">${okText}</span>`,
            onClick: async () => {
                const selected = thisX.collectSelected();
                const proceed = await thisX.state.onOK?.(this, selected) as any;
                if (proceed === false) return;
                // mark intent; actual promise resolve happens on dialog close
                thisX._okPressed = true;
                thisX._cancelPressed = false;
                thisX.close();
            }
        })


        this.cancelBtn = new N2Html({
            wrapper: {
                classes: [CSS_CLASS_N2POPUP_BTN_RIGHT_WRAPPER]

            },
            deco: {
                classes: [CSS_CLASS_N2_ROUNDED_BUTTON
                    , CSS_CLASS_N2POPUP_BTN_CANCEL
                ],
            },
            value: `<i class="${cancelIcon}"></i> <span>${cancelText}</span>
                    `,
            onClick: () => {
                this.state.onCancel?.(this);
                // mark intent; actual promise resolve happens on dialog close
                this._okPressed = false;
                this._cancelPressed = true;
                this.close();
            }
        });

        let wrapper = new N2Column({
            deco: {
                classes: [CSS_CLASS_N2POPUP_RIGHT_BUTTON_PANEL]
            },
            children: [thisX.okBtn, thisX.cancelBtn],
        });

        return wrapper;
    }

    private async performSearch(rawTxt: string) {
        let state = this.state;
        if (!state?.onSearch) return;
        let txt = (rawTxt ?? '').toString();
        if (txt.trim().length === 0) txt = '';
        // Skip duplicate searches (same value as last time)
        if (this.lastSearchSent === txt) return;
        this.lastSearchSent = txt;

        const ejGrid: Grid = this.mainGrid.obj as Grid;
        const realDataSource = ejGrid.dataSource;
        ejGrid.dataSource = [];
        setTimeout(() => {
            this.showSpinner();
            setTimeout(async () => {
                try {
                    ejGrid.pageSettings.currentPage = 1; // reset to first page
                    let query: Query = null;
                    if (txt !== '') {
                        query = await state.onSearch?.(this, txt ?? '');
                    }
                    ejGrid.query = query ?? null;
                } catch (e) {
                    console.error(e);
                } finally {
                    setTimeout(() => {
                        ejGrid.dataSource = realDataSource;
                        this.hideSpinner();
                    }, 50);
                }
            }, 100);
        }, 100);
    }

    private async applyInitialSearchIfAny() {
        const init = this.state?.initialSearch as any;
        if (!init) return; // if null or '' or undefined skip
        try {
            let val: any = init;
            if (typeof init === 'function') val = await init();
            else if (init && typeof init.then === 'function') val = await init; // promise
            const s = (val ?? '').toString();
            // set the textbox value without triggering duplicate search
            try {
                if (this.searchField?.obj) (this.searchField.obj as any).value = s;
                const inp = this.searchField?.htmlInputElement; if (inp) inp.value = s;
            } catch {}
            this.suppressNextChange = true;
            await this.performSearch(s);
        } catch (e) { console.error(e); }
    }

    private wireSelectionHandlers(grid: N2Grid) {
        const ej: Grid = grid.obj;
        ej.rowSelected = (args: RowSelectEventArgs) => {
            const data = args?.data as T;
            this.addToSelectionCache(grid, data);
            this.updateSwitchState();
        };
        ej.rowDeselected = (args: RowDeselectEventArgs) => {
            const data = args?.data as T;
            // Do not remove from cache on non-interactive deselection (e.g., paging, sorting, refresh)
            if (args?.isInteracted) {
                this.removeFromSelectionCache(grid, data);
            }
            this.updateSwitchState();
        };
        // Double click returns the row when single selection is configured
        if (!this.state.allowMultiple) {
            ej.recordDoubleClick = (args: RecordDoubleClickEventArgs) => {
                try {
                    const data = (args && args.rowData) as T;
                    if (data) {
                        this.addToSelectionCache(grid, data);
                        this._okPressed = true;
                        this._cancelPressed = false;
                        this.close();
                    }
                } catch (e) { console.error(e); }
            };
        } // if !allowMultiple

        // when paging/sorting reloads, reselect rows if on page
        ej.dataBound = () => {
            // Re-apply selection on the grid that triggered dataBound
            this.reapplySelectionOnGrid(grid);
        };
    }


    private addToSelectionCache(grid: N2Grid, row: T | T[]) {
        // Some grid events may pass an array of records (e.g., batched selection).
        // Never store arrays in the master cache; flatten to individual records.
        const addOne = (r: T) => {
            const key = this.rowKey(r);
            if (!this.state.allowMultiple) {
                // single-select: clear all previous selections
                this.selectedMap.clear();
            }
            this.selectedMap.set(key, r);
        };
        if (Array.isArray(row)) {
            row.forEach(addOne);
        } else if (row != null) {
            addOne(row as T);
        }
        this.updateSwitchLabel();
    }

    private removeFromSelectionCache(grid: N2Grid, row: T | T[]) {
        const removeOne = (r: T) => {
            const key = this.rowKey(r);
            this.selectedMap.delete(key);
        };
        if (Array.isArray(row)) {
            row.forEach(removeOne);
        } else if (row != null) {
            removeOne(row as T);
        }
        this.updateSwitchLabel();
    }

    private rowKey(row: T): string {
        const f = this.state.rowKey;
        if (f) return String(f(row));
        // fallback: object identity via Symbol, but persist using WeakMap not possible across reloads
        // Use JSON.stringify as a last resort (may not be stable but better than nothing)
        try {
            return JSON.stringify(row);
        } catch {
            return String((row as any)?.id ?? (row as any));
        }
    }

    private totalSelectedCount(): number {
        return this.selectedMap.size;
    }

    private updateSwitchState() {
        const hasAny = this.totalSelectedCount() > 0;
        if (this?.viewSelectedSwitch?.state)
            this.viewSelectedSwitch.state.disabled = (!hasAny);
        this.updateSwitchLabel();
        // if we are showing selected but no more selections, flip back to main grid
        if (this.showingSelected && !hasAny) {
            this.toggleSelectedView(false).catch(console.error);
        }
    }

    private getSwitchLabel(checked: boolean): string {
        const count = this.totalSelectedCount();
        return checked ? `Selected (${count})` : `Current (${count})`;
    }

    private updateSwitchLabel() {
        if (!this.viewSelectedSwitch) return;
        const label = this.getSwitchLabel(this.viewSelectedSwitch.checked);
        this.viewSelectedSwitch.pill_value = label;
    }

    private async toggleSelectedView(showSelected: boolean) {
        if (showSelected === this.showingSelected) return;
        this.showingSelected = showSelected;
        const centerElemHost = this.panel.centerContainer.htmlElement;
        if (!centerElemHost) return;

        if (showSelected) {
            // build combined selections (no paging)
            const allSelected: T[] = Array.from(this.selectedMap.values());
            // build selectedGrid if missing
            if (!this.selectedGrid) {
                const gridModel2: GridModel = clone(this.mainGrid.state.ej || {} as GridModel);
                gridModel2.dataSource = allSelected;
                gridModel2.query = null; // local array
                // disable paging when showing selections (local array)
                if (gridModel2.pageSettings) gridModel2.pageSettings.pageSize = (gridModel2.dataSource as any[])?.length ?? 1000;
                this.selectedGrid = new N2Grid(
                    {
                        onDOMAdded: (ev: N2Evt_DomAdded) => {
                            this.selectedGrid.initLogic();
                            try {
                                this.wireSelectionHandlers(this.selectedGrid);
                            } catch {
                            }
                        },
                        ej: gridModel2
                    });
            } else {
                const ej = this.selectedGrid.obj;
                ej.dataSource = allSelected;
            }
            centerElemHost.replaceChildren(this.selectedGrid.htmlElement);
        } else {
            centerElemHost.replaceChildren(this.mainGrid.htmlElement);
            // Re-apply selection on the current page to reflect any changes made in the selected-only view
            try { this.reapplySelectionOnGrid(this.mainGrid); } catch (e) { console.error(e); }
        }
        // Ask panel to resize the grid to fit
        this.panel.resizeGrid();
    }

    /** Collects selection(s) honoring allowMultiple flag. */
    private collectSelected(): T[] | T | null {
        if (this.state.allowMultiple) {
            return Array.from(this.selectedMap.values());
        } else {
            // single selection: try grid selected records first
            const ej: Grid = this.mainGrid.obj;
            const rows = ej.getSelectedRecords?.() as T[];
            if (rows && rows.length) return rows[0];
            // fall back to cache if any
            for (const v of this.selectedMap.values()) {
                return v;
            }
            return null;
        }
    }

    /** Re-applies selection on a given grid from the cross-page cache for the current page/rows. */
    private reapplySelectionOnGrid(grid: N2Grid) {
        try {
            // Only re-apply if a stable rowKey function is provided
            if (!this.state?.rowKey) return;
            const ej: Grid = grid?.obj as Grid;
            if (!ej || !(ej as any).getRowsObject) return;
            const rowsObj: any[] = (ej as any).getRowsObject() || [];
            const indices: number[] = [];
            rowsObj.forEach((rowObj, idx) => {
                const item = rowObj?.data as T;
                const key = this.rowKey(item);
                if (this.selectedMap.has(key)) indices.push(idx);
            });
            try { ej.clearSelection(); } catch {}
            if (indices.length) {
                try { ej.selectRows(indices); } catch {}
            }
        } catch (e) {
            console.error(e);
        }
    }


    showSpinner() {
        const centerElemHost = this.panel.centerContainer.htmlElement;

        if (!this.spinnerInitialized) {
            createSpinner({
                target: centerElemHost,
                type: 'Bootstrap5'
            })
            this.spinnerInitialized = true;
        }
        showSpinner(centerElemHost);
    } // showSpinner

    hideSpinner() {
        const centerElemHost = this.panel.centerContainer.htmlElement;
        hideSpinner(centerElemHost);
    }


} // class N2Popup

export const CSS_CLASS_N2POPUP_TOPBAR = 'n2popup-topbar';
export const CSS_CLASS_N2POPUP_RIGHT_BUTTON_PANEL = 'n2popup-right-button-panel';
export const CSS_CLASS_N2POPUP_RIGHT = 'n2popup-right';
export const CSS_CLASS_N2POPUP_BTN_RIGHT_WRAPPER = 'n2-popup-btn-right-wrapper';
export const CSS_CLASS_N2POPUP_BTN_OK = 'n2popup-btn-ok';
export const CSS_CLASS_N2POPUP_BTN_CANCEL = 'n2popup-btn-cancel';
export const CSS_CLASS_N2POPUP_BTN_ICON = 'n2popup-btn-icon';
export const CSS_CLASS_N2POPUP_BTN_LABEL = 'n2popup-btn-label';
export const CSS_CLASS_N2POPUP_BTN_SEARCH = 'n2popup-btn-search';

let cssLoaded = false;

function loadCSS(): void {
    if (cssLoaded) return;

    try {
        cssAdd(`



.${CSS_CLASS_N2POPUP_TOPBAR} {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 8px;
  border-bottom: 1px solid #eee;
}

.${CSS_CLASS_N2POPUP_RIGHT} {
  padding: 8px;
  min-width: 180px;
  border-left: 1px solid #eee;
}

.${CSS_CLASS_N2POPUP_RIGHT_BUTTON_PANEL} {
    gap: 10px;
}

.${CSS_CLASS_N2POPUP_BTN_RIGHT_WRAPPER} {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    min-height: 30px;
}

.${CSS_CLASS_N2POPUP_BTN_OK}, .${CSS_CLASS_N2POPUP_BTN_CANCEL} {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    gap: 8px;
    padding: 0 12px;    
    font-size: 14px;
    height: 26px;
    
}

.${CSS_CLASS_N2POPUP_BTN_OK}:hover, .${CSS_CLASS_N2POPUP_BTN_CANCEL}:hover {
   font-size: 15px;
}

.${CSS_CLASS_N2POPUP_BTN_ICON} {
    color: var(--app-color-blue);
    width: 1.1ch;
}
.${CSS_CLASS_N2POPUP_BTN_LABEL} {
    width: 6ch;
}

.${CSS_CLASS_N2POPUP_BTN_SEARCH} {
    height: 24px;
    width: 36px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}


    `,
            'N2Popup'
        ); // cssAdd
    } catch (e) {
        console.error(e);
    }

    cssLoaded = true;

} // loadCSS


import {Query} from "@syncfusion/ej2-data";
import {
    ColumnModel,
    Grid,
    GridModel, RecordDoubleClickEventArgs,
    RowDeselectEventArgs,
    RowSelectEventArgs,
    SelectionSettingsModel
} from "@syncfusion/ej2-grids";
import {RowSelectingEventArgs} from "@syncfusion/ej2-grids/src/grid/base/interface";
import {ChangedEventArgs} from "@syncfusion/ej2-inputs/src/textbox/textbox";
import {createSpinner, hideSpinner, showSpinner} from "@syncfusion/ej2-popups";
import DOMPurify from 'dompurify';
import {clone, debounce} from "lodash";
import {Props} from "tippy.js";
import {cssAdd} from "../../CssUtils";
import {htmlElement_addTooltip} from "../../utils/TippyUtils";
import {N2PanelGrid, StateN2PanelGrid} from "../ej2/derived/N2PanelGrid";
import {N2Grid, StateN2Grid} from "../ej2/ext/N2Grid";
import {N2TextField, StateN2TextField} from "../ej2/ext/N2TextField";
import {N2Column} from "../generic/N2Column";
import {N2Html} from "../generic/N2Html";
import {N2Panel} from "../generic/N2Panel";
import {N2Row} from "../generic/N2Row";
import {N2TextSwitch, StateN2TextSwitchOnChangeEvent} from "../generic/N2TextSwitch";
import {N2, N2Evt_DomAdded} from "../N2";
import {Elem_or_N2} from "../N2Utils";
import {CSS_CLASS_N2_ROUNDED_BUTTON, CSS_CORE_FLEX_CENTER_ALL_FULL} from "../scss/core";
import {N2Dlg, StateN2Dlg} from "./N2Dlg";