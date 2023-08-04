import {Component} from '@syncfusion/ej2-base';
import {Grid} from "@syncfusion/ej2-grids";
import {isArray} from 'lodash';
import {Nx2} from '../Nx2';
import {isNx2} from '../Nx2Utils';


/**
 * Calculate the total height of all the padding that the heading, filters and bottomContainer paging controls take in a grid
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

        let gridfooterArray = gridElem.getElementsByClassName('e-gridfooter');
        if (gridfooterArray.length > 0) {
            let gridfooter: HTMLElement = gridfooterArray[0] as any;
            if (gridfooter) {
                gridDecoratorHeightVal += gridfooter.offsetHeight;
            }
        } //  if gridfooterArray

    } // if gridElem
    return gridDecoratorHeightVal;
} // gridDecoratorsHeight

/**
 * Add a child Nx2 or HTMLElement to a anchor Nx2 or HTMLElement
 * @param {Nx2 | HTMLElement} anchor
 * @param {Nx2 | HTMLElement | Nx2[] | HTMLElement[]} child
 * @return {boolean} true if successful, false if error
 */
export function addNx2Child(anchor: Nx2 | HTMLElement, ...children: Array<Nx2 | HTMLElement>): boolean {
    if (!anchor) return false;
    if (!children || children.length === 0) return false;

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

        for (const child of children) {
            let childHtmlElement: HTMLElement = null;
            if (isNx2(child)) {
                // Nx2
                childHtmlElement = child.htmlElementInitialized;
            } else {
                // HTMLElement
                childHtmlElement = child as HTMLElement;
            }// if(isNx2(child))

            if (childHtmlElement !== null)
                anchorHtmlElement.appendChild(childHtmlElement);
        }
        return true;

    } catch (ex) {
        console.error(ex, this, children);
        return false;
    }

} // addNx2Child


/**
 *
 * Remove child Nx2 or HTMLElement from a anchor Nx2 or HTMLElement
 * @param {Nx2 | HTMLElement} anchor
 * @param {Array<Nx2 | HTMLElement>} children
 * @return {boolean} true if successful, false if error
 */
export function removeNx2Child(anchor: Nx2 | HTMLElement, ...children: Array<Nx2 | HTMLElement>): boolean {
    if (!anchor) return false;
    if (!children || children.length === 0) return false;
    try {
        let anchorHtmlElement: HTMLElement = null;
        if (isNx2(anchor)) {
            anchorHtmlElement = anchor.htmlElementInitialized;
        } else {
            anchorHtmlElement = anchor as HTMLElement;
        }

        for (const child of children) {
            let childHtmlElement: HTMLElement = null;
            if (isNx2(child)) {
                childHtmlElement = child.htmlElementInitialized;
            } else {
                childHtmlElement = child as HTMLElement;
            }

            if (childHtmlElement && anchorHtmlElement) {
                const childElement: HTMLElement | null = anchorHtmlElement.querySelector(`#${childHtmlElement.id}`);

                if (childElement !== null)
                    childElement.parentNode?.removeChild(childElement);

            }
        } // for
        return true;

    } catch (ex) {
        console.error(ex, this, children);
        return false;
    }
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

export const EJ2_INSTANCES_FIELD = 'ej2_instances';

/**
 * Checks if the given HTML element contains at least one EJ2 element.
 *
 * @param {HTMLElement} elem - The HTML element to check.
 * @returns {boolean} - True if the element contains any Ej2 components, false otherwise.
 */
export function isEj2HtmlElement(elem: HTMLElement): boolean {
    if (elem) {
        let obj: any = elem[EJ2_INSTANCES_FIELD]
        if (obj && isArray(obj)) {
            let ej2Aray: any[] = obj as any[];
            return (ej2Aray.length > 0);
        }  // if obj is Nx2
    } // if elem exists
    return false;
} // isEj2HtmlElement

/**
 * Retrieves the first Syncfusion EJ2 instance from a given HTML element.
 *
 * @param {HTMLElement} elem - The HTML element to search in.
 * @returns {(Component<HTMLElement> | HTMLElement | any)} The first EJ2 instance found, or null if no instance was found.
 */
export function getFirstEj2FromHtmlElement(elem: HTMLElement): (Component<HTMLElement> | HTMLElement | any) {
    if (elem) {
        let obj: any = elem[EJ2_INSTANCES_FIELD]
        if (obj && isArray(obj)) {
            let ej2Array: any[] = obj as (Component<HTMLElement> | HTMLElement | any)[];
            if (ej2Array.length > 0)
                return ej2Array[0];
        }  // if obj is Nx2
    } // if elem exists
    return null;
} // getFirstEj2FromHtmlElement

/**
 * Retrieves an array of all Syncfusion EJ2 instances from a given HTML element.
 *
 * @param {HTMLElement} elem - The HTML element to search in.
 * @returns {(Component<HTMLElement> | HTMLElement | any)[]} An array of all EJ2 instances found, or null if no instances were found.
 */
export function getEj2ArrayFromHtmlElement(elem: HTMLElement): (Component<HTMLElement> | HTMLElement | any)[] {
    if (elem) {
        let obj: any = elem[EJ2_INSTANCES_FIELD]
        if (obj && isArray(obj)) {
            let ej2Array: any[] = obj as (Component<HTMLElement> | HTMLElement | any)[];
            return ej2Array;
        }  // if obj is Nx2
    } // if elem exists
    return null;
} // getEj2ArrayFromHtmlElement

// export type EventHandlerFunction = (...args: any[]) => void;
//
// export interface WrapEventOptions {
//     target: any;
//     originalHandler: EventHandlerFunction | null;
//     customCode: EventHandlerFunction;
//     position?: 'prefix' | 'suffix';
// }
//
// export function wrapEvent(options: WrapEventOptions):EventHandlerFunction {
//     const { target, originalHandler, customCode, position = 'prefix' } = options;
//
//     const wrappedHandler = (...args: any[]) => {
//         if (position === 'prefix') {
//             customCode.apply(target, args);
//         }
//
//         if (typeof originalHandler === 'function') {
//             originalHandler.apply(target, args);
//         }
//
//         if (position === 'suffix') {
//             customCode.apply(target, args);
//         }
//     };
//
//     return wrappedHandler;
// }