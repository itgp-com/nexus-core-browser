// -------------------- Interfaces --------------------
export interface N2TreeList_Node<RECORD_TYPE = any> {
    expanded?: boolean;
    child?: N2TreeList_Node<RECORD_TYPE>[];
    data?: RECORD_TYPE;
}

export namespace N2TreeList_DraggedData {
    export const CLASS_IDENTIFIER = "N2TreeList_DraggedData";

    export function sameAs(obj: any): obj is N2TreeList_DraggedData<any> {
        return obj?.obj_class === CLASS_IDENTIFIER;
    }
}

export interface N2TreeList_DraggedData<RECORD_TYPE> extends N2DnD_DraggedData<RECORD_TYPE> {
    /**
     * The tree nodes being dragged (in addition to the items)
     */
    nodes?: N2TreeList_Node<RECORD_TYPE>[];
}

export interface N2TreeList_RenderNodeParams<RECORD_TYPE> {
    node: N2TreeList_Node<RECORD_TYPE>;
    index: number;
    depth: number;
    state: StateN2TreeList<RECORD_TYPE>;
}

//-------------- DnD events on the SOURCE element ----------------
export interface N2TreeList_OnDragStart<RECORD_TYPE> extends N2DnD_OnDragStart<StateN2TreeList<RECORD_TYPE>, N2TreeList_DraggedData<RECORD_TYPE>> {
}

export interface N2TreeList_OnDragOver<RECORD_TYPE> extends N2DnD_OnDragOver<StateN2TreeList<RECORD_TYPE>, N2TreeList_DraggedData<RECORD_TYPE>> {
    node?: N2TreeList_Node<RECORD_TYPE>;
}

export interface N2TreeList_OnDragEnd<RECORD_TYPE> extends N2DnD_OnDragEnd<StateN2TreeList<RECORD_TYPE>, N2TreeList_DraggedData<RECORD_TYPE>> {
}

export interface N2TreeList_OnDrag<RECORD_TYPE> extends N2DnD_OnDrag<StateN2TreeList<RECORD_TYPE>> {
}

//-------------- DnD events on the TARGET element ----------------
export interface N2TreeList_OnDragEnter<RECORD_TYPE> extends N2DnD_OnDragEnter<StateN2TreeList<RECORD_TYPE>, N2TreeList_DraggedData<RECORD_TYPE>> {
    node: N2TreeList_Node<RECORD_TYPE>;
}

export interface N2TreeList_OnDragLeave<RECORD_TYPE> extends N2DnD_OnDragLeave<StateN2TreeList<RECORD_TYPE>, N2TreeList_DraggedData<RECORD_TYPE>> {
    node: N2TreeList_Node<RECORD_TYPE>;
}

export interface N2TreeList_OnDrop<RECORD_TYPE> extends N2DnD_OnDrop<StateN2TreeList<RECORD_TYPE>, N2TreeList_DraggedData<RECORD_TYPE>> {
    /**
     * The node where the drop occurred.
     */
    targetNode: N2TreeList_Node<RECORD_TYPE>;
}

export interface N2TreeList_CustomDragElement<RECORD_TYPE> {
    widget: N2TreeList<RECORD_TYPE>;
    state: StateN2TreeList<RECORD_TYPE>;
    items: N2TreeList_Node<RECORD_TYPE>[];
}


// -------------------- Selection Interfaces --------------------
export interface StateN2TreeListRef extends StateN2BasicRef {
    widget?: N2TreeList;
}

export interface StateN2TreeList<RECORD_TYPE = any>
    extends StateN2Basic,
        StateN2DnD<RECORD_TYPE, N2TreeList_DraggedData<RECORD_TYPE>> {
    ref?: StateN2TreeListRef;

    /**
     * Tree data can be an array or a function returning a promise of the array.
     */
    treeData: N2TreeList_Node<RECORD_TYPE>[] | ((ev?: N2TreeList_RefreshEvent) => Promise<N2TreeList_Node<RECORD_TYPE>[]>);

    /**
     * Use drag and drop? Defaults to false if not specified.
     */
    dragAndDrop?: boolean;

    //------------ DnD events on the SOURCE element ----------------
    onDragEnter?: (params: N2TreeList_OnDragEnter<RECORD_TYPE>) => void;
    onDrag?: (params: N2TreeList_OnDrag<RECORD_TYPE>) => void;
    onDragLeave?: (params: N2TreeList_OnDragLeave<RECORD_TYPE>) => void;

    //------------ DnD events on the TARGET element ----------------
    onDragStart?: (params: N2TreeList_OnDragStart<RECORD_TYPE>) => void;
    onDragOver?: (params: N2TreeList_OnDragOver<RECORD_TYPE>) => void;
    onDragEnd?: (params: N2TreeList_OnDragEnd<RECORD_TYPE>) => void;
    onDrop?: (params: N2TreeList_OnDrop<RECORD_TYPE>) => void;

    /**
     * Function to get the unique ID of a node
     */
    id: (node: N2TreeList_Node<RECORD_TYPE>) => string;

    /**
     * Function to render a tree node
     */
    renderNode?: (params: N2TreeList_RenderNodeParams<RECORD_TYPE>) => HTMLElement | Promise<HTMLElement>;

    /**
     * Should checkboxes be rendered for each row?
     * Checkboxes will be shown by default unless this is set to false, or the function call returns false
     */
    renderRowCheckboxes?: boolean | Promise<boolean> | ((widget: N2TreeList, state: StateN2TreeList_Complete<RECORD_TYPE>) => boolean | Promise<boolean>);

    onCheckboxChange?: (selectedIds: Set<string>, state: StateN2TreeList_Complete<RECORD_TYPE>) => void;

    /**
     * Callback invoked when the component is initialized (fully rendered with the first batch of data loaded).
     * This event is only called once, the first time the widget is rendered and done loading data the first time.
     * @param {N2TreeList} widget
     */
    onInitialized?: (widget: N2TreeList) => void;

    /**
     * When true, enables multi-selection (range, toggle, multiple programmatic selection, select-all).
     * When false or unset, the component enforces single selection only.
     * @default false
     */
    multiSelect?: boolean;

    /**
     * When true, checking a parent node's checkbox does NOT cascade to its children. Default is false (cascades).
     * @default false
     */
    parentCheckDoesNotCascade?: boolean;

    /**
     * Optional row height for each tree row. Accepts a number (pixels) or any valid CSS size string.
     * If provided as a number, pixels are assumed.
     * This sets the minimum height of each row and keeps content flex-aligned.
     */
    minRowHeight?: number | string;

    // -------------------- Selection Properties --------------------
    /**
     * Indicates if all nodes in the current view are selected.
     */
    allSelected?: boolean;

    /**
     * Initial selection can be an array of IDs or nodes. If specified, it overrides the allSelected flag for initial selection.
     */
    initialSelection?: string[] | N2TreeList_Node<RECORD_TYPE>[];

    /**
     * Callback invoked when selection changes.
     */
    onSelectionChange?: (param: N2TreeList_onSelectionChangeEvent<RECORD_TYPE>) => void;

    /**
     * Callback invoked when select all state changes.
     */
    onSelectAll?: (state: StateN2TreeList<RECORD_TYPE>) => void;

    /**
     * Callback invoked when a spinner should start.
     */
    onStartSpinner?: <WIDGET extends N2TreeList, STATE extends StateN2TreeList = StateN2TreeList>(
        ev: { widget: WIDGET; state: STATE }
    ) => void;

    /**
     * Callback invoked when a spinner should stop.
     */
    onStopSpinner?: <WIDGET extends N2TreeList, STATE extends StateN2TreeList = StateN2TreeList>(
        ev: { widget: WIDGET; state: STATE }
    ) => void;


    onDataLoaded?: <WIDGET extends N2TreeList, STATE extends StateN2TreeList_Complete<RECORD_TYPE> = StateN2TreeList_Complete<RECORD_TYPE>>(widget: WIDGET, state: STATE) => void;

    onRendered?: <WIDGET extends N2TreeList, STATE extends StateN2TreeList_Complete<RECORD_TYPE> = StateN2TreeList_Complete<RECORD_TYPE>>(widget: WIDGET, state: STATE) => void;

    /**
     * Callback method to return a custom drag HTMLElement.
     * Receives an array of records being dragged.
     */
    getCustomDragElement?: (ev: N2TreeList_CustomDragElement<RECORD_TYPE>) => HTMLElement;

    /**
     * Function to handle feedback when dragging over a node.
     */
    feedbackHandler?: (
        event: DragEvent,
        node: N2TreeList_Node<RECORD_TYPE>,
        params: N2TreeList_OnDragOver<RECORD_TYPE>
    ) => void;

    /**
     * Optional methods for default feedback.
     */
    feedbackSameInstance?: (event: DragEvent, node: N2TreeList_Node<RECORD_TYPE>) => void;
    feedbackScribeProject?: (event: DragEvent, node: N2TreeList_Node<RECORD_TYPE>) => void;

    /**
     * When true, suppresses selection change events from being fired.
     * This is useful for preventing infinite loops when programmatically clearing
     * selections or when one component needs to update another component's selection
     * without triggering cascading selection events.
     *
     * @default false
     */
    suppressSelectionEvents?: boolean;
} // StateN2TreeList

