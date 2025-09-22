import {Component} from '@syncfusion/ej2-base';
import {ColumnModel, Grid} from "@syncfusion/ej2-grids";
import {prepareColumns} from "@syncfusion/ej2-grids/src/grid/base/util";
import {Column} from "@syncfusion/ej2-grids/src/grid/models/column";
import {isArray} from 'lodash';
import {EJINSTANCES, N2_CLASS} from '../../Constants';
import {N2} from '../N2';
import {isN2} from '../N2Utils';


/**
 * Calculate the total height of all the padding that the heading, filters and bottomContainer paging controls take in a grid
 * @param grid
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
        gridDecoratorHeightVal += 2; // border height

    } // if gridElem
    return gridDecoratorHeightVal;
} // gridDecoratorsHeight

/**
 * Add a child N2 or HTMLElement to a anchor N2 or HTMLElement
 * @param {N2 | HTMLElement} anchor
 * @param children
 * @return {boolean} true if successful, false if error
 */
export function addN2Child(anchor: N2 | HTMLElement, ...children: Array<N2 | HTMLElement>): boolean {
    if (!anchor) return false;
    if (!children || children.length === 0) return false;

    try {

        let anchorHtmlElement: HTMLElement;
        if (isN2(anchor)) {
            // N2
            anchorHtmlElement = anchor.htmlElementAnchorInitialized;
        } else {
            // HTMLElement
            anchorHtmlElement = anchor as HTMLElement;
        }// if(isN2(anchor))
        if (!anchorHtmlElement) return false;

        for (const child of children) {
            let childHtmlElement: HTMLElement = null;
            if (isN2(child)) {
                // N2
                childHtmlElement = child.htmlElementInitialized; // add the whole element, not just the anchor
            } else {
                // HTMLElement
                childHtmlElement = child as HTMLElement;
            }// if(isN2(child))

            if (childHtmlElement !== null)
                anchorHtmlElement.appendChild(childHtmlElement);
        }
        return true;

    } catch (ex) {
        console.error(ex, this, children);
        return false;
    }

} // addN2Child


/**
 *
 * Remove child N2 or HTMLElement from a anchor N2 or HTMLElement
 * @param {N2 | HTMLElement} anchor
 * @param {Array<N2 | HTMLElement>} children
 * @return {boolean} true if successful, false if error
 */
