import {Grid} from '@syncfusion/ej2-grids';
import {CSS_FLEX_MAX_XY} from '../../../CoreCSS';
import {EnumPanelLayout, N2PanelLayoutFlex, StateN2PanelLayoutFlex} from '../../generic/N2PanelLayoutFlex';
import {N2Evt_Resized} from '../../N2';
import {addN2Class} from '../../N2HtmlDecorator';
import {getGridDecoratorsHeight} from '../Ej2Utils';
import {N2Grid, StateN2Grid} from '../ext/N2Grid';

export type Elem_or_N2EjGrid<STATE extends StateN2Grid = any> = HTMLElement | N2Grid<STATE>; // compatible with  Elem_or_N2

export interface StateN2PanelGridFlex<STATE extends StateN2Grid = StateN2Grid> extends StateN2PanelLayoutFlex {

    /**
     * This is where the Grid component or wrapper.
     */
    center?: Elem_or_N2EjGrid

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
export class N2PanelGridFlex<GRID_TYPE extends N2Grid = N2Grid, STATE extends StateN2PanelGridFlex = StateN2PanelGridFlex> extends N2PanelLayoutFlex<STATE> {
    static readonly CLASS_IDENTIFIER:string = 'N2PanelGridFlex'
    n2Grid: GRID_TYPE;

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, CSS_FLEX_MAX_XY, N2PanelGridFlex.CLASS_IDENTIFIER);

        if (state.resizeTracked == null)
            state.resizeTracked = true; // enable resize tracking by default

        if (state.gridAutoHeight == null)
            state.gridAutoHeight = true; // enable auto height by default

        if (state.gridAutoWidth == null)
            state.gridAutoWidth = true; // enable auto width by default

        super.onStateInitialized(state);
    }

    get classIdentifier() {
        return N2PanelGridFlex.CLASS_IDENTIFIER;
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
    onResized(evt?: N2Evt_Resized): void {
        super.onResized(evt);

        if (this.n2Grid) {
            let state = this.state;
            let grid: Grid = this.n2Grid.obj;

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
    }

    protected calculateGridHeight(): number {
        if (!this.n2Grid)
            return 0;
        let grid: Grid = this.n2Grid.obj;
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

        if (!this.n2Grid)
            return 0;
        let grid: Grid = this.n2Grid.obj;
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