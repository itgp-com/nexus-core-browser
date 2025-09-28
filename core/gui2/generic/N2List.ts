
import {isNumber, isString, toString} from "lodash";
import {cssAdd} from "../../CssUtils";
import {EJList} from "../../data/Ej2Comm";
import {N2Evt_DomAdded, N2Evt_OnHtml} from "../N2";
import {N2Basic, StateN2Basic, StateN2BasicRef} from "../N2Basic";
import {addN2Class} from "../N2HtmlDecorator";
import {createN2HtmlBasic, Elem_or_N2} from "../N2Utils";
import {
    N2DnD,
    N2DnD_DraggedData,
    N2DnD_OnDrag,
    N2DnD_OnDragEnd,
    N2DnD_OnDragEnter,
    N2DnD_OnDragLeave,
    N2DnD_OnDragOver,
    N2DnD_OnDragStart,
    N2DnD_OnDrop,
    StateN2DnD
} from './N2DnD';
import {N2Row} from "./N2Row";


export class N2List<RECORD_TYPE = any, STATE extends StateN2List_Complete<RECORD_TYPE> = StateN2List_Complete<RECORD_TYPE>> extends N2Basic<STATE, N2List> {
    public static readonly CLASS_IDENTIFIER: string = 'N2List';


    private _lastDropPosition: 'above' | 'below' | null = null;
    private _lastSelectedIndex: number | null = null;    // For handling selection logic
    private _lastSelection: N2List_Selection<RECORD_TYPE> = {indexes: [], records: []}; // Stores the last selection state for comparison.
    private _selectAllCurrentViewInProgress = false;


    constructor(state: Omit<STATE, keyof InternalStateN2List<RECORD_TYPE>>) {
        super(state as STATE);

        try {
            loadCSS();
        } catch (e) {
            console.error(e);
        }

        // `_state` is a cast version of `state` that includes InternalStateN2List properties
        let _state: STATE = state as STATE;
        // document.addEventListener('dragend', this.handleGlobalDragEnd); // Ensure dragend is always handled


        // Step 1: Copy local_data to _local_data
        _state._local_data = _state.local_data;

        // Step 2: Delete the local_data property
        delete _state.local_data;

        // Step 3: Dynamically define getter and setter that will update the totalRecords when local_data is set
        Object.defineProperty(_state, 'local_data', {
            get(): RECORD_TYPE[] {
                return this._local_data || [];
            },
            set(data: RECORD_TYPE[]) {
                this._local_data = data;
                if (data && Array.isArray(data))
                    this._totalRecords = data.length;
            },
            enumerable: true,
            configurable: true,
        });

        if (_state.local_data.length > 0)
            _state._totalRecords = _state.local_data.length;


        // Initialize `_state` properties with default values if undefined
        if (!isNumber(_state.currentPage) || _state.currentPage < 1) _state.currentPage = 1;
        if (!isNumber(_state.pageSize) || _state.pageSize < 1) _state.pageSize = 50;
        if (!isNumber(_state._totalRecords)) _state._totalRecords = -1; // -1 means no initial data, and no call to db yet
        if (_state._pages == null) _state._pages = new Map();
        if (_state._selectedRecords == null) _state._selectedRecords = new Set();
        if (_state.allSelected === undefined) _state.allSelected = false;


        if (_state.cachedPagesRange == null) _state.cachedPagesRange = 1;
        if (_state.multiSelect === undefined) _state.multiSelect = false;
    } // constructor

    reset_state() {

        let _state = this.state;
        _state.currentPage = 1;
        // _state.pageSize = 50;
        _state._totalRecords = -1; // -1 means no initial data, and no call to db yet
        _state._pages = new Map();
        _state._selectedRecords = new Set();
        _state.allSelected = false;
        _state.cachedPagesRange = 1;

        this._lastSelectedIndex = null;
        this._lastSelection = {indexes: [], records: []};
        this._selectAllCurrentViewInProgress = false;
    }


    protected onStateInitialized(state: STATE): void {
        addN2Class(state.deco, N2List.CLASS_IDENTIFIER);

        super.onStateInitialized(state);
    }

    onHtml(args: N2Evt_OnHtml): HTMLElement {
        let elem = createN2HtmlBasic<StateN2Basic>(this.state); // container
        return elem;
    }

    public onDOMAdded(ev: N2Evt_DomAdded): void {
        let thisX = this;
        setTimeout(async () => {
            await thisX._loadDataAndRender();
            if (thisX.state.onInitialized) {
                thisX.state.onInitialized.call(thisX, thisX);
            }
        });
        super.onDOMAdded(ev);
    } // onDOMAdded

    public async refresh(keep_state: boolean = false): Promise<void> {

        if (!keep_state) {
            this.reset_state();
        }
        await this._loadDataAndRender();
    }

    public clearSelection() {
        try {
            this.state._selectedRecords!.clear();
            // Ensure the global allSelected flag is reset so UI won't keep everything selected
            this.state.allSelected = false;
            // Uncheck all checkboxes and remove selected class
            Array.from(this.htmlElement.children).forEach(child => {
                const row = child as HTMLElement;
                const checkbox = row.querySelector(`.${CSS_CLASS_N2LIST.CHECKBOX}`) as HTMLInputElement;
                if (checkbox)
                    checkbox.checked = false;
                row.classList.remove(CSS_CLASS_N2LIST.SELECTED);
            });

            // Only trigger selection change if not suppressed
            if (!this.state.suppressSelectionEvents) {
                this._handleSelectionChange.call(this);
            }
        } catch (error) {
            console.error('Error clearing selection:', error);
        }
    } // clearSelection

    public get currentViewRecords(): RECORD_TYPE[] {
        return this.state._pages!.get(this.state.currentPage!) || [];
    }

    public getRowHTMLElementById(rec_id: string): HTMLElement | null {
        return this.htmlElement.querySelector(`.${CSS_CLASS_N2LIST.ROW}[data-id="${rec_id}"]`) as HTMLElement | null;
    }

    public getRecordById(id: string): RECORD_TYPE | undefined {
        try {
            for (let records of this.state._pages!.values()) {
                const record = records.find(r => this.idForRecord(r) === id);
                if (record) return record;
            }
            return undefined;
        } catch (error) {
            console.error('Error getting record by ID:', error);
            return undefined;
        }
    } // getRecordById

    public getRecordByIndex(index: number): RECORD_TYPE | null {
        try {
            const records = this.state._pages!.get(this.state.currentPage!)!;
            if (!records) return null;
            if (index < 0 || index >= records.length) {
                return null;
            }
            return records[index];
        } catch (error) {
            console.error('Error getting record by index:', error);
            return null;
        }
    }

    public getIndexesById(id: string | string[]): number[] {
        const ids = Array.isArray(id) ? id : [id];
        const allRecords: RECORD_TYPE[] = [];
        for (let records of this.state._pages!.values()) {
            allRecords.push(...records);
        }
        return ids.map(searchId => {
            const idx = allRecords.findIndex(record => this.idForRecord(record) === searchId);
            return idx !== -1 ? idx : -1;
        });
    } // getIndexesById

    public getIndexesByRecord(record: RECORD_TYPE | RECORD_TYPE[]): number[] {
        const param_records = Array.isArray(record) ? record : [record];
        const allRecords: RECORD_TYPE[] = [];
        for (let records of this.state._pages!.values()) {
            allRecords.push(...records);
        }
        return param_records.map(param_rec => {
            const idx = allRecords.findIndex(record => this.idForRecord(record) === this.idForRecord(param_rec));
            return idx !== -1 ? idx : -1;
        });
    } // getIndexesByRecord

    /**
     * Returns the current selection including both indexes and data records.
     */
    public getSelection(): N2List_Selection<RECORD_TYPE> {
        const indexes: number[] = [];
        const records: RECORD_TYPE[] = [];

        let pageRecords = this.state._pages.get(this.state.currentPage);
        if (pageRecords != null) {
            try {
                Array.from(pageRecords).forEach((record, index) => {
                    const rec_id = this.idForRecord(record);
                    if (this.state._selectedRecords!.has(rec_id)) {
                        indexes.push(index);
                        records.push(record);
                    }
                });
            } catch (error) {
                console.error('Error getting current selection:', error);
            }
        } // if (pageRecords != null)

        return {indexes, records};
    } // getSelection

