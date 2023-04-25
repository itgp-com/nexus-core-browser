import {Grid} from "@syncfusion/ej2-grids";
import {CSS_FLEX_MAX_XY} from "../../../CoreCSS";
import {EnumPanelLayout, Nx2PanelLayoutFlex, StateNx2PanelLayoutFlex} from "../../generic/Nx2PanelLayoutFlex";
import {Nx2Evt_Resized} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {getGridDecoratorsHeight} from "../Ej2Utils";
import {Nx2EjGrid, StateNx2EjGrid} from "../ext/Nx2EjGrid";

export type Elem_or_Nx2EjGrid<STATE extends StateNx2EjGrid = any> = HTMLElement | Nx2EjGrid<STATE>; // compatible with  Elem_or_Nx2

export interface StateNx2EjPanelGrid<STATE extends StateNx2EjGrid = StateNx2EjGrid> extends StateNx2PanelLayoutFlex {

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
export class Nx2EjPanelGrid<GRID_TYPE extends Nx2EjGrid = Nx2EjGrid, STATE extends StateNx2EjPanelGrid = StateNx2EjPanelGrid> extends Nx2PanelLayoutFlex<STATE> {

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
        switch (position) {
            case EnumPanelLayout.center:

                if (state.center instanceof HTMLElement) {
                    elem = state.center as HTMLElement;
                } else {
                    let center = state.center;
                    if ( center instanceof HTMLElement) {
                        elem = center;
                    } else {
                        elem = center.htmlElement;
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

        let _outerTopHtml :HTMLElement = (this.outerTop ? (this.outerTop instanceof HTMLElement ? this.outerTop : this.outerTop.htmlElement) : null);
        let outerTopHeight = (_outerTopHtml ? _outerTopHtml.offsetHeight : 0);

        let _outerBottomHtml :HTMLElement = (this.outerBottom ? (this.outerBottom instanceof HTMLElement ? this.outerBottom : this.outerBottom.htmlElement) : null);
        let outerBottomHeight = (_outerBottomHtml? _outerBottomHtml.offsetHeight : 0);


        let _topHtml :HTMLElement = (this.top ? (this.top instanceof HTMLElement ? this.top : this.top.htmlElement) : null);
        let topHeight = (_topHtml? _topHtml.offsetHeight : 0);


        let _bottomHtml :HTMLElement = (this.bottom ? (this.bottom instanceof HTMLElement ? this.bottom : this.bottom.htmlElement) : null);
        let bottomHeight = (_bottomHtml ? _bottomHtml.offsetHeight : 0);

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

        let leftHeight = (this._leftElem ? this._leftElem.offsetWidth : 0);
        let rightHeight = (this._rightElem ? this._rightElem.offsetWidth : 0);
        let surroundingLeftRightHeight = leftHeight + rightHeight;

        let totalWidth: number = this.htmlElement.clientWidth;
        let gridWidth: number = totalWidth - surroundingLeftRightHeight;
        return gridWidth;

    }

}