export interface StateN2TreeList_Complete<RECORD_TYPE = any> extends StateN2TreeList<RECORD_TYPE>, InternalStateN2TreeList<RECORD_TYPE> {
    //blends regular state with internal properties to make them available to the developer in code completion
}

// -------------------- Selection Event Interfaces --------------------
export interface N2TreeList_Selection_Differences<RECORD_TYPE> {
    added: N2TreeList_Selection<RECORD_TYPE>;
    removed: N2TreeList_Selection<RECORD_TYPE>;
}

export interface N2TreeList_onSelectionChangeEvent<RECORD_TYPE> {
    currentSelection: N2TreeList_Selection<RECORD_TYPE>;
    lastSelection: N2TreeList_Selection<RECORD_TYPE>;
    differences: N2TreeList_Selection_Differences<RECORD_TYPE>;
}

export interface N2TreeList_Selection<RECORD_TYPE> {
    ids: string[];
    nodes: N2TreeList_Node<RECORD_TYPE>[]
}


// -------------------- N2TreeList Class --------------------
export class N2TreeList<
    RECORD_TYPE = any,
    STATE extends StateN2TreeList_Complete<RECORD_TYPE> = StateN2TreeList_Complete
> extends N2Basic<STATE, N2TreeList> {
    static readonly CLASS_IDENTIFIER:string = "N2TreeList"


    private selectedNodes: Set<string>;
    private _treeDataArray: N2TreeList_Node<RECORD_TYPE>[] = [];
    private _lastSelectedNodeId: string | null = null; // For handling selection logic

    constructor(state: Omit<STATE, keyof InternalStateN2TreeList<RECORD_TYPE>>) {
        super(state as STATE);
        try {
            loadCSS();
        } catch (e) {
            console.error(e);
        }

        // Initialize internal state
        let _state: STATE = state as STATE;

        // Initialize selection and other internal properties
        if (!_state._selectedNodes) _state._selectedNodes = new Set<string>();
        if (_state.allSelected === undefined) _state.allSelected = false;
        if (_state.cachedNodesRange == null) _state.cachedNodesRange = 1;
        if (_state.multiSelect === undefined) _state.multiSelect = false;
        if (_state.parentCheckDoesNotCascade === undefined) _state.parentCheckDoesNotCascade = false;

        this.selectedNodes = _state._selectedNodes;
    }


    protected onStateInitialized(state: STATE): void {
        addN2Class(state.deco, N2TreeList.CLASS_IDENTIFIER);

        super.onStateInitialized(state);
    }

    onHtml(args: N2Evt_OnHtml): HTMLElement {
        let elem = createN2HtmlBasic<StateN2Basic>(this.state);
        return elem;
    }

    public onDOMAdded(ev: N2Evt_DomAdded): void {
        let thisX = this;
        setTimeout(async () => {
            await thisX.refreshDataAndRender();
            if (thisX.state.onInitialized) {
                thisX.state.onInitialized.call(thisX, thisX);
            }
        });
        super.onDOMAdded(ev);
    }

    async refreshDataAndRender(ev?: N2TreeList_RefreshEvent) {
        let data_source: 'array' | 'function' = 'array';
        let data_load_success = false;
        if (typeof this.state.treeData === 'function') {
            data_source = 'function';
            try {
                this._handleStartSpinner();
                const data = await this.state.treeData(ev);
                this._handleStopSpinner();
                this._treeDataArray = data;
                data_load_success = true;
            } catch (error) {
                this._handleStopSpinner();
                console.error('Error loading tree data:', error, this);
            }
        } else {
            try {
                this._treeDataArray = this.state.treeData;
                data_load_success = true;
            } catch (error) {
                console.error('Error loading tree data:', error, this);
            }
        }


        this.state.data_source = data_source;
        this.state.data_load_success = data_load_success;
        try {
            this.state.onDataLoaded?.call(this, this, this.state);
        } catch (error) {
            console.error(`Error in handling 'onDataLoaded' event by user code`, error, this);
        }

        // Apply initial selection BEFORE first render so the first paint reflects it.
        try {
            await this._initializeSelection(true);
            // _initializeSelection(true) no longer performs its own render.
            await this.render();
        } catch (error) {
            console.error('Error rendering tree:', error, this);
            this.renderError(error);
        }


    } // _loadDataAndRender

    private async _initializeSelection(preRender: boolean = false) {
        try {
            if (this.state.initialSelection != null) {
                if (Array.isArray(this.state.initialSelection) && this.state.initialSelection.length > 0) {
                    let ids: string[] = [];
                    if (typeof this.state.initialSelection[0] === 'string') {
                        ids = this.state.initialSelection as string[];
                    } else {
                        const nodes = this.state.initialSelection as N2TreeList_Node<RECORD_TYPE>[];
                        ids = nodes.map(n => this.idForNode(n)).filter(id => id != null);
                    }

                    // Enforce single selection if needed: first item wins
                    if (!this.state.multiSelect && ids.length > 0) {
                        ids = [ids[0]];
                    }

                    // Apply selection to sets
                    let updated = false;
                    ids.forEach(id => {
                        if (!this.selectedNodes.has(id)) {
                            this.selectedNodes.add(id);
                            this.state._selectedNodes!.add(id);
                            updated = true;
                        }
                    });

                    if (updated) {
                        // Update allSelected flag (never true in single-select)
                        const allSelected = this.state.multiSelect
                            ? this._flattenTree(this._treeDataArray).every(node => this.selectedNodes.has(this.state.id(node)))
                            : false;
                        this.state.allSelected = allSelected;

                        // Fire selection change now
                        this._handleSelectionChange();
                    }

                    if (!preRender) {
                        await this.render();
                    }
                }
            } else if (this.state.allSelected) {
                if (preRender) {
                    if (this.state.multiSelect) {
                        // Manually select all without rendering yet
                        this._flattenTree(this._treeDataArray).forEach(node => {
                            const id = this.state.id(node);
                            this.selectedNodes.add(id);
                            this.state._selectedNodes!.add(id);
                        });
                        this.state.allSelected = true;
                    } else {
                        // Single-select: select only the first node, keep allSelected=false
                        const first = this.firstNode;
                        this.selectedNodes.clear();
                        this.state._selectedNodes!.clear();
                        if (first) {
                            const id = this.state.id(first);
                            this.selectedNodes.add(id);
                            this.state._selectedNodes!.add(id);
                        }
                        this.state.allSelected = false;
                    }
                    this._handleSelectionChange();
                } else {
                    this.selectAllCurrentView = true; // will render (guarded inside setter)
                }
            } else {
                if (!preRender) {
                    await this.render();
                }
            }
        } catch (e) {
            console.error('Error initializing selection:', e, this);
        } finally {
            this.state.initialSelection = [];
        }
    }

    private renderError(error: any) {
        this.htmlElement.innerHTML = '';

        const errorMessage = htmlToElement(`<div>Error loading data.</div>`) as HTMLElement;

        const retryButton = htmlToElement(`<button>Retry</button>`) as HTMLElement;
        retryButton.addEventListener('click', async () => {
            await this.refreshDataAndRender();
        });

        this.htmlElement.appendChild(errorMessage);
        this.htmlElement.appendChild(retryButton);
    }

    /**
     * Refresh the UI of the tree list by re-rendering the nodes.
     * @return {Promise<void>}
     */
    public async render(): Promise<void> {
        await this._render_implementation();
    }

    private async _render_implementation(overwrite_renderInProgress: boolean = false): Promise<Error> {
        if (this._renderInProgress) {
            if (overwrite_renderInProgress) {
                // Allow overwrite for re-runs
            } else {
                this._renderWaiting = true;
                return null;
            }
        } else {
            this._renderInProgress = true;
        }

        try {
            this.htmlElement.innerHTML = '';

            for (let index = 0; index < this._treeDataArray.length; index++) {
                const node = this._treeDataArray[index];
                await this.renderNode(node, index, 0, this.htmlElement);

                if (this._renderWaiting) {
                    this._renderWaiting = false;
                    break;
                }
            }

            if (this._renderWaiting) {
                await this._render_implementation(true);
                return null;
            }

            if (this.state.onRendered) {
                this.state.onRendered.call(this, this, this.state);
            }
        } catch (error) {
            console.error('Error rendering tree list:', error);
            return error;
        } finally {
            if (overwrite_renderInProgress) {
                // Do nothing
            } else {
                this._renderInProgress = false;

                if (this._renderWaiting) {
                    this._renderWaiting = false;
                    await this._render_implementation(true);
                }
            }
        }

        return null;
    }

    private _renderInProgress: boolean = false;
    private _renderWaiting: boolean = false;

    private async renderNode(
        node: N2TreeList_Node<RECORD_TYPE>,
        index: number,
        depth: number,
        container: HTMLElement
    ) {
        const nodeParams: N2TreeList_RenderNodeParams<RECORD_TYPE> = {
            node: node,
            index: index,
            depth: depth,
            state: this.state,
        };

        // Create the inner content element (provided by user or default)
        const innerContentElement = this.state.renderNode
            ? await this.state.renderNode(nodeParams)
            : this.defaultRenderNode(nodeParams);

        // Create the row container that will hold [checkbox][content]
        const rowElement = document.createElement('div');
        rowElement.classList.add(CSS_CLASS_N2TREELIST.NODE);
        rowElement.setAttribute('data-id', this.state.id(node));
        
        // Apply optional row height if provided
        if (this.state.minRowHeight != null) {
            const h = this.state.minRowHeight;
            const val = (typeof h === 'number') ? `${h}px` : h;
            rowElement.style.minHeight = val;
        }

        // Add checkbox if enabled
        let _renderRowCheckboxes: boolean = false;
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

        if (_renderRowCheckboxes) {
            const checkbox = this._renderRowCheckbox(node);
            // Keep checkbox click isolated from row/content clicks
            rowElement.appendChild(checkbox);
        }

        // Create content container to isolate click selection from checkbox
        const contentContainer = document.createElement('div');
        contentContainer.classList.add(CSS_CLASS_N2TREELIST.NODE_CONTENT_CONTAINER);


        // Indent based on depth (apply to the whole row, including checkbox)
        rowElement.style.paddingLeft = `${depth * 20 + 3}px`;

        // Handle expand/collapse if node has children
        if (node.child && node.child.length > 0) {
            const caretIcon = node.expanded ? 'fa-caret-down' : 'fa-caret-right';
            const expandIcon = htmlToElement(`<i class="fa ${caretIcon} ${CSS_CLASS_N2TREELIST.EXPAND_ICON}"></i>`) as HTMLElement;

            let toggleExpandIcon = async (e: MouseEvent): Promise<void> => {
                e.stopPropagation();
                node.expanded = !node.expanded;
                await this.render();
            } // toggleExpandIcon
            expandIcon.addEventListener('click', toggleExpandIcon);

            // Allow double-click on content to toggle
            contentContainer.addEventListener('dblclick', toggleExpandIcon);

            contentContainer.appendChild(expandIcon);
        } else {
            // No expand icon and no placeholder to avoid extra spacing when no children
        }

        // Append the original inner content into the content container
        contentContainer.appendChild(innerContentElement);

        // Selection styling applies to the whole row
        if (this.selectedNodes.has(this.state.id(node))) {
            rowElement.classList.add(CSS_CLASS_N2TREELIST.SELECTED);
        } else {
            rowElement.classList.remove(CSS_CLASS_N2TREELIST.SELECTED);
        }

        // Handle selection on click - only on content container
        contentContainer.addEventListener('click', (event: MouseEvent) => this._handleNodeClick(event, node));

        // Handle drag and drop on the row container
        if (this.state.dragAndDrop) {
            rowElement.draggable = true;
            rowElement.addEventListener('dragstart', (e) => this._handleDragStart(e, node));
            rowElement.addEventListener('drag', (e) => this._handleDrag(e, node));
            rowElement.addEventListener('dragend', (e) => this._handleDragEnd(e, node));

            rowElement.addEventListener('dragenter', (e) => this._handleDragEnter(e, node));
            rowElement.addEventListener('dragover', (e) => this._handleDragOver(e, node));
            rowElement.addEventListener('dragleave', (e) => this._handleDragLeave(e));
            rowElement.addEventListener('drop', (e) => this._handleDrop(e, node));
        }

        // Final assembly
        rowElement.appendChild(contentContainer);
        container.appendChild(rowElement);

        // Render child nodes if expanded
        if (node.expanded && node.child && node.child.length > 0) {
            for (let childIndex = 0; childIndex < node.child.length; childIndex++) {
                const childNode = node.child[childIndex];
                await this.renderNode(childNode, childIndex, depth + 1, container);
            }
        }
    }

    protected defaultRenderNode(_params: N2TreeList_RenderNodeParams<RECORD_TYPE>): HTMLElement {
        const element = htmlToElement(`<div class="${CSS_CLASS_N2TREELIST.DEFAULT_NODE}"> </div>`) as HTMLElement;
        return element;
    }

    // -------------------- Selection Handling --------------------

    /**
     * Handles the node click event for selection logic.
     * Utilizes public selection and deselection methods to manage single, range, and toggle selections.
     *
     * - **Single Click:** Clears existing selections and selects the clicked node.
     * - **Shift + Click:** Selects a range of nodes from the last selected node to the clicked node.
     * - **Ctrl/Cmd + Click:** Toggles the selection state of the clicked node without affecting other selections.
     *
     * @param event The mouse event triggered by clicking on a node.
     * @param node The node associated with the clicked element.
     */
    protected _handleNodeClick(event: MouseEvent, node: N2TreeList_Node<RECORD_TYPE>): void {
        try {
            const isShift = event.shiftKey;
            const isCtrl = event.ctrlKey || event.metaKey;

            // In single-select mode, ignore Shift/Ctrl/Cmd entirely and always do single selection
            if (!this.state.multiSelect) {
                this.clearSelection();
                const id = this.state.id(node);
                this.selectNodesById(id);
                this._lastSelectedNodeId = id;
                return;
            }

            if (isShift && this._lastSelectedNodeId) {
                // Range selection
                const currentNodeId = this.state.id(node);
                const lastNodeId = this._lastSelectedNodeId;

                const allNodes = this._flattenTree(this._treeDataArray);
                const currentIndex = allNodes.findIndex(n => this.state.id(n) === currentNodeId);
                const lastIndex = allNodes.findIndex(n => this.state.id(n) === lastNodeId);

                if (currentIndex !== -1 && lastIndex !== -1) {
                    const [start, end] = currentIndex < lastIndex ? [currentIndex, lastIndex] : [lastIndex, currentIndex];
                    const nodesToSelect = allNodes.slice(start, end + 1);
                    this.selectNodesByRecord(nodesToSelect);
                }

                this._lastSelectedNodeId = currentNodeId;
            } else if (isCtrl) {
                // Toggle selection
                const nodeId = this.state.id(node);
                if (this.selectedNodes.has(nodeId)) {
                    this.deselectNodesById(nodeId);
                } else {
                    this.selectNodesById(nodeId);
                }
                this._lastSelectedNodeId = nodeId;
            } else {
                // Single selection
                this.clearSelection();
                this.selectNodesById(this.state.id(node));
                this._lastSelectedNodeId = this.state.id(node);
            }
        } catch (error) {
            console.error('Error handling node click:', error);
        }
    }

    /**
     * Flattens the tree into a linear array for easy range selection.
     */
    private _flattenTree(nodes: N2TreeList_Node<RECORD_TYPE>[]): N2TreeList_Node<RECORD_TYPE>[] {
        let flat: N2TreeList_Node<RECORD_TYPE>[] = [];
        nodes.forEach(node => {
            flat.push(node);
            if (node.expanded && node.child) {
                flat = flat.concat(this._flattenTree(node.child));
            }
        });
        return flat;
    }

    /**
     * Clears all selections.
     */
    public clearSelection() {
        try {
            this.selectedNodes.clear();
            this.state._selectedNodes!.clear();

            // Uncheck all checkboxes and remove selected class
            Array.from(this.htmlElement.children).forEach(child => {
                const row = child as HTMLElement;
                const checkbox = row.querySelector(`.${CSS_CLASS_N2TREELIST.CHECKBOX}`) as HTMLInputElement;
                if (checkbox)
                    checkbox.checked = false;
                row.classList.remove(CSS_CLASS_N2TREELIST.SELECTED);
            });

            // Remove selection classes from all nodes
            Array.from(this.htmlElement.querySelectorAll(`.${CSS_CLASS_N2TREELIST.SELECTED}`)).forEach(elem => {
                elem.classList.remove(CSS_CLASS_N2TREELIST.SELECTED);
            });

            // Only trigger selection change if not suppressed
            if (!this.state.suppressSelectionEvents) {
                this._handleSelectionChange();
            }
        } catch (error) {
            console.error('Error clearing selection:', error);
        }
    }


    public selectFirstNode(): void {
        let firstNode = this.firstNode;
        if (firstNode) {
            let id = this.state.id(firstNode);
            this.selectNodesById(id);
            this._lastSelectedNodeId = id;
        } // if (firstNode == null) {
    } // selectFirstNode

    /**
     * Selects one or more nodes based on the provided node IDs.
     * @param param Single node ID or array of node IDs to select.
     */
    public selectNodesById(param: string | string[]): void {
        if (param == null) return;
        if (!this.state.multiSelect) {
            // Enforce single selection
            const id = Array.isArray(param) ? param[0] : param;
            if (id == null) return;

            // If already the only selected, do nothing
            if (this.selectedNodes.size === 1 && this.selectedNodes.has(id)) {
                return;
            }

            this.selectedNodes.clear();
            this.state._selectedNodes!.clear();
            this.selectedNodes.add(id);
            this.state._selectedNodes!.add(id);
            this.state.allSelected = false;

            this._handleSelectionChange();
            this.render();
            return;
        }

        // Multi-select behavior (existing)
        let ids: string[] = Array.isArray(param) ? param : [param];
        let updated = false;

        ids.forEach(id => {
            if (!this.selectedNodes.has(id)) {
                this.selectedNodes.add(id);
                this.state._selectedNodes!.add(id);
                updated = true;
            }
        });

        if (updated) {
            // Update allSelected flag
            const allSelected = this._flattenTree(this._treeDataArray).every(node => this.selectedNodes.has(this.state.id(node)));
            this.state.allSelected = allSelected;

            this._handleSelectionChange();
            this.render();
        }
    }

    /**
     * Selects one or more nodes based on the provided node records.
     * @param param Single node or array of nodes to select.
     */
    public selectNodesByRecord(param: N2TreeList_Node<RECORD_TYPE> | N2TreeList_Node<RECORD_TYPE>[]): void {
        if (param == null) return;
        if (!this.state.multiSelect) {
            // Enforce single selection
            const node = Array.isArray(param) ? param[0] : param;
            if (!node) return;
            const id = this.state.id(node);

            if (this.selectedNodes.size === 1 && this.selectedNodes.has(id)) {
                return;
            }

            this.selectedNodes.clear();
            this.state._selectedNodes!.clear();
            this.selectedNodes.add(id);
            this.state._selectedNodes!.add(id);
            this.state.allSelected = false;

            this._handleSelectionChange();
            this.render();
            return;
        }

        // Multi-select behavior (existing)
        let nodes: N2TreeList_Node<RECORD_TYPE>[] = Array.isArray(param) ? param : [param];
        let updated = false;

        nodes.forEach(node => {
            const id = this.state.id(node);
            if (!this.selectedNodes.has(id)) {
                this.selectedNodes.add(id);
                this.state._selectedNodes!.add(id);
                updated = true;
            }
        });

        if (updated) {
            // Update allSelected flag
            const allSelected = this._flattenTree(this._treeDataArray).every(node => this.selectedNodes.has(this.state.id(node)));
            this.state.allSelected = allSelected;

            this._handleSelectionChange();
            this.render();
        }
    }

    /**
     * Deselects one or more nodes based on the provided node IDs.
     * @param param Single node ID or array of node IDs to deselect.
     */
    public deselectNodesById(param: string | string[]): void {
        if (param == null) return;
        let ids: string[] = Array.isArray(param) ? param : [param];
        let updated = false;

        ids.forEach(id => {
            if (this.selectedNodes.has(id)) {
                this.selectedNodes.delete(id);
                this.state._selectedNodes!.delete(id);
                updated = true;
            }
        });

        if (updated) {
            // Update allSelected flag
            this.state.allSelected = false;

            this._handleSelectionChange();
            this.render();
        }
    }

    /**
     * Deselects one or more nodes based on the provided node records.
     * @param param Single node or array of nodes to deselect.
     */
    public deselectNodesByRecord(param: N2TreeList_Node<RECORD_TYPE> | N2TreeList_Node<RECORD_TYPE>[]): void {
        if (param == null) return;
        let nodes: N2TreeList_Node<RECORD_TYPE>[] = Array.isArray(param) ? param : [param];
        let updated = false;

        nodes.forEach(node => {
            const id = this.state.id(node);
            if (this.selectedNodes.has(id)) {
                this.selectedNodes.delete(id);
                this.state._selectedNodes!.delete(id);
                updated = true;
            }
        });

        if (updated) {
            // Update allSelected flag
            this.state.allSelected = false;

            this._handleSelectionChange();
            this.render();
        }
    }

    /**
     * Returns the current selection including both node IDs and data records.
     */
    public getSelection(): N2TreeList_Selection<RECORD_TYPE> {
        const nodeIds: string[] = Array.from(this.selectedNodes);
        const nodes: N2TreeList_Node<RECORD_TYPE>[] = [];

        try {
            this._flattenTree(this._treeDataArray).forEach(node => {
                if (this.selectedNodes.has(this.state.id(node)) && node.data) {
                    nodes.push(node.data);
                }
            });
        } catch (error) {
            console.error('Error getting current selection:', error);
        }

        return {ids: nodeIds, nodes: nodes};
    } // getSelection

    /**
     * Selects all nodes in the current view.
     */
    public get selectAllCurrentView() {
        return this.state.allSelected;
    }

    public set selectAllCurrentView(allSelected: boolean) {
        if (this._selectAllCurrentViewInProgress) return;
        this._selectAllCurrentViewInProgress = true;

        try {
            if (!this.state.multiSelect) {
                // Single-select mode: degrade behavior
                if (allSelected) {
                    // Select only the first visible node (if any) and keep allSelected=false
                    this.selectedNodes.clear();
                    this.state._selectedNodes!.clear();
                    const first = this.firstNode;
                    if (first) {
                        const id = this.state.id(first);
                        this.selectedNodes.add(id);
                        this.state._selectedNodes!.add(id);
                    }
                    this.state.allSelected = false;
                } else {
                    // Deselect all
                    this.selectedNodes.clear();
                    this.state._selectedNodes!.clear();
                    this.state.allSelected = false;
                }

                if (this.state.onSelectAll) {
                    this.state.onSelectAll.call(this, this.state);
                }
                this._handleSelectionChange();
                this.render();
                return;
            }

            // Multi-select mode (existing behavior)
            this.state.allSelected = allSelected;

            if (allSelected) {
                // Select all nodes
                this._flattenTree(this._treeDataArray).forEach(node => {
                    this.selectedNodes.add(this.state.id(node));
                    this.state._selectedNodes!.add(this.state.id(node));
                });
            } else {
                // Deselect all
                this.selectedNodes.clear();
                this.state._selectedNodes!.clear();
            }

            // Trigger callbacks
            if (this.state.onSelectAll) {
                this.state.onSelectAll.call(this, this.state);
            }

            this._handleSelectionChange();

            // Re-render to update UI
            this.render();
        } catch (error) {
            console.error('Error handling select all:', error);
        } finally {
            this._selectAllCurrentViewInProgress = false;
        }
    }

    private _selectAllCurrentViewInProgress: boolean = false;

    // -------------------- Selection Change Handling --------------------

    private _lastSelection: N2TreeList_Selection<RECORD_TYPE> = {ids: [], nodes: []};

    // -------------------- Drag and Drop Handling --------------------
    protected async _handleDragStart(event: DragEvent, node: N2TreeList_Node<RECORD_TYPE>) {
        if (!node.data) return;

        try {
            const nodeId = this.state.id(node);
            let nodesToDrag: N2TreeList_Node<RECORD_TYPE>[] = [];

            // If multiple nodes are selected, drag all selected
            if (this.selectedNodes.size > 1) {
                nodesToDrag = this._flattenTree(this._treeDataArray).filter(n => this.selectedNodes.has(this.state.id(n)));
            } else {
                nodesToDrag = [node];
            }

            const dragData: N2TreeList_DraggedData<RECORD_TYPE> = {
                obj_class: N2TreeList_DraggedData.CLASS_IDENTIFIER,
                items: nodesToDrag.map(n => n.data!),
                nodes: nodesToDrag,
            };

            const param: N2TreeList_OnDragStart<RECORD_TYPE> = {
                state: this.state,
                data: dragData,
                event: event,
            };

            N2DnD.handleDragStart(param);

            // Add dragging class
            nodesToDrag.forEach(n => {
                const elem = this.getNodeHTMLElementById(this.state.id(n));
                if (elem) elem.classList.add(N2DnD.CSS_CLASSES.DRAGGING);
            });

            // Set custom drag image
            if (this.state.getCustomDragElement) {
                let ev_customDragElem: N2TreeList_CustomDragElement<RECORD_TYPE> = {
                    widget: this,
                    state: this.state,
                    items: nodesToDrag.map(n => n.data!),
                }

                const customDragElement = this.state.getCustomDragElement(ev_customDragElem);
                if (customDragElement) {
                    document.body.appendChild(customDragElement);
                    event.dataTransfer!.setDragImage(customDragElement, customDragElement.clientWidth / 2, customDragElement.clientHeight / 2);
                    N2DnD.customDragImage = customDragElement;
                }
            } else {
                const defaultDragImage = this._defaultDragImage(nodesToDrag.map(n => n.data!));
                document.body.appendChild(defaultDragImage);
                event.dataTransfer!.setDragImage(defaultDragImage, defaultDragImage.clientWidth / 2, defaultDragImage.clientHeight / 2);
                N2DnD.customDragImage = defaultDragImage;
            }
        } catch (error) {
            console.error('Error handling drag start:', error);
            const target = event.currentTarget as HTMLElement;
            target.classList.remove(N2DnD.CSS_CLASSES.DRAGGING);
        }
    } // _handleDragStart

    protected _handleDrag(event: DragEvent, node: N2TreeList_Node<RECORD_TYPE>) {
        try {
            const param: N2TreeList_OnDrag<RECORD_TYPE> = {
                state: this.state,
                event: event,
            };
            N2DnD.handleDrag(param);
        } catch (error) {
            console.error('Error handling drag:', error);
        }
    }

    protected _handleDragEnd(event: DragEvent, node: N2TreeList_Node<RECORD_TYPE>) {
        try {
            const param: N2TreeList_OnDragEnd<RECORD_TYPE> = {
                state: this.state,
                data: N2DnD.dragData,
                event: event,
            };
            N2DnD.handleDragEnd(param);

            // Remove dragging class
            this._flattenTree(this._treeDataArray).forEach(n => {
                const elem = this.getNodeHTMLElementById(this.state.id(n));
                if (elem) elem.classList.remove(N2DnD.CSS_CLASSES.DRAGGING);
            });
        } catch (error) {
            console.error('Error handling drag end:', error);
        }
    }

    protected _handleDragEnter(event: DragEvent, node: N2TreeList_Node<RECORD_TYPE>) {
        try {
            const param: N2TreeList_OnDragEnter<RECORD_TYPE> = {
                state: this.state,
                data: N2DnD.dragData,
                event: event,
                event_dragstart: N2DnD.evtDragStart,
                current_target: event.currentTarget as HTMLElement,
                node: node,
            };
            N2DnD.handleDragEnter(param);
        } catch (error) {
            console.error('Error handling drag enter:', error);
        }
    }

    protected _handleDragOver(event: DragEvent, node: N2TreeList_Node<RECORD_TYPE>) {
        try {
            event.preventDefault();
            const param: N2TreeList_OnDragOver<RECORD_TYPE> = {
                state: this.state,
                data: N2DnD.dragData,
                event_dragover_current: event,
                event_dragstart: N2DnD.evtDragStart,
                current_target: event.currentTarget as HTMLElement,
                previous_target: N2DnD.evtDragOverTarget,
                node: node,
            };
            N2DnD.handleDragOver(param);
        } catch (error) {
            console.error('Error handling drag over:', error);
        }
    }

    protected _handleDragLeave(event: DragEvent) {
        try {
            N2DnD.removeDropIndicator();

            const param: N2TreeList_OnDragLeave<RECORD_TYPE> = {
                state: this.state,
                data: N2DnD.dragData,
                event: event,
                event_dragstart: N2DnD.evtDragStart,
                current_target: event.currentTarget as HTMLElement,
                node: null,
            };
            N2DnD.handleDragLeave(param);
        } catch (error) {
            console.error('Error handling drag leave:', error);
        }
    }

    protected async _handleDrop(event: DragEvent, targetNode: N2TreeList_Node<RECORD_TYPE>) {
        try {
            event.preventDefault();

            let dragData: N2TreeList_DraggedData<RECORD_TYPE> | null = N2DnD.dragData as N2TreeList_DraggedData<RECORD_TYPE> | null;

            if (!dragData) {
                const dragDataStr = event.dataTransfer?.getData('application/json');
                if (dragDataStr) {
                    try {
                        dragData = JSON.parse(dragDataStr);
                    } catch (e) {
                        console.error('N2TreeList: Failed to parse drag data during drop:', e);
                        return;
                    }
                }
            }

            if (!dragData) {
                console.warn('N2TreeList: No drag data found during drop.');
                return;
            }

            const param: N2TreeList_OnDrop<RECORD_TYPE> = {
                state: this.state,
                data: dragData,
                event: event,
                targetNode: targetNode,
                current_target: event.currentTarget as HTMLElement,
            };
            N2DnD.handleOnDrop(param);

            // // Optionally, handle default drop behavior
            // if (this.state.onDrop) {
            //     this.state.onDrop(param);
            // }

            await this.render();
        } catch (error) {
            console.error('Error handling drop:', error);
        } finally {
            N2DnD.removeDropIndicator();
        }
    } // _handleDrop


    protected idForNode(node: N2TreeList_Node<RECORD_TYPE>): string {
        let id: string
        if (this.state.id)
            id = this.state.id(node);

        if (id != null) {
            if (!isString(id)) { //lodash isString method
                id = toString(id); //lodash toString method
            } // if (!isString(id))
        } // if ( id != null)
        return id;
    } // idForRecord


    protected _renderRowCheckbox(node: N2TreeList_Node<RECORD_TYPE>): HTMLElement {

        let id = this.idForNode(node);
        const checkbox = htmlToElement(`<input type="checkbox" class="${CSS_CLASS_N2TREELIST.CHECKBOX}">`) as HTMLInputElement;
        checkbox.checked = this.state.allSelected! || this.state._selectedNodes!.has(id);
        // Isolate checkbox interactions from row/content clicks
        checkbox.addEventListener('click', (e: Event) => e.stopPropagation());
        checkbox.addEventListener('change', (e: Event) => {
            e.stopPropagation();
            this._handleRowCheckboxChange(node, (e.currentTarget as HTMLInputElement).checked);
        });
        return checkbox;
    }   // _renderRowCheckbox

    protected _handleRowCheckboxChange(node: N2TreeList_Node<RECORD_TYPE> | null, checked: boolean) {
        if (!node) return;
        if (!node.data) return;

        try {
            const toggleId = (n: N2TreeList_Node<RECORD_TYPE>) => this.idForNode(n);
            const collectDescendantIds = (n: N2TreeList_Node<RECORD_TYPE>, arr: string[]) => {
                if (!n.child || n.child.length === 0) return;
                for (const c of n.child) {
                    const cid = this.idForNode(c);
                    if (cid != null) arr.push(cid);
                    collectDescendantIds(c, arr);
                }
            };

            const id = toggleId(node);
            if (!id) return;

            if (!this.state.multiSelect) {
                // Single-select mode: only the clicked node is selected
                this.state._selectedNodes!.clear();
                if (checked) this.state._selectedNodes!.add(id);
                this.state.allSelected = false;
            } else {
                // Multi-select mode
                const idsToAffect: string[] = [id];
                if (!this.state.parentCheckDoesNotCascade) {
                    collectDescendantIds(node, idsToAffect);
                }

                if (checked) {
                    idsToAffect.forEach(x => this.state._selectedNodes!.add(x));
                } else {
                    idsToAffect.forEach(x => this.state._selectedNodes!.delete(x));
                }

                // Update selectAllCurrentViewCheckbox state based on current view
                const currentCount = this.currentViewNodes!.length;
                // Count how many of the current view are selected
                let selectedInView = 0;
                this.currentViewNodes!.forEach(n => { if (this.state._selectedNodes!.has(this.idForNode(n))) selectedInView++; });
                this.state.allSelected = (selectedInView === currentCount && currentCount > 0);
            }

            if (this.state.onSelectAll)
                this.state.onSelectAll.call(this, this.state);

            // Trigger callback
            if (this.state.onCheckboxChange) {
                this.state.onCheckboxChange(this.state._selectedNodes!, this.state);
            }

            // Handle selection change
            this._handleSelectionChange.call(this);

            const thisX = this;
            // Re-render to update row styles
            setTimeout(async () => {
                await thisX.render.call(thisX)
            });
        } catch (error) {
            console.error('Error handling row checkbox change:', error);
        }
    } // _onRowCheckboxChange


    // -------------------- Helper Methods --------------------

    /**
     * Expands a node by ID or node reference.
     * @param nodeOrId The node to expand (either the node object or its ID)
     * @param expandAncestors Whether to also expand all ancestor nodes to make this node visible (default: true)
     * @returns Promise that resolves when the expansion and re-render is complete
     */
    public async expandNode(nodeOrId: N2TreeList_Node<RECORD_TYPE> | string, expandAncestors: boolean = true): Promise<void> {
        try {
            let targetNode: N2TreeList_Node<RECORD_TYPE> | null = null;

            if (typeof nodeOrId === 'string') {
                targetNode = this.findNodeById(nodeOrId, this._treeDataArray);
            } else {
                targetNode = nodeOrId;
            }

            if (!targetNode) {
                console.warn('Node not found for expansion:', nodeOrId);
                return;
            }

            // Expand the target node if it has children
            if (targetNode.child && targetNode.child.length > 0) {
                targetNode.expanded = true;
            }

            // Expand ancestors if requested
            if (expandAncestors) {
                this._expandAncestors(targetNode, this._treeDataArray);
            }

            // Re-render to show the expanded state
            await this.render();
        } catch (error) {
            console.error('Error expanding node:', error);
        }
    }

    /**
     * Recursively finds and expands all ancestor nodes of the target node.
     * @returns {boolean} True if the target node is found in the current branch, otherwise false.
     */
    private _expandAncestors(targetNode: N2TreeList_Node<RECORD_TYPE>, nodes: N2TreeList_Node<RECORD_TYPE>[]): boolean {
        for (const node of nodes) {
            if (node === targetNode) {
                return true; // Found the node, start unwinding
            }

            if (node.child && node.child.length > 0) {
                const foundInChildren = this._expandAncestors(targetNode, node.child);
                if (foundInChildren) {
                    // If found in children, this node is an ancestor, so expand it.
                    node.expanded = true;
                    return true; // Continue unwinding
                }
            }
        }
        return false; // Not found in this branch
    }

    /**
     * Retrieves the HTMLElement of a node by its ID.
     */
    public getNodeHTMLElementById(id: string): HTMLElement | null {
        return this.htmlElement.querySelector(`.${CSS_CLASS_N2TREELIST.NODE}[data-id="${id}"]`) as HTMLElement | null;
    }

    /**
     * Finds a node by its ID within the tree.
     */
    public findNodeById(id: string, nodes: N2TreeList_Node<RECORD_TYPE>[]): N2TreeList_Node<RECORD_TYPE> | null {
        for (let node of nodes) {
            if (this.state.id(node) === id) {
                return node;
            } else if (node.child) {
                const found = this.findNodeById(id, node.child);
                if (found) return found;
            }
        }
        return null;
    }

    /**
     * Returns the current selection including both node IDs and data records.
     * The return value of the currentViewNodes getter in N2TreeList will always be an array, never null.
     * The return value is at least an empty array, never null.
     *
     */
    public get currentViewNodes(): N2TreeList_Node<RECORD_TYPE>[] {
        return this._flattenTree(this._treeDataArray);
    }

    /**
     * Returns the tree data as an array of nodes.
     * This is a getter that returns the internal treeDataArray.
     * The return value is at least an empty array, never null.
     */
    public get treeData(): N2TreeList_Node<RECORD_TYPE>[] {
        return this._treeDataArray;
    }

    public get firstNode() : N2TreeList_Node<RECORD_TYPE> | null {
            let current_nodes = this.currentViewNodes ;
            if ( current_nodes == null || current_nodes.length === 0 )
                return null;
            return current_nodes[0];
    } // firstNode


    // -------------------- Selection and Rendering Enhancements --------------------

    /**
     * Computes the differences between current and last selections.
     */
    protected _computeSelectionDifferences(
        current: N2TreeList_Selection<RECORD_TYPE>,
        last: N2TreeList_Selection<RECORD_TYPE>
    ): N2TreeList_Selection_Differences<RECORD_TYPE> {

        const added: N2TreeList_Selection<RECORD_TYPE> = {ids: [], nodes: []};
        const removed: N2TreeList_Selection<RECORD_TYPE> = {ids: [], nodes: []};

        const lastIds = new Set(last.ids);
        const currentIds = new Set(current.ids);

        // Added
        current.ids.forEach((id, index) => {
            if (!lastIds.has(id)) {
                const node = current.nodes[index]; // the corresponding node
                if (node) {
                    added.ids.push(id);
                    added.nodes.push(node);
                }
            }
        });

        // Removed
        last.ids.forEach((id, index) => {
            if (!currentIds.has(id)) {
                const node = last.nodes[index]; // the corresponding node
                if (node) {
                    removed.ids.push(id);
                    removed.nodes.push(node);
                }
            }
        });

        return {added: added, removed: removed} as N2TreeList_Selection_Differences<RECORD_TYPE>;
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

            const currentSelection: N2TreeList_Selection<RECORD_TYPE> = this.getSelection();
            const differences = this._computeSelectionDifferences(currentSelection, this._lastSelection);
            if (this.state.onSelectionChange) {
                const param: N2TreeList_onSelectionChangeEvent<RECORD_TYPE> = {
                    currentSelection,
                    lastSelection: this._lastSelection,
                    differences,
                };
                this.state.onSelectionChange.call(this, param);
            }
            this._lastSelection = {...currentSelection};
        } catch (error) {
            console.error('Error handling selection change:', error);
        }
    } // _handleSelectionChange

    // -------------------- Drag Image --------------------
    protected _defaultDragImage(draggedRecords: RECORD_TYPE[]): HTMLElement {
        const dragImage = htmlToElement(`<div class="${CSS_CLASS_N2TREELIST.DRAG_IMAGE}"></div>`) as HTMLElement;
        dragImage.textContent = draggedRecords.length > 1
            ? `${draggedRecords.length} items selected`
            : `${(draggedRecords[0] as any).name || 'One item selected'}`;

        document.body.appendChild(dragImage);
        return dragImage;
    } // _defaultDragImage

    // -------------------- Spinner Handling --------------------
    protected _handleStartSpinner() {
        try {
            if (this.state.onStartSpinner)
                this.state.onStartSpinner({widget: this, state: this.state});
        } catch (error) {
            console.error('Error starting spinner:', error);
        }
    } // _handleStartSpinner

    protected _handleStopSpinner() {
        try {
            if (this.state.onStopSpinner)
                this.state.onStopSpinner({widget: this, state: this.state});
        } catch (error) {
            console.error('Error stopping spinner:', error);
        }
    } // _handleStopSpinner

    // -------------------- Drop Indicator Methods --------------------
    public dropIndicator_Remove_TreeList() {
        try {
            if (N2DnD.dropIndicator) {
                N2DnD.dropIndicator.remove();
                N2DnD.dropIndicator = null;
            }
        } catch (error) {
            console.error('Error removing tree drop indicator:', error);
        }
    } // dropIndicator_Remove_TreeList

    public dropIndicator_Show_TreeList(position: 'top' | 'bottom') {
        try {
            this.dropIndicator_Remove_TreeList();

            let cssClasses:string[] = [CSS_CLASS_N2TREELIST.DROP_INDICATOR];
            // const indicator = document.createElement('div');

            // // Position the indicator at the top or bottom of the tree list
            // indicator.style.position = 'absolute';
            // indicator.style.left = '0';
            // indicator.style.right = '0';
            // indicator.style.height = '4px';
            // indicator.style.background = 'blue';
            // indicator.style.pointerEvents = 'none';
            // indicator.style.zIndex = '1';

            if (position === 'top') {
                cssClasses.push(CSS_CLASS_N2TREELIST.DROP_INDICATOR_TOP);
                // indicator.style.top = '0px';
            } else {
                cssClasses.push(CSS_CLASS_N2TREELIST.DROP_INDICATOR_BOTTOM);
                // indicator.style.bottom = '0px';
            }

            let indicator = htmlToElement(`<div class="${cssClasses.join(' ')}"></div>`) as HTMLElement;

            this.htmlElement.appendChild(indicator);
            N2DnD.dropIndicator = indicator;
        } catch (error) {
            console.error('Error showing tree drop indicator:', error);
        }
    } // dropIndicator_Show_TreeList
} // N2TreeList