    /**
     * Move records in the current page to the specified index. Call render separately to update the view.
     * @param {RECORD_TYPE[]} records
     * @param {number} targetIndex whene in the original currentRecords array will the records be moved to
     */
    public moveRecords(records: RECORD_TYPE[], targetIndex: number) {
        if (records.length > 0) {
            // Implement the logic to reorder records within the current page
            const currentRecords = this.currentViewRecords;
            const fromIndices: number[] = [];
            const recordsToMove: RECORD_TYPE[] = records;

            // Remove records from their original positions
            recordsToMove.forEach(record => {
                const fromIndex = currentRecords.findIndex(r => this.idForRecord(r) === this.idForRecord(record));
                if (fromIndex !== -1) {
                    fromIndices.push(fromIndex);
                }
            });

            // Sort indices descending to remove without affecting subsequent indices
            fromIndices.sort((a, b) => b - a);
            fromIndices.forEach(fromIndex => {
                currentRecords.splice(fromIndex, 1);
                if (fromIndex < targetIndex)
                    targetIndex--;
            });

            // Insert records at the drop position
            currentRecords.splice(targetIndex, 0, ...recordsToMove);


            // Update the page records
            this.state._pages!.set(this.state.currentPage!, currentRecords);

        } // if records.length > 0
    } // moveRecords

    public async navigateToPrevPage(): Promise<boolean> {
        return await this.navigateToPage(this.state.currentPage - 1);
    } // navigateToPrevPage

    public async navigateToNextPage(): Promise<boolean> {
        return await this.navigateToPage(this.state.currentPage + 1);
    } // navigateToNextPage

    public async navigateToFirstPage(): Promise<boolean> {
        return await this.navigateToPage(1);
    } // navigateToFirstPage

    public async navigateToLastPage(): Promise<boolean> {
        const totalPages = this.state.pageSize! > 0 ? Math.ceil(this.state._totalRecords! / this.state.pageSize!) : 0;
        return await this.navigateToPage(totalPages);
    } // navigateToLastPage

    public async navigateToPage(page: number): Promise<boolean> {

        try {
            let success: boolean = await this._getData(page);
            if (success)
                await this.render();
            return success;
        } catch (error) {
            console.error(`Error navigating to page ${page}:`, error);
        }
        return false;
    } // navigateToPage

    /**
     * Refresh the UI of the list by re-rendering the rows.
     * @return {Promise<void>}
     */
    public async render(): Promise<void> {
        await this._render_implementation();
    }

    public dropIndicator_Remove_LocalListItems() {
        try {
            if (N2DnD.dropIndicator) {
                N2DnD.dropIndicator.remove();
                N2DnD.dropIndicator = null;
            }
        } catch (error) {
            console.error('Error removing drop indicator:', error);
        }
    } // removeDropIndicator

    public dropIndicator_Show_LocalListItems(target: HTMLElement, clientY: number) {
        try {

            this.dropIndicator_Remove_LocalListItems();

            const rect = target.getBoundingClientRect();
            const indicator = document.createElement('div');
            indicator.className = CSS_CLASS_N2LIST.DROP_INDICATOR;

            const offset = clientY - rect.top;
            if (offset < rect.height / 2) {
                indicator.style.top = `${target.offsetTop}px`;
                this._lastDropPosition = 'above'; // Indicator is above the row
            } else {
                indicator.style.top = `${target.offsetTop + rect.height}px`;
                this._lastDropPosition = 'below'; // Indicator is below the row
            }

            this.htmlElement.appendChild(indicator);

            N2DnD.dropIndicator = indicator;
        } catch (error) {
            console.error('Error showing drop indicator:', error);
        }
    } // showDropIndicator

    public get selectAllCurrentView() {
        return this.state.allSelected;
    }

    public set selectAllCurrentView(allSelected: boolean) {
        if (this._selectAllCurrentViewInProgress) return; // avoid reentrancy
        this._selectAllCurrentViewInProgress = true;
        try {
            if (!this.state.multiSelect) {
                // Single-select mode: degrade behavior
                if (allSelected) {
                    // Select only the first visible row (if any) and keep allSelected=false
                    this.state._selectedRecords!.clear();
                    const first = this.currentViewRecords?.[0];
                    if (first != null) {
                        const id = this.idForRecord(first);
                        this.state._selectedRecords!.add(id);
                    }
                    this.state.allSelected = false;
                } else {
                    // Deselect all
                    this.state._selectedRecords!.clear();
                    this.state.allSelected = false;
                }

                if (this.state.onSelectAll) {
                    this.state.onSelectAll.call(this, this.state);
                }
                this._handleSelectionChange.call(this);

                let thisX = this;
                setTimeout(async () => {
                    await thisX.render.call(thisX)
                });
                return;
            }

            // Multi-select mode (existing behavior)
            this.state.allSelected! = allSelected;

            if (allSelected) {
                // Select all records
                for (let page = 1; page <= Math.ceil(this.state._totalRecords! / this.state.pageSize!); page++) {
                    const records = this.state._pages!.get(page);
                    if (records) {
                        records.forEach((record: any) => this.state._selectedRecords!.add(this.idForRecord(record)));
                    }
                }
            } else {
                // Deselect all
                this.state._selectedRecords!.clear();
            }

            // Trigger callback
            if (this.state.onSelectAll) {
                this.state.onSelectAll.call(this, this.state);
            }

            // Handle selection change
            this._handleSelectionChange.call(this);

            // Re-render to update row styles and checkboxes

            let thisX = this;
            // Re-render to update row styles
            setTimeout(async () => {
                await thisX.render.call(thisX)
            });
        } catch (error) {
            console.error('Error handling select all:', error);
        } finally {
            this._selectAllCurrentViewInProgress = false;
        }
    } // selectAllCurrentView

    /**
     * Selects one or more rows based on the provided data records.
     * @param param single record or array of records to select.
     */
    public selectRowsByRecord(param: RECORD_TYPE | RECORD_TYPE[]): void {
        if (param == null) return;
        if (!this.state.multiSelect) {
            const record = Array.isArray(param) ? param[0] : param;
            if (record == null) return;
            const id = this.idForRecord(record);
            // If already the only selected, do nothing
            if (this.state._selectedRecords!.size === 1 && this.state._selectedRecords!.has(id)) return;
            this.state._selectedRecords!.clear();
            this.state._selectedRecords!.add(id);
            this.state.allSelected = false;
            this._handleSelectionChange();
            setTimeout(async () => {
                await this.render();
            });
            return;
        }
        let records: RECORD_TYPE[] = Array.isArray(param) ? param : [param];
        let updated = false;

        if (records.length === 0) {
            updated = true;
        } else {
            records.forEach(record => {
                const rec_id = this.idForRecord(record);
                if (!this.state._selectedRecords!.has(rec_id)) {
                    this.state._selectedRecords!.add(rec_id);
                    updated = true;
                } // if (this.state._selectedRecords.has(rec_id))
            }); // records.forEach
        } // if (records.length === 0)

        if (updated) {
            // Update selectAllCurrentView if all records are selected
            if (this.state._selectedRecords!.size === this.currentViewRecords.length && this.currentViewRecords.length > 0) {
                this.state.allSelected = true;
            } // if (this.state._selectedRecords.size === this.currentViewRecords.length)

            // Handle selection change callbacks
            this._handleSelectionChange();

            // Re-render to ensure UI consistency
            setTimeout(async () => {
                await this.render();
            });
        } // if (updated)
    } // selectRowsByRecord

