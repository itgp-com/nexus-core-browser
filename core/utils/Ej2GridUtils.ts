
/**
 * Resizes both the height and width of the grid based on its parent element.
 *
 * This function adjusts the grid's dimensions by invoking separate functions
 * to resize its height and width. It first checks if the `grid` is valid.
 * If an error occurs during the resizing process, it logs the error to the console.
 *
 * @param {Grid} grid - The grid object to be resized.
 *        The dimensions of this grid will be adjusted.
 * @param {HTMLElement} [parentElem] - An optional parent element used to calculate the grid's dimensions.
 *        If provided, this element is used as the reference for resizing the grid.
 *
 * @returns {void} This function does not return any value.
 *
 * @throws {Error} Logs an error to the console if any exception occurs during the resizing process.
 *
 * @example
 * resizeGrid(grid, document.getElementById('parentElement'));
 */
export function resizeGrid(grid: Grid, parentElem ?: HTMLElement): void {
    try {
        if (!grid)
            return;

        resizeGridHeight(grid, parentElem);
        resizeGridWidth(grid, parentElem);

    } catch (e) { console.error(e); }
} // resizeGrid

/**
 * Resizes the height of the grid based on its parent element or a provided height.
 *
 * This function calculates the new height of the grid and updates the grid's height
 * property if the new height is valid and different from the previous height.
 * It first checks if the `grid` is valid.
 *
 * @param {Grid} grid - The grid object whose height is to be resized.
 *        The height of this grid will be adjusted based on the calculated height.
 * @param {HTMLElement} [parentElem] - An optional parent element used to calculate the grid's height.
 *        If provided, this element is used as the reference for resizing the grid's height.
 *
 * @returns {void} This function does not return any value.
 *
 * @example
 * resizeGridHeight(grid, document.getElementById('parentElement'));
 */
export function resizeGridHeight(grid: Grid, parentElem ?: HTMLElement): void {
    if (!grid)
        return;

    let previousGridHeight = grid.height;
    let newGridHeight = calculateGridHeight(grid, parentElem);
    if (newGridHeight >= 0 && newGridHeight != previousGridHeight) {
        grid.height = newGridHeight;
    }
} // resizeGridHeight


/**
 * Resizes the width of the grid based on its parent element or a provided width.
 *
 * This function calculates the new width of the grid and updates the grid's width
 * property if the new width is valid and different from the previous width.
 * It first checks if the `grid` is valid.
 *
 * @param {Grid} grid - The grid object whose width is to be resized.
 *        The width of this grid will be adjusted based on the calculated width.
 * @param {HTMLElement | number} [elem_or_height] - An optional element or number used to calculate the grid's width.
 *        If an element is provided, its offset width is used. If a number is provided, it is used directly as the width.
 *
 * @returns {void} This function does not return any value.
 *
 * @example
 * resizeGridWidth(grid, document.getElementById('parentElement'));
 * resizeGridWidth(grid, 500);
 */
export function resizeGridWidth(grid: Grid, elem_or_height ?: HTMLElement | number) :void {
    if (!grid)
        return;

    let newWidth = calculateGridWidth(grid, elem_or_height);
    if (newWidth >= 0 && newWidth != grid.width) {
        grid.width = newWidth;
    }
} // resizeGridWidth

/**
 * Calculates the height for a grid based on a provided HTML element or a specific height value.
 *
 * This function computes the height of a grid by first determining the `totalHeight` either
 * from an HTML element's offset height or from a provided numeric value. It then subtracts
 * any additional grid-related height (like decorators and extra margins) to determine the
 * final grid height. If no valid height is found, it returns -1.
 *
 * @param {Grid} grid - The grid object for which the height is being calculated.
 *        The grid's parent element may be used to determine the height if no specific element or value is provided.
 * @param {HTMLElement | number} [elem_or_height] - An optional element or number representing the height.
 *        If an element is provided, its offset height will be used to calculate the grid height.
 *        If a number is provided, it will be directly used as the height.
 *
 * @returns {number} The calculated height of the grid. If the height could not be determined, returns -1.
 *
 * @throws {Error} Logs an error to the console if any exception occurs during the calculation process.
 *
 * @example
 * const gridHeight = calculateGridHeight(grid, document.getElementById('someElement'));
 * console.log(gridHeight); // Outputs the calculated height based on the element's offset height.
 *
 * @example
 * const gridHeight = calculateGridHeight(grid, 500);
 * console.log(gridHeight); // Outputs the calculated grid height after subtracting decorators and extra margins.
 */
