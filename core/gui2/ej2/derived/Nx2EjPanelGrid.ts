import {Grid, GridModel} from "@syncfusion/ej2-grids";
import {CSS_FLEX_MAX_XY} from "../../../CoreCSS";
import {Nx2PanelLayout, StateNx2PanelLayout} from '../../generic/Nx2PanelLayout';
import {EnumPanelLayout} from "../../generic/Nx2PanelLayoutFlex";
import {Nx2Evt_Resized} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {getGridDecoratorsHeight} from "../Ej2Utils";
import {Nx2EjGrid, StateNx2EjGrid} from "../ext/Nx2EjGrid";

export type Elem_or_Nx2EjGrid<STATE extends StateNx2EjGrid = any> = HTMLElement | Nx2EjGrid<STATE>; // compatible with  Elem_or_Nx2

export interface StateNx2EjPanelGrid<STATE extends StateNx2EjGrid = StateNx2EjGrid> extends StateNx2PanelLayout {

    /**
     * This is where the Grid component or wrapper.
     */
    center?: Elem_or_Nx2EjGrid

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
 * Specializes {@link Nx2PanelLayoutFlex} to use a Grid component as the centerContainer.
 */
export class Nx2EjPanelGrid<GRID_TYPE extends Nx2EjGrid = Nx2EjGrid, STATE extends StateNx2EjPanelGrid = StateNx2EjPanelGrid> extends Nx2PanelLayout<STATE> {

    nx2Grid: GRID_TYPE;

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addNx2Class(state.deco, [CSS_FLEX_MAX_XY, 'Nx2EjPanelGrid']);

        if (state.resizeTracked == null)
            state.resizeTracked = true; // enable resize tracking by default

        if (state.gridAutoHeight == null)
            state.gridAutoHeight = true; // enable auto height by default

        if (state.gridAutoWidth == null)
            state.gridAutoWidth = true; // enable auto width by default


        // Trigger resize event on actionComplete of the grid
        if (state.center != null && state.center instanceof Nx2EjGrid) {
            let n2Grid:Nx2EjGrid = state.center as Nx2EjGrid;
            let gridState:StateNx2EjGrid = n2Grid.state;
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
        } // if (state.center != null && state.center instanceof Nx2EjGrid)

        super.onStateInitialized(state);
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
    onResized(evt?: Nx2Evt_Resized): void {
        super.onResized(evt);

        try {
            this.resizeAllowed = false; // disable resize events while we are resizing the grid
            if (this.nx2Grid) {
                let state = this.state;
                let grid: Grid = this.nx2Grid.obj;

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
            } // if (this.nx2Grid)
        } finally {
            setTimeout(() => {
                this.resizeAllowed = true;
            }, this.resizeEventMinInterval + 50); // restore this after the last debounce could have fired
        }
    }

    protected calculateGridHeight(): number {
        if (!this.nx2Grid)
            return 0;
        let grid: Grid = this.nx2Grid.obj;
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

        if (!this.nx2Grid)
            return 0;
        let grid: Grid = this.nx2Grid.obj;
        if (!grid)
            return 0;

        let totalWidth: number = this.centerContainer.htmlElement.offsetWidth;

        let gridWidth: number = totalWidth - 1;
        return gridWidth;
    }

}