    /**
     * Selects one or more rows based on the provided indexes.
     * @param param  single index or array of indexes to select.
     */
    public selectRowsByIndex(param: number | number[]): void {
        if (param == null) return;
        if (!this.state.multiSelect) {
            const index = Array.isArray(param) ? param[0] : param;
            const record = this.getRecordByIndex(index);
            if (!record) return;
            const id = this.idForRecord(record);
            if (this.state._selectedRecords!.size === 1 && this.state._selectedRecords!.has(id)) return;
            this.state._selectedRecords!.clear();
            this.state._selectedRecords!.add(id);
            this.state.allSelected = false;
            this._handleSelectionChange();
            setTimeout(async () => {
                await this.render();
            });
            return;
        }
        let indexes: number[] = Array.isArray(param) ? param : [param];
        let updated = false;

        if (indexes.length === 0) {
            updated = true;
        } else {
            indexes.forEach(index => {
                const record = this.getRecordByIndex(index);
                if (record) {
                    const rec_id = this.idForRecord(record);
                    if (!this.state._selectedRecords!.has(rec_id)) {
                        this.state._selectedRecords!.add(rec_id);
                        updated = true;
                    } // if (record)
                } // if (record)
            }); // indexes.forEach
        } // if (indexes.length === 0)

        if (updated) {
            // Update selectAllCurrentView if all records are selected
            if (this.state._selectedRecords!.size === this.currentViewRecords.length && this.currentViewRecords.length > 0) {
                this.state.allSelected = true;
            } // if (this.state._selectedRecords.size === this.currentViewRecords.length)

            // Handle selection change callbacks
            this._handleSelectionChange();

            // Re-render to ensure UI consistency
            setTimeout(async () => {
                await this.render();
            });
        } // if (updated)
    } // selectRowsByIndex


    /**
     * Selects the first row in the current view.
     */
    public selectFirstRow(): void {
        this.selectRowsByIndex(0);
    }

    /**
     * Selects one or more rows based on the provided record IDs.
     * @param param A single record ID or an array of record IDs to select.
     */
    public selectRowsById(param: string | string[]): void {
        if (param == null) return;

        if (!this.state.multiSelect) {
            const id = Array.isArray(param) ? param[0] : param;
            if (id == null) return;
            if (this.state._selectedRecords!.size === 1 && this.state._selectedRecords!.has(id)) return;
            this.state._selectedRecords!.clear();
            this.state._selectedRecords!.add(id);
            this.state.allSelected = false;
            this._handleSelectionChange();
            setTimeout(async () => {
                await this.render();
            });
            return;
        }

        // Normalize the parameter to an array of strings
        const ids: string[] = Array.isArray(param) ? param : [param];
        let updated = false;

        if (ids.length === 0) {
            updated = true;
        } else {

            ids.forEach(id => {
                if (!this.state._selectedRecords!.has(id)) {
                    this.state._selectedRecords!.add(id);
                    updated = true;
                } // if (!selectedRecords.has(id))
            }); // ids.forEach
        } // if (ids.length === 0)

        if (updated) {
            // Update selectAllCurrentView if all records in the current view are selected
            const allSelected = this.currentViewRecords.every(record => {
                const rec_id = this.idForRecord(record);
                return this.state._selectedRecords!.has(rec_id);
            });
            this.state.allSelected = allSelected;

            // Handle selection change callbacks
            this._handleSelectionChange();

            // Re-render to ensure UI consistency
            setTimeout(async () => {
                await this.render();
            });
        } // if (updated)
    } // selectRowsById


    /**
     * Deselects one or more rows based on the provided data records.
     * @param param single record or array of records to deselect.
     */
    public deselectRowsByRecord(param: RECORD_TYPE | RECORD_TYPE[]): void {
        if (param == null) return;
        let records: RECORD_TYPE[] = Array.isArray(param) ? param : [param];
        let updated = false;

        records.forEach(record => {
            const rec_id = this.idForRecord(record);
            if (this.state._selectedRecords!.has(rec_id)) {
                this.state._selectedRecords!.delete(rec_id);
                updated = true;
            } // if (this.state._selectedRecords.has(rec_id))
        });

        if (updated) {
            // Update selectAllCurrentView as not all records are selected anymore
            this.state.allSelected = false;

            // Handle selection change callbacks
            this._handleSelectionChange();

            // Re-render to ensure UI consistency
            setTimeout(async () => {
                await this.render();
            });
        }
    } // deselectRowsByRecord

    /**
     * Deselects one or more rows based on the provided indexes.
     * @param indexes single index or array of indexes to deselect.
     */
    public deselectRowsByIndex(param: number | number[]): void {
        if (param == null) return;
        let indexes: number[] = Array.isArray(param) ? param : [param];
        let updated = false;

        indexes.forEach(index => {
            const record = this.getRecordByIndex(index);
            if (record) {
                const rec_id = this.idForRecord(record);
                if (this.state._selectedRecords!.has(rec_id)) {
                    this.state._selectedRecords!.delete(rec_id);
                    updated = true;

                } // if (this.state._selectedRecords!.has(rec_id))
            } // if (record)
        }); // indexes.forEach

        if (updated) {
            // Update selectAllCurrentView as not all records are selected anymore
            this.state.allSelected = false;

            // Handle selection change callbacks
            this._handleSelectionChange();

            // Re-render to ensure UI consistency
            setTimeout(async () => {
                await this.render();
            });
        } // if (updated)
    } // deselectRowsByIndex

    public deselectRowsById(param: string | string[]): void {
        if (param == null) return;

        // Normalize the parameter to an array of strings
        const ids: string[] = Array.isArray(param) ? param : [param];
        let updated = false;

        ids.forEach(id => {
            if (this.state._selectedRecords!.has(id)) {
                this.state._selectedRecords!.delete(id);
                updated = true;
            } // if (selectedRecords.has(id))
        });

        if (updated) {
            // Update selectAllCurrentView if not all records in the current view are selected
            const allSelected = this.currentViewRecords.every(record => {
                const rec_id = this.idForRecord(record);
                return this.state._selectedRecords!.has(rec_id);
            });
            this.state.allSelected = allSelected;

            // Handle selection change callbacks
            this._handleSelectionChange();

            // Re-render to ensure UI consistency
            const thisX = this;
            setTimeout(async () => {
                await thisX.render();
            });
        }
    } // deselectRowsById


    // misc getters
    public get lastSelection(): { indexes: number[]; records: RECORD_TYPE[] } {
        return this._lastSelection;
    }

    public get lastSelectedIndex(): number | null {
        return this._lastSelectedIndex;
    }

    public get lastDropPosition(): "above" | "below" | null {
        return this._lastDropPosition;
    }


    //-----------------------------------------------------------
    //----------------- Protected methods -----------------------
    //-----------------------------------------------------------

    /**
     * Return the id for the record using the state.id function, but ENSURE it's converted to a string (using _.toString(id) if necessary)
     * @param {RECORD_TYPE} record
     * @return {string}
     * @protected
     */
    protected idForRecord(record: RECORD_TYPE): string {
        let id: string
        if (this.state.id)
            id = this.state.id(record);

        if (id != null) {
            if (!isString(id)) { //lodash isString method
                id = toString(id); //lodash toString method
            } // if (!isString(id))
        } // if ( id != null)
        return id;
    } // idForRecord


    protected async _loadDataAndRender() {
        let data_load_success: boolean = false;
        try {
            data_load_success = await this._getData(this.state.currentPage!);
        } catch (error) {
            console.error('Error loading data:', error, this);
        }

        this.state._data_load_success = data_load_success;
        try {

            try {
                this.state.onDataLoaded?.call(this, this, this.state);
            } catch (error) {
                console.error(`Error in handling 'onDataLoaded' event by user code`, error, this);
            }
        } catch (error) {
            console.error('Error initializing virtual list:', error, this);
        }


        if (data_load_success) {
            try {
                await this.render();
                // now see if we need and initial selection
                if (this.state.initialSelection != null) {
                    if (Array.isArray(this.state.initialSelection)) {
                        if (this.state.initialSelection.length > 0) {
                            if (typeof this.state.initialSelection[0] === 'string') {
                                this.selectRowsById(this.state.initialSelection as string[]);
                            } else {
                                this.selectRowsByRecord(this.state.initialSelection as RECORD_TYPE[]);
                            }
                        } // if ( this.state.initialSelection.length > 0)
                    } // if (Array.isArray(this.state.initialSelection))
                } else if (this.state.allSelected == true) {
                    this.selectAllCurrentView = true; // the setter actually selects all the records
                }
            } catch (error) {
                console.error('Error setting initial selection:', error);
            } finally {
                this.state.initialSelection = [];
            }
        } // if (data_load_success)
    } // _loadDataAndRender

