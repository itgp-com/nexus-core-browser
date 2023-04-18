import {Grid} from "@syncfusion/ej2-grids";
import {Nx2} from '../Nx2';
import {isNx2} from '../Nx2Utils';


/**
 * Calculate the total height of all the padding that the heading, filters and bottom paging controls take in a grid
 * @param wgtGrid
 */
export function getGridDecoratorsHeight(grid: Grid): number {
    let gridDecoratorHeightVal: number = 0;

    let gridElem = grid.element;
    if (gridElem) {

        let toolbarArray = gridElem.getElementsByClassName('e-toolbar');
        if (toolbarArray.length > 0) {
            let toolBar: HTMLElement = toolbarArray[0] as any
            if (toolBar) {
                gridDecoratorHeightVal += toolBar.offsetHeight;
            }
        } // if toolbarArray

        let gridHeaderArray = gridElem.getElementsByClassName('e-gridheader');
        if (gridHeaderArray.length > 0) {
            let gridHeader: HTMLElement = gridHeaderArray[0] as any;
            if (gridHeader) {
                gridDecoratorHeightVal += gridHeader.offsetHeight;
            }
        } //  if gridHeaderArray

        let gridPagerArray = gridElem.getElementsByClassName('e-gridpager');
        if (gridPagerArray.length > 0) {
            let gridPager: HTMLElement = gridPagerArray[0] as any;
            if (gridPager) {
                gridDecoratorHeightVal += gridPager.offsetHeight;
            }
        } // if gridPagerArray

        let gridGroupingArray = gridElem.getElementsByClassName('e-groupdroparea');
        if (gridGroupingArray.length > 0) {
            let gridGrouping: HTMLElement = gridGroupingArray[0] as any;
            if (gridGrouping) {
                gridDecoratorHeightVal += gridGrouping.offsetHeight
            }
        } // if gridGroupingArray

    } // if gridElem
    return gridDecoratorHeightVal;
} // gridDecoratorsHeight

/**
 * Add a child Nx2 or HTMLElement to a anchor Nx2 or HTMLElement
 * @param {Nx2 | HTMLElement} anchor
 * @param {Nx2 | HTMLElement} child
 * @return {boolean} true if successful, false if error
 */
export function addNx2Child(anchor: Nx2 | HTMLElement, child: Nx2 | HTMLElement): boolean {
    if (!anchor) return false;
    if (!child) return false;

    try {

        let anchorHtmlElement: HTMLElement = null;
        if (isNx2(anchor)) {
            // Nx2
            anchorHtmlElement = anchor.htmlElementInitialized;
        } else {
            // HTMLElement
            anchorHtmlElement = anchor as HTMLElement;
        }// if(isNx2(anchor))
        if (!anchorHtmlElement) return false;

        let childHtmlElement: HTMLElement = null;
        if (isNx2(child)) {
            // Nx2
            childHtmlElement = child.htmlElementInitialized;
        } else {
            // HTMLElement
            childHtmlElement = child as HTMLElement;
        }// if(isNx2(child))
        if (!childHtmlElement) return false;

        anchorHtmlElement.appendChild(childHtmlElement);
        return true;

    } catch (ex) {
        console.error(ex, this, child);
    }
    return false;

} // addNx2Child


/**
 *
 * Remove child Nx2 or HTMLElement from a anchor Nx2 or HTMLElement
 * @param {Nx2 | HTMLElement} anchor
 * @param {Nx2 | HTMLElement} child
 * @return {boolean} true if successful, false if error
 */
export function removeNx2Child(anchor: Nx2 | HTMLElement, child: Nx2 | HTMLElement): boolean {
    if (!anchor) return false;
    if (!child) return false;
    try {
        let anchorHtmlElement: HTMLElement = null;
        if (isNx2(anchor)) {
            anchorHtmlElement = anchor.htmlElementInitialized;
        } else {
            anchorHtmlElement = anchor as HTMLElement;
        }

        let childHtmlElement: HTMLElement = null;
        if (isNx2(child)) {
            childHtmlElement = child.htmlElementInitialized;
        } else {
            childHtmlElement = child as HTMLElement;
        }

        if (childHtmlElement && anchorHtmlElement) {
            const childElement: HTMLElement | null = anchorHtmlElement.querySelector(`#${childHtmlElement.id}`);

            if (childElement !== null) {
                childElement.parentNode?.removeChild(childElement);
                return true;
            }
        }
    } catch (ex) {
        console.error(ex, this, child);
    }
    return false;
} // removeNx2Child

/**
 * Add a new sibling Nx2 or HTMLElement BEFORE an anchor Nx2 or HTMLElement
 * @param {Nx2 | HTMLElement} anchor
 * @param {Nx2 | HTMLElement} newSibling
 * @return {boolean} true if successful, false if error
 */
export function addNx2BeforeAnchor(anchor: Nx2 | HTMLElement, newSibling: Nx2 | HTMLElement): boolean {
    if (!anchor) return false;
    if (!newSibling) return false;
    try {
        let anchorHtmlElement: HTMLElement = null;
        if (isNx2(anchor)) {
            anchorHtmlElement = anchor.htmlElementInitialized;
        } else {
            anchorHtmlElement = anchor as HTMLElement;
        }

        let newSiblingHtmlElement: HTMLElement = null;
        if (isNx2(newSibling)) {
            newSiblingHtmlElement = newSibling.htmlElementInitialized;
        } else {
            newSiblingHtmlElement = newSibling as HTMLElement;
        }

        // Access the parent node of the anchor element
        const anchorParentHtmlElement = anchorHtmlElement.parentNode;

        // Insert the new sibling before the existing anchor element
        anchorParentHtmlElement.insertBefore(newSiblingHtmlElement, anchorHtmlElement);

        return true;
    } catch (ex) {
        console.error(ex, this, newSibling);
    }

    return false;
} // addNx2BeforeAnchor

/**
 * Add a new sibling Nx2 or HTMLElement AFTER an anchor Nx2 or HTMLElement
 * @param {Nx2 | HTMLElement} anchor
 * @param {Nx2 | HTMLElement} newSibling
 * @return {boolean} true if successful, false if error
 */
export function addNx2AfterAnchor(anchor: Nx2 | HTMLElement, newSibling: Nx2 | HTMLElement): boolean {
    if (!anchor) return false;
    if (!newSibling) return false;
    try {
        let anchorHtmlElement: HTMLElement = null;
        if (isNx2(anchor)) {
            anchorHtmlElement = anchor.htmlElementInitialized;
        } else {
            anchorHtmlElement = anchor as HTMLElement;
        }

        let newSiblingHtmlElement: HTMLElement = null;
        if (isNx2(newSibling)) {
            newSiblingHtmlElement = newSibling.htmlElementInitialized;
        } else {
            newSiblingHtmlElement = newSibling as HTMLElement;
        }

        // Access the parent node of the anchor element
        const anchorParentHtmlElement = anchorHtmlElement.parentNode;

        // Insert the new sibling after the existing anchor element (before the next sibling)
        anchorParentHtmlElement.insertBefore(newSiblingHtmlElement, anchorHtmlElement.nextSibling)

        return true;
    } catch (ex) {
        console.error(ex, this, newSibling);
    }

    return false;
} // addNx2BeforeAnchor