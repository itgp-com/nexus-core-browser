import {Grid} from '@syncfusion/ej2-grids';
import {getOffsetHeight, getOffsetWidth} from '../BaseUtils';
import {getGridDecoratorsHeight} from '../gui2/ej2/Ej2Utils';

export function resizeGrid(grid:Grid, parentElem ?: HTMLElement) {
    try {
        if (!grid)
            return;

        resizeGridHeight(grid, parentElem);
        resizeGridWidth(grid, parentElem);

    } catch (e) { console.error(e); }
} // resizeGrid

export function resizeGridHeight(grid: Grid, parentElem ?: HTMLElement) {
    if ( !grid)
        return;

    let previousGridHeight = grid.height;
    let newGridHeight = calculateGridHeight(grid, parentElem);
    if (newGridHeight >= 0 && newGridHeight != previousGridHeight) {
        grid.height = newGridHeight;
    }
} // resizeGridHeight

export function resizeGridWidth(grid: Grid, parentElem ?: HTMLElement) {
    if ( !grid)
        return;

    let newWidth = calculateGridWidth(grid, parentElem);
    if (newWidth >= 0 && newWidth != grid.width) {
        grid.width = newWidth;
    }
} // resizeGridWidth


export function calculateGridHeight(grid:Grid, parentElem ?: HTMLElement): number {
    if (!grid)
        return -1;

    let gridDecoratorsHeight: number = getGridDecoratorsHeight(grid);

    if ( !parentElem)
        parentElem = grid.element?.parentElement;
    if (!parentElem)
        return -1;

    try {
        let totalHeight = getOffsetHeight(parentElem);

        // the grid has extra height that we need to subtract between offset and client somewhere
        let gridElementClientHeight = grid.element.clientHeight; // inside height element stretches
        let gridElementOffsetHeight = grid.element.offsetHeight; // outside height element stretches
        let gridExtraHeight = gridElementOffsetHeight - gridElementClientHeight;
        if (gridExtraHeight < 0)
            gridExtraHeight = 0;

        return totalHeight - gridDecoratorsHeight - gridExtraHeight - 5; // 5pixels appear to be added somewhere when the grid is filtered and the filter is shown in the paging bottom
    } catch (e) { console.error(e); }
    return -1;
} // calculateGridHeight

export function calculateGridWidth(grid:Grid, parentElem ?: HTMLElement): number {

    if (!grid)
        return -1;

    if ( !parentElem)
        parentElem = grid.element?.parentElement;
    if ( !parentElem)
        return -1;

    try {

        let innerWidth = getOffsetWidth(parentElem);

        // noinspection ES6ConvertLetToConst,UnnecessaryLocalVariableJS
        let gridWidth: number = (innerWidth > 1 ? innerWidth - 1 : innerWidth);
        return gridWidth;
    } catch (e) { console.error(e); }
    return -1;
} // calculateGridWidth