    protected async _defaultGetData(page: number): Promise<EJList> {
        let retval: EJList = new EJList()
        retval.result = [];
        retval.count = 0;

        let data = this.state.local_data;
        if (data == null || !Array.isArray(data)) {
            data = [];
        }

        if (data.length > 0) {
            try {
                let total_records = data.length;
                const start = (page - 1) * this.state.pageSize;
                const end = Math.min(start + this.state.pageSize, total_records);

                let records: RECORD_TYPE[] = [];

                if (start >= 0 && start < total_records && end > start && end <= total_records) {
                    // everything is fine (inside the array)
                    records = data.slice(start, end);
                }

                retval.result = records;
                retval.count = total_records;

            } catch (error) {
                console.error(`Error fetching data for page ${page}:`, error);
                throw error; // Rethrow to be handled by caller
            }

        } // if ( data.length > 0)


        return retval;
    }

    /**
     * This must stay protected and not be directly use. Use the navigateToPage functions instead.
     * @param {number} pageNumber
     * @return {Promise<boolean>} returns success (true) or failure (false)
     * @protected
     */
    protected async _getData(pageNumber: number): Promise<boolean> {

        if (this.state._totalRecords !== -1) {
            // if either local_data set or getData already called at least once
            const totalPages = this.state.pageSize! > 0 ? Math.ceil(this.state._totalRecords! / this.state.pageSize!) : 0;
            if (pageNumber < 1 || pageNumber > totalPages) {
                return false; // could not load that page so no changes made
            }
        } // if ( this.state._totalRecords != -1)

        let success: boolean = true;
        try {

            this.startSpinner();

            if (this.state._pages!.has(pageNumber))
                return true; // data already loaded, ready to render, so success

            try {
                let data: EJList;

                if (this.state.getData) {
                    let skip: number = (pageNumber - 1) * this.state.pageSize!;
                    if (skip < 0) skip = 0;
                    let take: number = this.state.pageSize!;
                    data = await this.state.getData.call(this, pageNumber);
                } else {
                    // use default method
                    data = await this._defaultGetData.call(this, pageNumber);
                }
                if (data == null) {
                    data = new EJList();
                    data.result = [];
                    data.count = 0;
                }

                this.state._pages!.set(pageNumber, data.result); // update the list page number
                this.state._totalRecords = data.count;
            } catch (error) {
                console.error(`Error loading page ${pageNumber}:`, error);
                this.state.onError_GetData({
                    error: error,
                    pageNumber: pageNumber,
                    state: this.state,
                    widget: this
                });

                success = false;
            }

            if (success) {
                try {
                    this.state._pages!.keys().forEach((key: number) => {
                        if (Math.abs(pageNumber - key) > this.state.cachedPagesRange!) {
                            this.state._pages!.delete(key);
                        }
                    });
                } catch (error) {
                    console.error(`Error managing cached pages:`, error);
                    this.state.onError_PageClear({
                        error: error,
                        state: this.state,
                        widget: this
                    })
                }
            } // if (success)
        } finally {
            if (success)
                this.state.currentPage = pageNumber;
            this.stopSpinner();
        }
        return success;
    } // _loadPage


    private _renderInProgress: boolean = false;
    private _renderWaiting: boolean = false;

    /**
     * The umbrella method to render the list. Calls the renderRow callback for each record.
     *
     * This method is protected and should not be called directly. Use the render() method instead.
     *
     * @param overwrite_renderInProgress Optional parameter to allow overwriting the _renderInProgress flag during re-runs.
     * @return {Promise<Error>} Returns null or an error if one occurred.
     * @protected
     */
    protected async _render_implementation(overwrite_renderInProgress: boolean = false): Promise<Error> {
        // If a render is already in progress
        if (this._renderInProgress) {
            if (overwrite_renderInProgress) {
                // Allow overwrite for re-runs
                // No action needed; proceed with rendering
            } else {
                // Set the waiting flag and exit early
                this._renderWaiting = true;
                return null;
            }
        } else {
            // Indicate that rendering has started
            this._renderInProgress = true;
        }

        try {
            // Clear existing content
            this.htmlElement.innerHTML = '';

            const records = this.currentViewRecords;
            for (let index = 0; index < records.length; index++) {

                // Before processing each record, check if a new render was requested
                if (this._renderWaiting) {
                    // Reset the waiting flag
                    this._renderWaiting = false;
                    // Exit the loop early to restart rendering
                    break;
                }

                let rowElement: HTMLElement;
                try {
                    rowElement = await this.render_row(index);
                } catch (error) {
                    this.state.onError_RowRender({
                        error: error,
                        index: index,
                        record: (index >= 0 && index < records?.length ? records[index] : null),
                        state: this.state,
                        widget: this
                    });
                }

                if (rowElement != null)
                    this.htmlElement.appendChild(rowElement);

            } // for records

            // After completing the loop, check if a render was requested during the loop
            if (this._renderWaiting) {
                // Reset the waiting flag
                this._renderWaiting = false;
                // Restart the rendering process with overwrite
                await this._render_implementation(true);
                return null; // Exit early as the re-render has been initiated
            }

            // -- If no exception triggered then:

            // Trigger update of paging buttons state (onPagingChange callback)
            if (this.state.onPagingChange) {
                this.state.onPagingChange.call(this, this._createPagingChangeEvent());
            }

            // Trigger onRendered callback
            if (this.state.onRendered) {
                this.state.onRendered.call(this, this, this.state);
            }
        } catch (error) {
            console.error('Error rendering virtual list:', error);
            return error;
        } finally {
            if (overwrite_renderInProgress) {
                // If this was a re-run, ensure _renderInProgress remains true until the final completion
                // This is handled by the recursive call above
            } else {
                // Indicate that rendering has finished
                this._renderInProgress = false;

                // Check if a render was requested while this render was in progress
                if (this._renderWaiting) {
                    // Reset the waiting flag
                    this._renderWaiting = false;
                    // Restart the rendering process with overwrite
                    await this._render_implementation(true);
                }
            }
        }

        return null;
    } // _render_implementation


    public async render_row(index: number, replace_in_DOM: boolean = false): Promise<HTMLElement> {
        let thisX = this;
        let rowElement_content: HTMLElement;


        const records = this.currentViewRecords;
        let record: RECORD_TYPE;
        let id: string;
        let validIndex = (index >= 0 && index < records?.length);
        if (validIndex) {
            record = records[index];
            id = this.idForRecord(record);
            const rowParams: N2List_RenderRowParams<N2List, RECORD_TYPE> = {
                widget: this,
                globalIndex: (this.state.currentPage! - 1) * this.state.pageSize! + index,
                localIndex: index,
                record: record,
                allRecords: records,
                state: this.state,
            };


            if (this.state?.renderRow && typeof this.state.renderRow === 'function') {
                rowElement_content = await this.state.renderRow(rowParams);
            } else {
                rowElement_content = document.createElement('div');
                rowElement_content.textContent = `${index}: id=${id} (missing renderRow() callback function)`;
            }

            rowElement_content.classList.add(CSS_CLASS_N2LIST.ROW_CONTENT);

            // Handle selection styling
            if (this.state.allSelected! || this.state._selectedRecords!.has(id)) {
                rowElement_content.classList.add(CSS_CLASS_N2LIST.SELECTED);
            } else {
                rowElement_content.classList.remove(CSS_CLASS_N2LIST.SELECTED);
            }

            // Handle row click for selection
            rowElement_content.addEventListener('click', (event: MouseEvent) => this._handleRowClick(event, index, record));


        } // if ( index < 0 || index >= records.length)

        // Add checkbox if enabled
        let _renderRowCheckboxes: boolean = true;
        if (this.state?.renderRowCheckboxes != null) {
            try {
                if (typeof this.state.renderRowCheckboxes === 'function') {
                    _renderRowCheckboxes = await this.state.renderRowCheckboxes(this, this.state);
                } else {
                    _renderRowCheckboxes = await this.state.renderRowCheckboxes; // boolean
                }
            } catch (error) {
                console.error('Error checking renderRowCheckboxes:', error);
            }
        } // if (this.state.renderRowCheckboxes)

        let row_children: Elem_or_N2[] = [];
        if (_renderRowCheckboxes && record != null) {
            const checkbox = this._renderRowCheckbox(record);
            row_children.push(checkbox); // 1. Add the checkbox to the row
        } // if ( _renderRowCheckboxes )

        row_children.push(rowElement_content); // 2. Add the row content


        // Handle selection styling
        let row_deco_classes: string[] = [CSS_CLASS_N2LIST.ROW];
        if (this.state.allSelected! || this.state._selectedRecords!.has(id)) // has(null) is false in case id==null
            row_deco_classes.push(CSS_CLASS_N2LIST.SELECTED);

        let rowN2: N2Row = new N2Row({
            deco: {
                classes: row_deco_classes,
                otherAttr: {
                    'data-id': id,// Added for easier DOM queries
                    'data-index': index.toString(), // Added for easier DOM queries
                }
            },
            children: row_children,
            onDOMAdded: (ev: N2Evt_DomAdded) => {
                let elem = ev.element;
                if (thisX.state.dragAndDrop) {
                    // Drag and Drop
                    elem.draggable = true;
                    elem.addEventListener('dragstart', (e: DragEvent) => thisX._handleDragStart(e, index, record));
                    elem.addEventListener('drag', (e) => thisX._handleDrag(e, index));
                    elem.addEventListener('dragend', (e: DragEvent) => thisX._handleDragEnd(e, index));

                    elem.addEventListener('dragenter', (e: DragEvent) => thisX._handleDragEnter(e, index));
                    elem.addEventListener('dragover', (e: DragEvent) => thisX._handleDragOver(e, index));
                    elem.addEventListener('dragleave', (e: DragEvent) => thisX._handleDragLeave(e, index));
                    elem.addEventListener('drop', (e: DragEvent) => thisX._handleDrop(e, index));
                } // if (thisX.state.dragAndDrop)
            }
        });

        let rowElem = rowN2.htmlElement;
        if (replace_in_DOM) {
            let old_row = this.getRowHTMLElementById(id);
            if (old_row != null) {
                old_row.replaceWith(rowElem);
            } // if (old_row != null)
        } // if ( replace_in_DOM )

        return rowElem;
    } // render_row


