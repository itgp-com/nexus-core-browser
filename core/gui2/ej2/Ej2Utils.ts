import {AbstractGrid, gridDecoratorsHeight} from "../../gui/ej2/abstract/AbstractGrid";
import {Grid} from "@syncfusion/ej2-grids";


/**
 * Calculate the total height of all the padding that the heading, filters and bottom paging controls take in a grid
 * @param wgtGrid
 */
export function getGridDecoratorsHeight(grid : Grid): number {
    let gridDecoratorHeightVal: number = 0;

    let gridElem = grid.element;
    if (gridElem) {

        let toolbarArray = gridElem.getElementsByClassName('e-toolbar');
        if (toolbarArray.length > 0) {
            let toolBar:HTMLElement  = toolbarArray[0] as any
            if (toolBar) {
                gridDecoratorHeightVal += toolBar.offsetHeight;
            }
        } // if toolbarArray

        let gridHeaderArray = gridElem.getElementsByClassName('e-gridheader');
        if (gridHeaderArray.length > 0) {
            let gridHeader:HTMLElement  = gridHeaderArray[0] as any;
            if (gridHeader) {
                gridDecoratorHeightVal += gridHeader.offsetHeight;
            }
        } //  if gridHeaderArray

        let gridPagerArray = gridElem.getElementsByClassName('e-gridpager');
        if (gridPagerArray.length > 0) {
            let gridPager:HTMLElement = gridPagerArray[0] as any;
            if (gridPager) {
                gridDecoratorHeightVal += gridPager.offsetHeight;
            }
        } // if gridPagerArray

        let gridGroupingArray = gridElem.getElementsByClassName('e-groupdroparea');
        if ( gridGroupingArray.length > 0 ) {
            let gridGrouping:HTMLElement = gridGroupingArray[0] as any;
            if ( gridGrouping ) {
                gridDecoratorHeightVal += gridGrouping.offsetHeight
            }
        } // if gridGroupingArray

    } // if gridElem
    return gridDecoratorHeightVal;
} // gridDecoratorsHeight