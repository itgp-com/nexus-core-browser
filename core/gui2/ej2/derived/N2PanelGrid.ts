import {Grid, GridModel} from '@syncfusion/ej2-grids';
import {CSS_FLEX_MAX_XY} from '../../scss/core';
import {N2PanelLayout, StateN2PanelLayout} from '../../generic/N2PanelLayout';
import {EnumPanelLayout} from '../../generic/N2PanelLayoutFlex';
import {N2Evt_Resized} from '../../N2';
import {addN2Class} from '../../N2HtmlDecorator';
import {getGridDecoratorsHeight} from '../Ej2Utils';
import {N2Grid, StateN2Grid} from '../ext/N2Grid';

export type Elem_or_N2EjGrid<STATE extends StateN2Grid = any> = HTMLElement | N2Grid<STATE>; // compatible with  Elem_or_N2

export interface StateN2PanelGrid<STATE extends StateN2Grid = StateN2Grid> extends StateN2PanelLayout {

    /**
     * This is where the Grid component or wrapper.
     */
    center?: Elem_or_N2EjGrid<STATE>

    /**
     * Defaults to true if not specified.
     * If true, the grid will automatically resize to fit the height of the resized panel.
     */
    gridAutoHeight?: boolean;

    /**
     * Defaults to true if not specified.
     * If true, the grid will automatically resize to fit the width of the resized panel.
     */
    gridAutoWidth?: boolean;

}

/**
 * Specializes {@link N2PanelLayoutFlex} to use a Grid component as the centerContainer.
 */
export class N2PanelGrid<GRID_TYPE extends N2Grid = N2Grid, STATE extends StateN2PanelGrid = StateN2PanelGrid> extends N2PanelLayout<STATE> {
    static readonly CLASS_IDENTIFIER:string = 'N2PanelGrid'
    private _n2Grid: GRID_TYPE;

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, CSS_FLEX_MAX_XY, N2PanelGrid.CLASS_IDENTIFIER);

        if (state.resizeTracked == null)
            state.resizeTracked = true; // enable resize tracking by default

        if (state.gridAutoHeight == null)
            state.gridAutoHeight = true; // enable auto height by default

        if (state.gridAutoWidth == null)
            state.gridAutoWidth = true; // enable auto width by default

        if ( state.center && state.center instanceof N2Grid) {
            this.n2Grid = state.center as GRID_TYPE;
        }

        super.onStateInitialized(state);
    }

    get classIdentifier() {
        return N2PanelGrid.CLASS_IDENTIFIER;
    }

    /**
     * Override this method to create a different type of grid.
     * By default it only handles the grid in the centerContainer component type
     * @param position
     */
    stateToHTMLElement(position: EnumPanelLayout): HTMLElement {
        let state = this.state;
        let elem: HTMLElement;
        // noinspection JSUnreachableSwitchBranches
        switch (position) {
            case EnumPanelLayout.center:

                if (state.center instanceof HTMLElement) {
                    elem = state.center as HTMLElement;
                } else {
                    let grid = state.center;
                    if (grid instanceof HTMLElement) {
                        elem = grid;
                    } else {
                        elem = grid.htmlElement;
                    }
                }
                break
        }
        return elem;
    }


    /**
     *
     * @param evt
     */
    onResized(evt?: N2Evt_Resized): void {
        super.onResized(evt);

        try {
            this.resizeAllowed = false; // disable resize events while we are resizing the grid
            if (this._n2Grid) {
                let state = this.state;
                let grid: Grid = this._n2Grid.obj;

                if (state.gridAutoHeight) {

                    let previousGridHeight = grid.height;
                    let newGridHeight = this.calculateGridHeight();
                    if (newGridHeight > 0 && newGridHeight != previousGridHeight) {
                        grid.height = newGridHeight;
                    }
                } // if (state.gridAutoHeight)

                if (state.gridAutoWidth) {
                    let newWidth = this.calculateGridWidth();
                    if (newWidth > 0 && newWidth != grid.width) {
                        grid.width = newWidth;
                    }
                }
            } // if (this.n2Grid)
        } finally {
            setTimeout(() => {
                this.resizeAllowed = true;
            }, this.resizeEventMinInterval + 50); // restore this after the last debounce could have fired
        }
    }

    protected calculateGridHeight(): number {
        if (!this._n2Grid)
            return 0;
        let grid: Grid = this._n2Grid.obj;
        if (!grid)
            return 0;

        let gridDecoratorsHeight: number = getGridDecoratorsHeight(grid);

        let totalHeight = this.centerContainer.htmlElement.offsetHeight;


        // the grid has this extra height that we need to subtract between offset and client somewhere
        let gridElementClientHeight = grid.element.clientHeight; // inside height this element stretches
        let gridElementOffsetHeight = grid.element.offsetHeight; // outside height this element stretches
        let gridExtraHeight = gridElementOffsetHeight - gridElementClientHeight;
        if (gridExtraHeight < 0)
            gridExtraHeight = 0;

        return totalHeight -  gridDecoratorsHeight - gridExtraHeight  -5; // 5pixels appear to be added somewhere when the grid is filtered and the filter is shown in the paging bottom
    }

    protected calculateGridWidth(): number {

        if (!this._n2Grid)
            return 0;
        let grid: Grid = this._n2Grid.obj;
        if (!grid)
            return 0;

        let totalWidth: number = this.centerContainer.htmlElement.offsetWidth;

        let gridWidth: number = totalWidth - 1;
        return gridWidth;
    }


    public get n2Grid(): GRID_TYPE {
        return this._n2Grid;
    }

    public set n2Grid(n2Grid: GRID_TYPE) {


        // Trigger resize event on actionComplete of the grid
        let gridState:StateN2Grid = n2Grid.state;
        let gridModel:GridModel = gridState.ej;
        if(!gridModel)
            gridModel = gridState.ej = {};

        let userActionComplete = gridModel.actionComplete;
        gridModel.actionComplete = (args) => {
            try {
                if (userActionComplete)
                    userActionComplete(args);
            } finally {
                // regardless of the output
                this.onResized();
            }
        } // gridModel.actionComplete

        this._n2Grid = n2Grid;
    }
}