// -------------------- Refresh Event Interface --------------------
export interface N2TreeList_RefreshEvent {
    /**
     * When true, indicates that cached data should be ignored and fresh data should be loaded
     */
    ignoreCache?: boolean;
}

// -----------------------------------------------------
// --------- Exported Module Constants -----------------
// -----------------------------------------------------
// Ensure that CSS classes used in this module are consistent with N2TreeList
export const CSS_CLASS_N2TREELIST = {
    NODE: 'n2-tlx-node',
    DEFAULT_NODE: 'n2-tlx-inner-node',
    NODE_CONTENT_CONTAINER: 'n2-tlx-node-content-container',
    SELECTED: 'n2-tlx-selected',
    CHECKBOX: 'n2-tlx-checkbox',
    DROP_INDICATOR: 'n2-tlx-drop-indicator',
    DROP_INDICATOR_TOP: 'n2-tlx-drop-indicator-top',
    DROP_INDICATOR_BOTTOM: 'n2-tlx-drop-indicator-bottom',
    DRAG_IMAGE: 'n2-tlx-drag-img',
    EXPAND_ICON: 'n2-tlx-expand-icon',
    PLACEHOLDER_NO_CHILDREN: 'n2-tlx-placeholder-icon',
};

let cssLoaded = false;

function loadCSS(): void {
    if (cssLoaded) return;

    try {
        cssAdd(`
    
.${N2TreeList.CLASS_IDENTIFIER} {
    position:  relative;  
}
    
.${CSS_CLASS_N2TREELIST.PLACEHOLDER_NO_CHILDREN} {
    display: inline-block;
    width: 8px;
    margin-right: 5px;
}
.${CSS_CLASS_N2TREELIST.DEFAULT_NODE} {
    display: flex;
    align-items: center;
}
.${CSS_CLASS_N2TREELIST.NODE} {
    display: flex;
    align-items: center;
}

.${CSS_CLASS_N2TREELIST.NODE_CONTENT_CONTAINER} {
    display: flex;
    align-items: center;
    flex-grow: 1;
}

.${CSS_CLASS_N2TREELIST.DRAG_IMAGE} {
    position: absolute;
    top: -1000px;
    left: -1000px;
    padding: 8px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    z-index: 1000;
    font-size: 12px;
}
.${CSS_CLASS_N2TREELIST.EXPAND_ICON}  { 
   cursor: pointer;
    margin-right: 5px;
    scale: 120%;
}
.${CSS_CLASS_N2TREELIST.DROP_INDICATOR} {
    position: absolute;
    left:0;
    right:0;
    height: 2px;
    background-color: var(--app-color-blue-01);
    width: 100%;
    z-index: 1;
    pointer-events: none;
}

.${CSS_CLASS_N2TREELIST.DROP_INDICATOR_TOP} {
top: 0;
}
.${CSS_CLASS_N2TREELIST.DROP_INDICATOR_BOTTOM} {
bottom: 0;
}

.${CSS_CLASS_N2TREELIST.CHECKBOX} {
  margin-right: 5px;
}    
   `, 'N2TreeList'
        ); // cssAdd
    } catch (e) {
        console.error(e);
    }

    cssLoaded = true;

} // loadCSS


import {isString, toString} from "lodash";
import {htmlToElement} from "../../BaseUtils";
import {cssAdd} from "../../CssUtils";
import {N2Evt_DomAdded, N2Evt_OnHtml} from "../N2";
import {N2Basic, StateN2Basic, StateN2BasicRef} from "../N2Basic";
import {addN2Class} from "../N2HtmlDecorator";
import {createN2HtmlBasic} from "../N2Utils";
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


// -------------------- Internal State Interface --------------------
interface InternalStateN2TreeList<RECORD_TYPE = any> {
    _selectedNodes?: Set<string>;
    cachedNodesRange?: number;
    data_source?: 'array' | 'function';
    data_load_success?: boolean;
}