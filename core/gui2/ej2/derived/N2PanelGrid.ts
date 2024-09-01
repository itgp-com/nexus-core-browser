import {Grid} from '@syncfusion/ej2-grids';
import {throttle} from 'lodash';
import {resizeGridHeight, resizeGridWidth} from '../../../utils/Ej2GridUtils';
import {EnumPanelLayout, N2PanelLayout, StateN2PanelLayout} from '../../generic/N2PanelLayout';
import {N2Evt_Resized} from '../../N2';
import {addN2Class} from '../../N2HtmlDecorator';
import {CSS_FLEX_MAX_XY} from '../../scss/core';
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
    static readonly CLASS_IDENTIFIER: string = 'N2PanelGrid'
    private _n2Grid: GRID_TYPE;

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        let thisX = this;
        addN2Class(state.deco, CSS_FLEX_MAX_XY, N2PanelGrid.CLASS_IDENTIFIER);

        if (state.resizeTracked == null)
            state.resizeTracked = true; // enable resize tracking by default


        // Change the state of the center panel to track resize events and call the onGridContainerResized method
        let f_throttled_onGridContainerResized = throttle(
            (evt?: N2Evt_Resized) => {
                thisX.onGridContainerResized.call(thisX, evt);
            },
            thisX.resizeEventMinInterval,
            {
                leading: false, // Prevent the function from being called immediately
                trailing: true // Ensure the function is called 100ms after the last call
            }
        );

        let stateCenter = state.stateCenterContainer || {};
        if (stateCenter.resizeTracked == null)
            stateCenter.resizeTracked = true; // enable resize tracking by default, but don't override if already set

        let existingOnResized = stateCenter.onResized;
        stateCenter.onResized = (evt?: N2Evt_Resized) => {
            f_throttled_onGridContainerResized.call(thisX, evt);
            try {
                if (existingOnResized)
                    existingOnResized.call(thisX, evt);
            } catch (e) { console.error(e); }
        }
        state.stateCenterContainer = stateCenter; // assign in case it was just created

        if (state.gridAutoHeight == null)
            state.gridAutoHeight = true; // enable auto height by default

        if (state.gridAutoWidth == null)
            state.gridAutoWidth = true; // enable auto width by default

        if (state.center && state.center instanceof N2Grid) {
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
     * Handles resize events, adjusting the grid dimensions when the component is resized,
     * and ensures that resize events are temporarily disabled during the resizing process
     * to prevent redundant operations.
     *
     * This method overrides the `onResized` method from the parent class. It first checks
     * if the resize event indicates a meaningful change in size (either in width or height).
     * If so, it temporarily disables further resize events and adjusts the grid's height
     * and width based on the current state configuration (`gridAutoHeight` and `gridAutoWidth`).
     * Finally, it re-enables resize events after a short delay.
     *
     * @param {N2Evt_Resized} [evt] - An optional event object that provides information about the resize event.
     *        This object includes details such as the difference in height and width (`height_diff` and `width_diff`)
     *        and whether the last size was empty (`lastSizeEmpty`).
     *
     * @returns {void} This method does not return any value.
     *
     * @throws {Error} If any error occurs during the resizing process, it is caught and handled within the method.
     *        The resize events are still re-enabled even if an error occurs.
     *
     * @example
     * // Example of overriding the onResized method in a subclass
     * class CustomComponent extends BaseComponent {
     *     onResized(evt?: N2Evt_Resized): void {
     *         super.onResized(evt);
     *         // Additional custom resize handling logic
     *     }
     * }
     *
     * @see N2Evt_Resized - The event interface for resize events.
     */
    protected lastTimeCalled: Date;
    onGridContainerResized(evt?: N2Evt_Resized): void {
        super.onResized(evt);

        if (evt.height_diff != 0 || evt.width_diff != 0) {

            // log event and also keep track and log the time elapsed since last call here (using this.lastTimeCalled)
            let now = new Date();
            let lastTimeCalled = this.lastTimeCalled;
            let timeDiff = lastTimeCalled ? now.getTime() - lastTimeCalled.getTime() : 'n/a';
            this.lastTimeCalled = now;
            console.log('N2PanelGrid: onGridContainerResized: evt:', evt, 'timeDiff:', timeDiff);

            this.resizeGrid.call( this );
        } // if ( !evt.lastSizeEmpty && (evt.height_diff != 0 || evt.width_diff != 0) )
    } // onResized

    resizeGrid() {
        try {
            this.resizeAllowed = false; // disable resize events while we are resizing the grid
            if (this._n2Grid) {
                let state = this.state;
                let grid: Grid = this._n2Grid.obj;

                if (state.gridAutoHeight)
                    resizeGridHeight(grid);

                if (state.gridAutoWidth)
                    resizeGridWidth(grid);
            } // if (this.n2Grid)
        } finally {
            setTimeout(() => {
                this.resizeAllowed = true;
            }, this.resizeEventMinInterval + 50); // restore this after the last debounce could have fired
        }

    } // resizeGrid


    public get n2Grid(): GRID_TYPE {
        return this._n2Grid;
    }

    public set n2Grid(n2Grid: GRID_TYPE) {
        this._n2Grid = n2Grid;
    }
} // N2PanelGrid