    protected _renderRowCheckbox(record: RECORD_TYPE): HTMLElement {
        let id = this.idForRecord(record);
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = CSS_CLASS_N2LIST.CHECKBOX;
        checkbox.checked = this.state.allSelected! || this.state._selectedRecords!.has(id);
        checkbox.addEventListener('change', () => this._handleRowCheckboxChange(record, checkbox.checked));
        return checkbox;
    }   // _renderRowCheckbox

    protected _createPagingChangeEvent(): N2List_onPagingChangeEvent {
        return {
            widget: this,
            state: this.state,
            currentPage: this.state.currentPage!,
            totalPages: Math.ceil(this.state._totalRecords! / this.state.pageSize!),
            pageSize: this.state.pageSize!,
            totalRecords: this.state._totalRecords!,
            disablePrevPage: this.state.currentPage! === 1,
            disableNextPage: this.state.currentPage! === Math.ceil(this.state._totalRecords! / this.state.pageSize!),
        };
    } // _createPagingChangeEvent

    protected _handleRowCheckboxChange(record: RECORD_TYPE | null, checked: boolean) {
        if (!record) return;

        try {
            let rec_id = this.idForRecord(record);

            if (!this.state.multiSelect) {
                // Single-select mode: enforce only one checked at a time
                this.state._selectedRecords!.clear();
                if (checked) {
                    this.state._selectedRecords!.add(rec_id);
                }
                // In single-select mode, never set allSelected
                this.state.allSelected = false;
            } else {
                if (checked) {
                    this.state._selectedRecords!.add(rec_id);
                } else {
                    this.state._selectedRecords!.delete(rec_id);
                }

                // Update selectAllCurrentViewCheckbox state
                if (this.state._selectedRecords!.size === this.currentViewRecords!.length) {
                    this.state.allSelected! = true;
                } else {
                    this.state.allSelected! = false;
                }
            }
            if (this.state.onSelectAll)
                this.state.onSelectAll.call(this, this.state);

            // Trigger callback
            if (this.state.onCheckboxChange) {
                this.state.onCheckboxChange(this.state._selectedRecords!, this.state);
            }

            // Handle selection change
            this._handleSelectionChange.call(this);

            let thisX = this;
            // Re-render to update row styles
            setTimeout(async () => {
                await thisX.render.call(thisX)
            });
        } catch (error) {
            console.error('Error handling row checkbox change:', error);
        }
    } // _onRowCheckboxChange


    protected _defaultDragImage(dragged_records: RECORD_TYPE[]): HTMLElement {
        const dragImage = document.createElement('div');
        dragImage.className = CSS_CLASS_N2LIST.DRAG_IMAGE;
        dragImage.style.position = 'absolute';
        dragImage.style.top = '-1000px'; // Position off-screen
        dragImage.style.left = '-1000px';
        dragImage.style.padding = '8px';
        dragImage.style.background = 'rgba(0, 0, 0, 0.7)';
        dragImage.style.color = '#fff'; // font color to batch the dark background
        dragImage.style.borderRadius = '4px';
        dragImage.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        dragImage.style.zIndex = '1000';
        dragImage.style.fontSize = '12px';
        dragImage.textContent = dragged_records?.length > 1 ? `${dragged_records.length} items selected` : `${(dragged_records[0] as any).name || 'One item selected'}`;

        document.body.appendChild(dragImage);
        return dragImage;
    }

    protected _drag_data(records: RECORD_TYPE[], startIndex: number): N2List_DraggedData<RECORD_TYPE> {
        const dragData: N2List_DraggedData<RECORD_TYPE> = {
            obj_class: N2List_DraggedData.CLASS_IDENTIFIER,
            startIndex: startIndex,
            items: records,
        };
        return dragData;
    } // _drag_data

    protected _handleDragStart(event: DragEvent, index: number, record: RECORD_TYPE | null) {
        if (!record) return;

        try {
            let recordsToDrag: RECORD_TYPE[] = [];

            // If multiple rows are selected, drag all selected
            if (this.state._selectedRecords!.size > 1) {
                // keep real reaconrds only in order
                recordsToDrag = Array.from(this.state._selectedRecords!).map(rec_id => this.getRecordById(rec_id as string)).filter(rec => rec !== undefined) as RECORD_TYPE[];
            } else {
                recordsToDrag = [record];
            }

            const dragData: N2List_DraggedData<RECORD_TYPE> = this._drag_data.call(this, recordsToDrag, index);

            const paramOnDragStart: N2List_OnDragStart<RECORD_TYPE> = {
                state: this.state,
                data: dragData,
                event: event,
            }; // paramOnDragStart
            event.dataTransfer!.effectAllowed = 'move'; // can be overwritten by the onDragStart callback in state.onDragStart

            N2DnD.handleDragStart(paramOnDragStart); // set the default N2DnD fields and the dataTranser set data


            // Add dragging class to all dragged elements
            if (recordsToDrag.length > 1) {
                this.state._selectedRecords!.forEach((rec_id: string) => {
                    const rowElement = this.getRowHTMLElementById(rec_id);
                    if (rowElement) {
                        rowElement.classList.add(N2DnD.CSS_CLASSES.DRAGGING);
                    }
                });
            } else {
                const target = event.currentTarget as HTMLElement;
                target.classList.add(N2DnD.CSS_CLASSES.DRAGGING);
            }


            //TODO Make this a default function to be called if no state custom element is provided

            // Create and set custom drag image
            if (this.state.getCustomDragElement) {
                const customElement = this.state.getCustomDragElement!(recordsToDrag);
                if (customElement) {
                    document.body.appendChild(customElement); // Must be in the DOM to set as drag image
                    event.dataTransfer!.setDragImage(customElement, customElement.clientWidth / 2, customElement.clientHeight / 2);
                    N2DnD.customDragImage = customElement;
                }
            } else {
                // Default drag image similar to Gmail
                const defaultDragImage = this._defaultDragImage(recordsToDrag);
                document.body.appendChild(defaultDragImage); // Must be in the DOM to set as drag image
                event.dataTransfer!.setDragImage(defaultDragImage, defaultDragImage.clientWidth / 2, defaultDragImage.clientHeight / 2);
                N2DnD.customDragImage = defaultDragImage;
            }

            // Trigger drag start callback
            if (this.state.onDragStart) {
                const param: N2List_OnDragStart<RECORD_TYPE> = {
                    state: this.state,
                    data: dragData,
                    event: event,
                };
                this.state.onDragStart(param);
            }
        } catch (error) {
            console.error('Error handling drag start:', error);
            const target = event.currentTarget as HTMLElement;
            target.classList.remove(N2DnD.CSS_CLASSES.DRAGGING);
        }
    } // handleDragStart