export function calculateGridHeight(grid: Grid, elem_or_height ?: HTMLElement | number): number {
    let totalHeight: number = -1;

    if (grid) {
        try {
            let eh: HTMLElement | number = elem_or_height;

            if (!eh)
                eh = grid.element?.parentElement;


            if (isNumber(eh)) {
                totalHeight = eh as number;
            } else if (eh instanceof HTMLElement) {
                totalHeight = getOffsetHeight(eh as HTMLElement);
            }


            let gridDecoratorsHeight: number = getGridDecoratorsHeight(grid);

            // the grid has extra height that we need to subtract between offset and client somewhere
            let gridElementClientHeight = grid.element.clientHeight; // inside height element stretches
            let gridElementOffsetHeight = grid.element.offsetHeight; // outside height element stretches
            let gridExtraHeight = gridElementOffsetHeight - gridElementClientHeight;
            if (gridExtraHeight < 0)
                gridExtraHeight = 0;

            totalHeight = totalHeight - gridDecoratorsHeight - gridExtraHeight - 5; // 5pixels appear to be added somewhere when the grid is filtered and the filter is shown in the paging bottom
            if (totalHeight < 0)
                totalHeight = 0;
        } catch (e) { console.error(e); }
    } // if grid
    return totalHeight;
} // calculateGridHeight


/**
 * Calculates the width for a grid based on a provided HTML element or a specific width value.
 *
 * This function calculates the width of a grid by first determining the `innerWidth` either
 * from an HTML element's offset width or from a provided numeric value. If a valid width is
 * found, it subtracts 1 pixel (if greater than 1) and returns the adjusted width. If no valid
 * width is found, it returns -1.
 *
 * @param {Grid} grid - The grid object for which the width is being calculated.
 *        The grid's parent element may be used to determine the width if no specific element or value is provided.
 * @param {HTMLElement | number} [elem_or_height] - An optional element or number representing the height.
 *        If an element is provided, its offset width will be used to calculate the grid width.
 *        If a number is provided, it will be directly used as the width.
 *
 * @returns {number} The calculated width of the grid. If the width could not be determined, returns -1.
 *
 * @throws {Error} Logs an error to the console if any exception occurs during the calculation process.
 *
 * @example
 * const gridWidth = calculateGridWidth(grid, document.getElementById('someElement'));
 * console.log(gridWidth); // Outputs the calculated width based on the element's offset width.
 *
 * @example
 * const gridWidth = calculateGridWidth(grid, 500);
 * console.log(gridWidth); // Outputs 499, as 1 pixel is subtracted from the provided width.
 */
export function calculateGridWidth(grid: Grid, elem_or_height ?: HTMLElement | number): number {

    let innerWidth: number = -1;

    if (grid) {


        try {
            let eh: HTMLElement | number = elem_or_height;

            if (!eh)
                eh = grid.element?.parentElement;

            if (isNumber(eh)) {
                innerWidth = eh as number;
            } else if (eh instanceof HTMLElement) {
                innerWidth = getOffsetWidth(eh as HTMLElement);
            }

            if (innerWidth >= 0) {

                // noinspection ES6ConvertLetToConst,UnnecessaryLocalVariableJS
                let gridWidth: number = (innerWidth > 1 ? innerWidth - 1 : innerWidth);
                return gridWidth;
            }
            // try
        } catch (e) { console.error(e); }
    } // if grid
    return innerWidth;
} // calculateGridWidth

import {Grid} from '@syncfusion/ej2-grids';
import {isNumber} from 'lodash';
import {getOffsetHeight, getOffsetWidth} from '../BaseUtils';
import {getGridDecoratorsHeight} from '../gui2/ej2/Ej2Utils';