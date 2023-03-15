import {EnumPanelLayout, Nx2PanelLayout, StateNx2PanelLayout} from "../../generic/Nx2PanelLayout";
import {Elem_or_Nx2_or_StateNx2} from "../../Nx2Utils";
import {Nx2EjGrid, StateNx2EjGrid} from "../ext/Nx2EjGrid";
import {CSS_FLEX_MAX_XY} from "../../../CoreCSS";
import {Nx2Evt_Resized} from "../../Nx2";
import {Grid} from "@syncfusion/ej2-grids";
import {getGridDecoratorsHeight} from "../Ej2Utils";


export interface StateNx2EjPanelGrid<STATE extends StateNx2EjGrid = StateNx2EjGrid> extends StateNx2PanelLayout {

    /**
     * This is where the Grid component or wrapper.
     */
    center?: Elem_or_Nx2_or_StateNx2<STATE>;

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
 * Specializes {@link Nx2PanelLayout} to use a Grid component as the center.
 */
export class Nx2EjPanelGrid<GRID_TYPE extends Nx2EjGrid = Nx2EjGrid, STATE extends StateNx2EjPanelGrid = StateNx2EjPanelGrid> extends Nx2PanelLayout<STATE> {

    nx2Grid: GRID_TYPE;

    constructor(state: STATE) {
        super(state);
    }

    protected _initialState(state: STATE) {
        state.deco.classes.push(CSS_FLEX_MAX_XY, this.className)

        if (state.resizeTracked == null)
            state.resizeTracked = true; // enable resize tracking by default

        if (state.gridAutoHeight == null)
            state.gridAutoHeight = true; // enable auto height by default

        if (state.gridAutoWidth == null)
            state.gridAutoWidth = true; // enable auto width by default

        super._initialState(state);
    }


    /**
     * Override this method to create a different type of grid.
     * By default it only handles the grid in the center component type
     * @param position
     */
    stateToHTMLElement(position: EnumPanelLayout): HTMLElement {
        let state = this.state;
        let elem: HTMLElement;
        switch (position) {
            case EnumPanelLayout.center:

                if (state.center instanceof HTMLElement) {
                    elem = state.center as HTMLElement;
                } else {
                    let gridState: StateNx2EjGrid = state.center; // has to be StateNx2EjGrid because of the STATE generic
                    let grid = this.createGrid(gridState);
                    grid.initLogic();
                    elem = grid.htmlElement;
                }
                break
        }
        return elem;
    }

    /**
     * Override this method to create a different type of grid.
     * @param gridState
     */
    createGrid(gridState: StateNx2EjGrid): GRID_TYPE {
        if (!this.nx2Grid)
            this.nx2Grid = new Nx2EjGrid(gridState) as GRID_TYPE;
        return this.nx2Grid;
    }


    /**
     *
     * @param evt
     */
    onResized(evt?: Nx2Evt_Resized): void {
        super.onResized(evt);

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
    }

    protected calculateGridHeight(): number {
        if (!this.nx2Grid)
            return 0;
        let grid: Grid = this.nx2Grid.obj;
        if (!grid)
            return 0;
        let state = this.state;

        let gridDecoratorsHeight: number = getGridDecoratorsHeight(grid);

        let totalHeight = this.htmlElement.clientHeight;

        let outerTopHeight = (this.outerTopElem ? this.outerTopElem.offsetHeight : 0);
        let outerBottomHeight = (this.outerBottomElem ? this.outerBottomElem.offsetHeight : 0);
        let topHeight = (this.topElem ? this.topElem.offsetHeight : 0);
        let bottomHeight = (this.bottomElem ? this.bottomElem.offsetHeight : 0);

        let surroundingTopBottomHeight = outerTopHeight + outerBottomHeight + topHeight + bottomHeight;



        // the grid has this extra height that we need to subtract between offset and client somewhere
        let gridElementClientHeight = grid.element.clientHeight; // inside height this element stretches
        let gridElementOffsetHeight = grid.element.offsetHeight; // outside height this element stretches
        let gridExtraHeight = gridElementOffsetHeight - gridElementClientHeight;
        if (gridExtraHeight < 0)
            gridExtraHeight = 0;

        return totalHeight - surroundingTopBottomHeight - gridDecoratorsHeight - gridExtraHeight;
    }

    protected calculateGridWidth(): number {

        if (!this.nx2Grid)
            return 0;
        let grid: Grid = this.nx2Grid.obj;
        if (!grid)
            return 0;

        let leftHeight = (this.leftElem ? this.leftElem.offsetWidth : 0);
        let rightHeight = (this.rightElem ? this.rightElem.offsetWidth : 0);
        let surroundingLeftRightHeight = leftHeight + rightHeight;

        let totalWidth: number = this.htmlElement.clientWidth;
        let gridWidth: number = totalWidth - surroundingLeftRightHeight;
        return gridWidth;

    }

}