    protected _handleDrag(event: DragEvent, index: number) {
        try {
            const paramOnDrag: N2List_OnDrag<RECORD_TYPE> = {
                state: this.state,
                event: event,
            };
            N2DnD.handleDrag(paramOnDrag);
        } catch (error) {
            console.error('Error handling drag:', error);
        }
    } // handleDrag

    protected _handleDragEnd(event: DragEvent, index: number) {
        try {
            this._lastDropPosition = null; // Reset the drop position

            let param: N2List_OnDragEnd<RECORD_TYPE> = {
                state: this.state,
                data: N2DnD.dragData as N2List_DraggedData<RECORD_TYPE>,
                event: N2DnD.evtDragStart,
            }
            N2DnD.handleDragEnd(param);

        } catch (error) {
            console.error('Error handling drag end:', error);
        }
    }

    protected _handleDragEnter(event: DragEvent, index: number) {
        try {
            const param_OnDragEnter: N2List_OnDragEnter<RECORD_TYPE> = {
                state: this.state,
                data: N2DnD.dragData as N2List_DraggedData<RECORD_TYPE>,
                event: event,
                event_dragstart: N2DnD.evtDragStart,
                current_target: event.currentTarget as HTMLElement,
            } // param_N2DnD_OnDragEnter

            N2DnD.handleDragEnter(param_OnDragEnter);
        } catch (error) {
            console.error('Error handling drag enter:', error);
        }
    } // handleDragEnter

    protected _handleDragOver(event: DragEvent, index: number) {

        const param_OnDragOver: N2List_OnDragOver<RECORD_TYPE> = {
            state: this.state,
            data: N2DnD.dragData as N2List_DraggedData<RECORD_TYPE>,
            event_dragover_current: event,
            event_dragstart: N2DnD.evtDragStart,
            current_target: event.currentTarget as HTMLElement,
            previous_target: N2DnD.evtDragOverTarget,

        } // param_N2DnD_OnDragOver

        N2DnD.handleDragOver(param_OnDragOver);

    } //  handleDragOver

    protected _handleDragLeave(event: DragEvent, index: number) {

        let leave_from_elem = (event as any)?.fromElement as HTMLElement;
        if (leave_from_elem != null && leave_from_elem == N2DnD.evtDragOverTarget) {
            // only trigger if we leave the current target

            try {
                this.dropIndicator_Remove_LocalListItems();
                this._lastDropPosition = null; // Reset the drop position
            } catch (error) {
                console.error('Error handling drag leave:', error);
            }

            let param: N2List_OnDragLeave<RECORD_TYPE> = {
                state: this.state,
                data: N2DnD.dragData as N2List_DraggedData<RECORD_TYPE>,
                event: N2DnD.evtDragStart,
                current_target: N2DnD.evtDragOverTarget,
                event_dragstart: N2DnD.evtDragStart,
            }
            N2DnD.handleDragLeave(param);
        } // if (leave_from_elem != null || leave_from_elem == N2DnD.evtDragOverTarget) {

    } // handleDragLeave

    protected _handleDrop(event: DragEvent, index: number) {
        try {
            let targetRecordAtIndex = null;
            try {
                targetRecordAtIndex = this.getRecordByIndex(index);
            } catch (error) {
                console.error('Error getting record by index:', error);
            }

            // Adjust the targetIndex based on the drop position
            let adjustedIndex = index;
            if (this._lastDropPosition === 'below') {
                adjustedIndex += 1;
            }

            const param: N2List_OnDrop<RECORD_TYPE> = {
                state: this.state,
                event: event,
                targetIndex: adjustedIndex, // Use adjustedIndex here
                recordDroppedOn: targetRecordAtIndex,
                data: N2DnD.dragData, //parsedData,
                current_target: event.currentTarget as HTMLElement,
            };
            try {
                N2DnD.handleOnDrop(param);
            } catch (error) {
                console.error('Error handling onDrop event:', error);
            }

        } catch (error) {
            console.error('Error handling drop:', error);
            return error;
        } finally {
            // this.removeDropIndicator_LocalListItems();
            this._lastDropPosition = null; // Reset the drop position
        }
        return null;
    } // handleDrop

    /**
     * Called when a spinner should display. Implement to show a spinner or other loading indicator but defer to the state's onStartSpinner if it exists.
     * @protected
     */
    public startSpinner() {
        try {
            if (this?.state?.onStartSpinner)
                this.state.onStartSpinner({widget: this, state: this.state});
        } catch (error) {
            console.error('Error starting spinner:', error);
        }
    } // startSpinner

    /**
     * Called when a spinner should hide. Implement to hide a spinner or other loading indicator but defer to the state's onStopSpinner if it exists.
     * @protected
     */
    public stopSpinner() {
        try {
            if (this?.state?.onStopSpinner)
                this.state.onStopSpinner({widget: this, state: this.state});
        } catch (error) {
            console.error('Error stopping spinner:', error);
        }
    } // stopSpinner

    // -------------------- Selection Handling --------------------

    /**
     * Handles the row click event for selection logic.
     * Utilizes public selection and deselection methods to manage single, range, and toggle selections.
     *
     * - **Single Click:** Clears existing selections and selects the clicked row.
     * - **Shift + Click:** Selects a range of rows from the last selected index to the clicked row.
     * - **Ctrl/Cmd + Click:** Toggles the selection state of the clicked row without affecting other selections.
     *
     * @param event The mouse event triggered by clicking on a row.
     * @param index The index of the clicked row within the current view.
     * @param record The data record associated with the clicked row.
     */
    protected _handleRowClick(event: MouseEvent, index: number, record: RECORD_TYPE | null): void {
        if (!record) return;

        try {
            // In single-select mode, ignore Shift/Ctrl/Cmd and always do single selection
            if (!this.state.multiSelect) {
                this.clearSelection();
                this.selectRowsByRecord(record);
                this._lastSelectedIndex = index;
                if (event.detail === 2) {
                    if (this.state.onRowDoubleClick) {
                        this.state.onRowDoubleClick.call(this, {
                            widget: this,
                            index: index,
                            record: record,
                            event: event,
                            state: this.state
                        });
                    }
                }
                return;
            }

            const isShift = event.shiftKey;
            const isCtrl = event.ctrlKey || event.metaKey;

            if (isShift && this._lastSelectedIndex !== null) {
                // **Range Selection:** Select a range of rows from the last selected index to the current index.
                const start = Math.min(this._lastSelectedIndex, index);
                const end = Math.max(this._lastSelectedIndex, index);
                const recordsToSelect: RECORD_TYPE[] = [];

                for (let i = start; i <= end; i++) {
                    const currentRecord = this.getRecordByIndex(i);
                    if (currentRecord) {
                        recordsToSelect.push(currentRecord);
                    } // if (currentRecord)
                } // for i

                this.selectRowsByRecord(recordsToSelect);
                this._lastSelectedIndex = index;
            } else if (isCtrl) {
                // **Toggle Selection:** Toggle the selection state of the clicked row.
                const rec_id = this.idForRecord(record);
                if (this.state._selectedRecords!.has(rec_id)) {
                    this.deselectRowsByRecord(record);
                } else {
                    this.selectRowsByRecord(record);
                }
                this._lastSelectedIndex = index;
            } else {

                // **Single Selection:** Clear existing selections and select the clicked row.
                this.clearSelection();
                this.selectRowsByRecord(record);
                this._lastSelectedIndex = index;


                if (event.detail === 2) {
                    // Handle double-click event
                    if (this.state.onRowDoubleClick) {
                        this.state.onRowDoubleClick.call(this, {
                            widget: this,
                            index: index,
                            record: record,
                            event: event,
                            state: this.state
                        });
                    }
                } // if (event.detail === 2)
            } // if else

        } catch (error) {
            console.error('Error handling row click:', error);
        }
    } // _handleRowClick