export function removeN2Child(anchor: N2 | HTMLElement, ...children: Array<N2 | HTMLElement>): boolean {
    if (!anchor) return false;
    if (!children || children.length === 0) return false;
    try {
        let anchorHtmlElement: HTMLElement;
        if (isN2(anchor)) {
            anchorHtmlElement = anchor.htmlElementAnchorInitialized;
        } else {
            anchorHtmlElement = anchor as HTMLElement;
        }

        for (const child of children) {
            let childHtmlElement: HTMLElement = null;
            if (isN2(child)) {
                childHtmlElement = child.htmlElementInitialized; // remove the whole element, not just the anchor
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
} // removeN2Child

/**
 * Add a new sibling N2 or HTMLElement BEFORE an anchor N2 or HTMLElement
 * @param {N2 | HTMLElement} anchor
 * @param {N2 | HTMLElement} newSibling
 * @return {boolean} true if successful, false if error
 */
export function addN2BeforeAnchor(anchor: N2 | HTMLElement, newSibling: N2 | HTMLElement): boolean {
    if (!anchor) return false;
    if (!newSibling) return false;
    try {
        let anchorHtmlElement: HTMLElement;
        if (isN2(anchor)) {
            anchorHtmlElement = anchor.htmlElementAnchorInitialized;
        } else {
            anchorHtmlElement = anchor as HTMLElement;
        }

        let newSiblingHtmlElement: HTMLElement;
        if (isN2(newSibling)) {
            newSiblingHtmlElement = newSibling.htmlElementAnchorInitialized;
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
} // addN2BeforeAnchor

/**
 * Add a new sibling N2 or HTMLElement AFTER an anchor N2 or HTMLElement
 * @param {N2 | HTMLElement} anchor
 * @param {N2 | HTMLElement} newSibling
 * @return {boolean} true if successful, false if error
 */
export function addN2AfterAnchor(anchor: N2 | HTMLElement, newSibling: N2 | HTMLElement): boolean {
    if (!anchor) return false;
    if (!newSibling) return false;
    try {
        let anchorHtmlElement: HTMLElement;
        if (isN2(anchor)) {
            anchorHtmlElement = anchor.htmlElementAnchorInitialized;
        } else {
            anchorHtmlElement = anchor as HTMLElement;
        }

        let newSiblingHtmlElement: HTMLElement;
        if (isN2(newSibling)) {
            newSiblingHtmlElement = newSibling.htmlElementAnchorInitialized;
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
} // addN2BeforeAnchor

export const EJ2_INSTANCES_FIELD = 'ej2_instances';

/**
 * Checks if the given HTML element contains at least one EJ2 element.
 *
 * @param {HTMLElement} elem - The HTML element to check.
 * @returns {boolean} - True if the element contains any Ej2 components, false otherwise.
 */
export function isEj2HtmlElement(elem: HTMLElement): boolean {
    if (elem) {
        let obj: any = (elem as any)[EJ2_INSTANCES_FIELD]
        if (obj && isArray(obj)) {
            let ej2Aray: any[] = obj as any[];
            return (ej2Aray.length > 0);
        }  // if obj is N2
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
        let obj: any = (elem as any)[EJ2_INSTANCES_FIELD]
        if (obj && isArray(obj)) {
            let ej2Array: any[] = obj as (Component<HTMLElement> | HTMLElement | any)[];
            if (ej2Array.length > 0)
                return ej2Array[0];
        }  // if obj is N2
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
        let obj: any = (elem as any)[EJ2_INSTANCES_FIELD]
        if (obj && isArray(obj)) {
            return obj as (Component<HTMLElement> | HTMLElement | any)[];
        }  // if obj is N2
    } // if elem exists
    return null;
} // getEj2ArrayFromHtmlElement

/**
 * Retrieves an array of all Syncfusion EJ2 instances
 * from a given EJ2 Model that was used to create an EJ2 component.
 *
 * For example, retrieves the Grid created from a GridModel instance.
 *
 * It's an array in case multiple EJ2 components are created using the same model.
 *
 * @param model EJ2 component model
 * @return {any[]} Array of EJ2 instances, Empty array if none. Never null.
 */
export function getEj2FromModel(model: any): any[] {
    let instances:any[] = [];
    if (model && model[EJINSTANCES]) {
       instances.push( ... model[EJINSTANCES] )
    } // if elem exists
    return instances;
} // getEj2FromModel

/**
 * Retrieves the first Syncfusion EJ2 instance from a given EJ2 Model that was used to create an EJ2 component.
 * Returns null if none.
 * @param model EJ2 component model
 * @return {any} EJ2 instance, null if none.
 */
export function getFirstEj2FromModel(model:any):any {
    let instances:any[] = getEj2FromModel(model);
    if (instances.length > 0)
        return instances[0];
    return null;
} // getFirstEj2FromModel

/**
 * Retrieves an array of all N2 instances from a model (by retrieving the EJ2 instances and then the N2 instances from them)
 * @param model EJ2 component model
 * @return {N2[]} Array of N2 instances, Empty array if none. Never null.
 */
export function getN2FromModel(model:any): N2[] {
    let instances:N2[] = [];
    if (model) {
        let ej2Instances: any[] = getEj2FromModel(model);
        for (let ej2Instance of ej2Instances) {
           let n2 = getN2FromEJ2(ej2Instance);
           if (n2)
                instances.push(n2);
        } // for
    } // if model
    return instances;
} // getN2FromModel

/**
 * Retrieves the first N2 instance from a model (by retrieving the EJ2 instances and then the N2 instances from them)
 * Returns null if none found.
 * @param model EJ2 component model
 * @return {N2 | null} N2 instance, null if none.
 */
export function getFirstN2FromModel(model:any): N2|null {
    let instances:N2[] = getN2FromModel(model);
    if (instances.length > 0)
        return instances[0];
    return null;
} // getFirstN2FromModel

/**
 * Retrieves the N2 instance from a given EJ2 instance.
 * @param ej2Instance
 * @return {N2 | null}
 */
export function getN2FromEJ2(ej2Instance: any): N2 | null {
    if (ej2Instance && ej2Instance[N2_CLASS]) {
        return ej2Instance[N2_CLASS];
    } // if ej2Instance
    return null;
} // getN2FromEJ2


/**
 * Converts an array of ColumnModel or Column to an array of new ColumnModel objects,
 * copying only the common properties.
 * Result can be cloned deeply without issues.
 *
 * @param {(ColumnModel[] | Column[])} cols - The array of ColumnModel or Column objects to convert.
 * @returns {ColumnModel[]} A new array of ColumnModel objects with copied properties.
 */
export function f_convert_to_ColumnModel(cols: (ColumnModel[] | Column[])): ColumnModel[] {
    if (!Array.isArray(cols)) return [];

    prepareColumns(cols); // initialize any missing properties and convert to Column (Syncfusion utility method)

    // List of common properties between Column and ColumnModel
    const commonProps = [
        'field', 'uid', 'index', 'headerText', 'width', 'minWidth', 'maxWidth', 'textAlign', 'clipMode',
        'headerTextAlign', 'disableHtmlEncode', 'type', 'format', 'visible', 'enableRowSpan', 'enableColumnSpan',
        'template', 'headerTemplate', 'isFrozen', 'allowSorting', 'allowResizing', 'allowFiltering', 'allowGrouping',
        'allowReordering', 'showColumnMenu', 'enableGroupByFormat', 'allowEditing', 'customAttributes',
        'displayAsCheckBox', 'dataSource', 'formatter', 'valueAccessor', 'headerValueAccessor', 'filterBarTemplate',
        'filter', 'columns', 'toolTip', 'isPrimaryKey', 'hideAtMedia', 'showInColumnChooser', 'editType',
        'validationRules', 'defaultValue', 'edit', 'isIdentity', 'foreignKeyValue', 'foreignKeyField',
        'commandsTemplate', 'commands', 'columnData', 'editTemplate', 'filterTemplate', 'lockColumn',
        'allowSearching', 'autoFit', 'freeze', 'sortComparer', 'templateOptions'
    ];
    return cols.map(col => {
        const obj: ColumnModel = {};
        if (col != null) {
            for (const key of commonProps) {
                if (Object.prototype.hasOwnProperty.call(col, key)) {
                    (obj as any)[key] = (col as any)[key];
                }
            }
        }
        return obj;
    });
} // f_convert_to_ColumnModel