    /**
     * Computes the differences between current and last selections.
     */
    protected _computeSelectionDifferences(current: N2List_Selection<RECORD_TYPE>, last: N2List_Selection<RECORD_TYPE>): N2List_Selection_Differences<RECORD_TYPE> {

        const added: N2List_Selection<RECORD_TYPE> = {indexes: [], records: []};
        const removed: N2List_Selection<RECORD_TYPE> = {indexes: [], records: []};
        // const modified: N2List_Selection<RECORD_TYPE> = {indexes: [], records: []};

        const lastIds = new Set(last.records.map(r => this.idForRecord(r)));
        const currentIds = new Set(current.records.map(r => this.idForRecord(r)));

        // Added
        current.records.forEach((record, idx) => {
            if (!lastIds.has(this.idForRecord(record))) {
                added.records.push(record);
                added.indexes.push(current.indexes[idx]);
            }
        });

        // Removed
        last.records.forEach((record, idx) => {
            if (!currentIds.has(this.idForRecord(record))) {
                removed.records.push(record);
                removed.indexes.push(last.indexes[idx]);
            }
        });

        // Modified (for simplicity, assuming records with same id are same)
        // Could be implemented based on specific criteria if needed

        return {added: added, removed: removed} as N2List_Selection_Differences<RECORD_TYPE>;
    } // _computeSelectionDifferences

    /**
     * Handles the selection change by invoking the callback with necessary data.
     */
    protected _handleSelectionChange(): void {
        try {
            // Don't trigger selection change events if suppressed
            if (this.state.suppressSelectionEvents) {
                return;
            }

            const currentSelection = this.getSelection();
            const differences = this._computeSelectionDifferences.call(this, currentSelection, this._lastSelection);
            if (this.state.onSelectionChange) {

                let param: N2List_onSelectionChangeEvent<RECORD_TYPE> = {
                    currentSelection: currentSelection,
                    lastSelection: this._lastSelection,
                    differences: differences,
                }

                this.state.onSelectionChange.call(this, param);
            } // if (this.state.onSelectionChange)
            this._lastSelection = {...currentSelection};
        } catch (error) {
            console.error('Error handling selection change:', error);
        }
    } // _handleSelectionChange


} // main class

//----------------------------------------------------------------
//------------------ State-related interfaces definition ---------
//----------------------------------------------------------------

export interface StateN2ListRef extends StateN2BasicRef {
    widget?: N2List;
}

/**
 * This interface contains the properties that will not be exposed as the State in the constructor of the widget (by use of the Omit feature to remove them in the constructor state definition).
 * These properties are part of the overall State and available at development and code completion time.
 */
interface InternalStateN2List<RECORD_TYPE = any> {

    _local_data?: RECORD_TYPE[];
    _totalRecords?: number;
    _pages?: Map<number, RECORD_TYPE[]>;
    _selectedRecords?: Set<string>;

    /**
     *
     */
    _data_load_success?: boolean;
} // InternalStateN2List

export interface StateN2List<RECORD_TYPE = any> extends StateN2Basic, StateN2DnD<RECORD_TYPE, N2List_DraggedData<RECORD_TYPE>> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ListRef;
    /**
     * How many pages (back and forward) to keep in memory.
     * Defaults to 1 if not specified.
     */
    cachedPagesRange?: number;

    /**
     * Number of records per page. Defaults to 50 if not specified.
     */
    pageSize?: number;

    /**
     * Current page number. Defaults to 1 if not specified.
     */
    currentPage?: number;

    /**
     * When true, enables multi-selection (range, toggle, multiple programmatic selection, select-all).
     * When false or unset, the component enforces single selection only.
     * @default false
     */
    multiSelect?: boolean;

    /**
     * Can be set to true to select all records in the current view initially (if 'initialSelection' is also specified, 'initialSelection' takes precedence).
     *
     * After the initialization of the widget,this flag is maintained by the widget and indicates if all records in the current view are selected or not
     */
    allSelected?: boolean;


    /**
     * Use drag and drop? Defaults to false if not specified.
     */
    dragAndDrop?: boolean;


    /**
     * Initial selection can be an array of IDs or records. If this is specified, it will override the the allSelected flag for initial selection.
     */
    initialSelection?: string[] | RECORD_TYPE[];

    /**
     * Optional local data to initialize the component with.
     *
     * If the'getData' function is also implemented, that will take precedence.
     *
     */
    local_data?: RECORD_TYPE[];

    /**
     *  Optional Callback to fetch data for a given page.
     *  If not defined, the widget will use the defaultGetData function which will attempt to get the data from the 'local_data' property.
     * @param {number} page
     * @param {number} pageSize
     * @return {EJList<RECORD_TYPE> | Promise<EJList<RECORD_TYPE>>}
     */
    getData?: (pageNumber ?: number) => (EJList<RECORD_TYPE> | Promise<EJList<RECORD_TYPE>>);

    id?: (rec: RECORD_TYPE) => string;

    renderRow?: (params: N2List_RenderRowParams<N2List, RECORD_TYPE>) => HTMLElement | Promise<HTMLElement>;

    /**
     * Should checkboxes be rendered for each row?
     * Checkboxes will be shown by default unless this is set to false, or the function call returns false
     */
    renderRowCheckboxes?: boolean | Promise<boolean> | ((widget: N2List, state: StateN2List<RECORD_TYPE>) => boolean | Promise<boolean>);

    onCheckboxChange?: (selectedIds: Set<string>, state: StateN2List<RECORD_TYPE>) => void;

    //------------ DnD events on the SOURCE element ----------------
    onDragEnter?: (params: N2List_OnDragEnter<RECORD_TYPE>) => void;
    onDrag?: (params: N2List_OnDrag<RECORD_TYPE>) => void;
    onDragLeave?: (params: N2List_OnDragLeave<RECORD_TYPE>) => void;

    //------------ DnD events on the TARGET element ----------------
    onDragStart?: (params: N2List_OnDragStart<RECORD_TYPE>) => void;
    onDragOver?: (params: N2List_OnDragOver<RECORD_TYPE>) => void;
    onDragEnd?: (params: N2List_OnDragEnd<RECORD_TYPE>) => void;
    onDrop?: (params: N2List_OnDrop<RECORD_TYPE>) => void;


    onError_GetData?: (params: N2List_OnErrorGetData) => void;
    onError_PageClear?: (params: N2List_OnErrorBase) => void;
    onError_RowRender?: (params: N2List_OnErrorRowRender) => void;

    /**
     * Callback invoked when the component is initialized (fully rendered with the first batch of data loaded).
     * This event is only called once, the first time the widget is rendered and done loading data the first time.
     * @param {N2List} widget
     */
    onInitialized?: (widget: N2List) => void;

    onStartSpinner?<WIDGET extends N2List, STATE extends StateN2List_Complete = StateN2List_Complete>(
        ev: { widget: WIDGET; state: STATE }
    ): void;

    onStopSpinner?<WIDGET extends N2List, STATE extends StateN2List_Complete = StateN2List_Complete>(
        ev: { widget: WIDGET; state: STATE }
    ): void;

    onPagingChange?<WIDGET extends N2List, STATE extends StateN2List_Complete = StateN2List_Complete>(
        ev: N2List_onPagingChangeEvent<WIDGET, STATE>
    ): void;


    onDataLoaded?<WIDGET extends N2List, STATE extends StateN2List_Complete = StateN2List_Complete>(widget: WIDGET, state: STATE): void;

    onRendered?<WIDGET extends N2List, STATE extends StateN2List_Complete = StateN2List_Complete>(widget: WIDGET, state: STATE): void;

    onRowDoubleClick?<RECORD_TYPE = any,
        WIDGET extends N2List = N2List<RECORD_TYPE, StateN2List_Complete<RECORD_TYPE>>,
        STATE extends StateN2List_Complete = StateN2List_Complete<RECORD_TYPE>>(
        ev: N2List_onDoubleClickEvent<RECORD_TYPE, WIDGET, STATE>
    ): void;

    onSelectAll?: (state: StateN2List_Complete<RECORD_TYPE>) => void;

    /**
     * Callback invoked when selection changes.
     */
    onSelectionChange?: (param: N2List_onSelectionChangeEvent<RECORD_TYPE>) => void;

    /**
     * Callback invoked when a new visual data page has been loaded with different records
     * @param {N2List} widget
     */
    onViewDataChange?: (widget: N2List) => void;


    /**
     * Callback method to return a custom drag HTMLElement.
     * Receives an array of records being dragged.
     */
    getCustomDragElement?: (records: RECORD_TYPE[]) => HTMLElement;

    /**
     * When true, suppresses selection change events from being fired.
     * This is useful for preventing infinite loops when programmatically clearing
     * selections or when one component needs to update another component's selection
     * without triggering cascading selection events.
     *
     * @default false
     */
    suppressSelectionEvents?: boolean;
} // StateN2List


export interface StateN2List_Complete<RECORD_TYPE = any> extends StateN2List<RECORD_TYPE>, InternalStateN2List<RECORD_TYPE> {
    //blends regular state with internal properties to make them available to the developer in code completion
}


//-----------------------------------------------------
// -------------------- Interfaces --------------------
//-----------------------------------------------------

//-------------- DnD Dragged Data Interface ----------------
export namespace N2List_DraggedData {
    // this is the namespace that sets up the ability to add a function to the name of the interface
    export const CLASS_IDENTIFIER = "N2List_DraggedData";

    export function sameAs(obj: any): obj is N2List_DraggedData<any> {
        return obj?.obj_class === CLASS_IDENTIFIER;
    } // sameAs

} // N2List_DraggedData
export interface N2List_DraggedData<RECORD_TYPE> extends N2DnD_DraggedData<RECORD_TYPE> {
    startIndex?: number;
} // N2List_DraggedData


//-------------- DnD events on the SOURCE element ----------------
export interface N2List_OnDragStart<RECORD_TYPE> extends N2DnD_OnDragStart<StateN2List<RECORD_TYPE>, N2List_DraggedData<RECORD_TYPE>> {
    // no additional members
}

export interface N2List_OnDragOver<RECORD_TYPE> extends N2DnD_OnDragOver<StateN2List<RECORD_TYPE>, N2List_DraggedData<RECORD_TYPE>> {
    // no additional members
} // N2List_OnDragOver

export interface N2List_OnDragEnd<RECORD_TYPE> extends N2DnD_OnDragEnd<StateN2List<RECORD_TYPE>, N2List_DraggedData<RECORD_TYPE>> {
    // no additional members
} // N2List_OnDragEnd

export interface N2List_OnDrag<RECORD_TYPE> extends N2DnD_OnDrag<StateN2List<RECORD_TYPE>> {
    // no additional members
} // N2List_OnDrag


//-------------- DnD events on the TARGET element ----------------

export interface N2List_OnDragEnter<RECORD_TYPE> extends N2DnD_OnDragEnter<StateN2List<RECORD_TYPE>, N2List_DraggedData<RECORD_TYPE>> {
    // no additional members
}

export interface N2List_OnDragLeave<RECORD_TYPE> extends N2DnD_OnDragLeave<StateN2List<RECORD_TYPE>, N2List_DraggedData<RECORD_TYPE>> {
    // no additional members
}

export interface N2List_OnDrop<RECORD_TYPE, DRAGGED_RECORD_TYPE = any> extends N2DnD_OnDrop<StateN2List<RECORD_TYPE>, N2DnD_DraggedData<DRAGGED_RECORD_TYPE>> {
    /**
     * The index where the drop occurred.
     */
    targetIndex: number;
    recordDroppedOn: RECORD_TYPE
} // N2List_OnDropEventParams

//-------------------

export interface N2List_OnErrorBase<WIDGET extends N2List = N2List, STATE extends StateN2List = StateN2List> {
    widget: WIDGET;
    state: STATE;
    error?: Error;
}

export interface N2List_OnErrorGetData<WIDGET extends N2List = N2List, STATE extends StateN2List = StateN2List> extends N2List_OnErrorBase<WIDGET, STATE> {
    pageNumber: number;
}


export interface N2List_OnErrorRowRender<WIDGET extends N2List = N2List, STATE extends StateN2List = StateN2List, RECORD_TYPE = any> extends N2List_OnErrorBase<WIDGET, STATE> {
    index: number;
    record: RECORD_TYPE;
}


// -------------------- Paging Change Event Interface --------------------

export interface N2List_onPagingChangeEvent<WIDGET extends N2List = N2List, STATE extends StateN2List = StateN2List> {
    widget: WIDGET;
    state: STATE;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalRecords: number;
    disablePrevPage: boolean;
    disableNextPage: boolean;
} // N2List_onPagingChangeEvent

export interface N2List_RenderRowParams<WIDGET extends N2List = N2List, RECORD_TYPE = any> {
    widget: WIDGET;
    globalIndex: number;
    localIndex: number;
    record: RECORD_TYPE | null;
    allRecords: RECORD_TYPE[];
    state: StateN2List<RECORD_TYPE>;
}

export interface N2List_Selection<RECORD_TYPE> {
    indexes: number[];
    records: RECORD_TYPE[]
}

export interface N2List_Selection_Differences<RECORD_TYPE> {
    added: N2List_Selection<RECORD_TYPE>;
    removed: N2List_Selection<RECORD_TYPE>;
    // modified: N2List_Selection<RECORD_TYPE>;
} // N2List_Selection_Differences
export interface N2List_onSelectionChangeEvent<RECORD_TYPE> {

    currentSelection: N2List_Selection<RECORD_TYPE>;
    lastSelection: N2List_Selection<RECORD_TYPE>;
    differences: N2List_Selection_Differences<RECORD_TYPE>;
} // N2List_onSelectionChangeEvent

export interface N2List_onDoubleClickEvent<
    RECORD_TYPE = any,
    WIDGET extends N2List = N2List<RECORD_TYPE, StateN2List_Complete<RECORD_TYPE>>,
    STATE extends StateN2List_Complete = StateN2List_Complete<RECORD_TYPE>
> {
    widget: WIDGET;
    state: STATE;
    record: RECORD_TYPE;
    index: number;
    event: MouseEvent;
} // N2List_onDoubleClickEvent

// -----------------------------------------------------
// --------- Exported Module Constants -----------------
// -----------------------------------------------------

export const CSS_CLASS_N2LIST = {
    ROW_CONTENT: 'n2-lx-row-content', // inside of the row element (minus the checkbox)
    ROW: 'n2-lx-row',
    SELECTED: 'n2-lx-selected',
    CHECKBOX: 'n2-lx-checkbox',
    DROP_INDICATOR: 'n2-lx-drop-indicator',
    DROP_INDICATOR_TOP: 'n2-lx-drop-indicator-top',
    DROP_INDICATOR_BOTTOM: 'n2-lx-drop-indicator-bottom',
    DRAG_IMAGE: 'n2-lx-drag-img', //custom drag image
};

let cssLoaded = false;

function loadCSS(): void {
    if (cssLoaded) return;

    try {

        cssAdd(`
    
.${N2List.CLASS_IDENTIFIER} {
    position:  relative;  
}

.${CSS_CLASS_N2LIST.ROW}{
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  border-bottom: 1px solid #eee;
  padding: 5px 10px;
  /* cursor: pointer; */
  position: relative;
}

.${CSS_CLASS_N2LIST.ROW}.dragging {
  opacity: 0.5;
}

.${CSS_CLASS_N2LIST.ROW} .${CSS_CLASS_N2LIST.ROW_CONTENT} {
    flex-grow: 1;
}

.${CSS_CLASS_N2LIST.DROP_INDICATOR} {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--app-color-blue-01);
  width: 100%;
  z-index: 1;
  pointer-events: none;
}

.${CSS_CLASS_N2LIST.CHECKBOX} {
  margin-right: 5px;
}    
    

    `,
            'N2List'
        ); // cssAdd
    } catch (e) {
        console.error(e);
    }

    cssLoaded = true;

} // loadCSS