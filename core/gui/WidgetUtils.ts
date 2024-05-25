import {Component} from "@syncfusion/ej2-base";
import {ColumnModel, Grid, QueryCellInfoEventArgs} from '@syncfusion/ej2-grids';
import {getErrorHandler} from "../CoreErrorHandling";
import {isPromise} from "../CoreUtils";
import {AbstractWidget, PROPERTY_NEXUS_WIDGET} from "./AbstractWidget";


export type GridWidgetCallBack = (args?: QueryCellInfoEventArgs, thisX ?: any) => void;


export function triggerWindowResizeEvent(htmlElement ?: HTMLElement): void {
    // https://stackoverflow.com/questions/39237485/how-to-trigger-window-resize-event-using-vanilla-javascript
    let event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    document.dispatchEvent(event);
}


// Declare the function type for the next callback
type typeClickOutsideCallback = (elem: HTMLElement, ev: MouseEvent) => void;

export function callbackOnClickOutside(component: Component<HTMLElement>, element: HTMLElement, callbackFunction: typeClickOutsideCallback) {

    let elementClickFunction = function (ev: MouseEvent) {
        ev.stopPropagation(); // do not propagate to window
    };
    element.addEventListener('click', elementClickFunction);

    document.addEventListener('click', function (event) {

        // let isOpen = component['isOpen'];
        //
        // if (isOpen) {
        // on click outside the element (click in element dont't register any longer

        // remove the propagation block
        element.removeEventListener('click', elementClickFunction); // remove the mouse click non propagation

        // call the callback function passed in
        callbackFunction(element, event);
        // }
    });

    // More detail at https://stackoverflow.com/questions/152975/how-do-i-detect-a-click-outside-an-element
}


export enum QUERY_OPERATORS {
    GREATER_THAN = "greaterthan",
    GREATER_THAN_OR_EQUAL = "greaterthanorequal",
    LESS_THAN = "lessthan",
    LESS_THAN_OR_EQUAL = "lessthanorequal",
    EQUAL = "equal",
    NOT_EQUAL = "notequal",
    STARTS_WITH = "startswith",
    ENDS_WITH = "endswith",
    CONTAINS = "contains",
    IS_NULL = "isnull",
    IS_NOT_NULL = "isnotnull",
    IS_EMPTY = "isempty",
    IS_NOT_EMPTY = "isnotempty",
    DOES_NOT_START_WITH = "doesnotstartwith",
    DOES_NOT_END_WITH = "doesnotendwith",
    DOES_NOT_CONTAIN = "doesnotcontain",
    LIKE = "like",
    NOT_LIKE = "notlike",
}

export function gridWidth(columns: ColumnModel[]): number {
    let width = 0;
    try {
        if (columns) {
            for (let col of columns) {
                let w: number = 0;
                try {
                    w = col.width as number;
                } catch (nex) {
                    w = 80; // default
                }

                width += w;
            } // for
        } // if columns
    } catch (ex) {
        getErrorHandler().displayExceptionToUser(ex);
    }
    width += 10; // 10 pixels for padding

    if (width == 0) {
        width = 20; // small
    }
    return width;
}

/**
 * Call this from the dataBound event of the Grid
 *
 * @param grid
 */
export function gridTotalRecordCount(grid: Grid): number {
    if (!grid)
        return 0;

    let count: number = 0;

    try {
        if (grid.allowPaging) {
            // paged grid
            let pagingSettings = grid.pageSettings
            if (pagingSettings.totalRecordsCount != null) {
                count = grid.pageSettings.totalRecordsCount;
            } else {
                count = grid.getRowsObject().length; // if not paged, get the number of loaded rows
            }
        } else {
            // unpaged grids
            if (grid.enableVirtualization) {
                if ((grid?.contentModule as any)?.count) {
                    count = (grid.contentModule as any).count;
                }
            } else {
                // not virtualized
                if (grid?.contentModule?.getRows()) {
                    count = grid.contentModule.getRows().length;
                }
            }
        }

    } catch (e) {
        console.error(e);
    }

    return count;
}

/**
 * Converts a array of mixed AbstractWidget and Promise<AbstractWidget> to
 * a Promise containing a resolved array of AbstractWidget only
 * @param mixedArray mixed AbstractWidget and Promise<AbstractWidget> array
 * @param errorCallback optional error handler function. In its absence, errors are logged in the console
 */
export async function resolveWidgetArray(
    mixedArray: (AbstractWidget | Promise<AbstractWidget>)[],
    errorCallback ?: (instance: AbstractWidget | Promise<AbstractWidget>, index: number) => Promise<void>
): Promise<AbstractWidget[]> {
    return resolveMixedPromiseArray<AbstractWidget>(mixedArray, errorCallback);
}

export async function resolveMixedPromiseArray<T>(
    mixedArray: (T | Promise<T>)[],
    errorCallback ?: (instance: T | Promise<T>, index: number) => Promise<void>
): Promise<T[]> {
    let resolvedArray: T[] = []
    if (mixedArray) {
        for (let i = 0; i < mixedArray.length; i++) {
            const mixedArrayElement: T | Promise<T> = mixedArray[i];
            let instance: T = null;
            if (mixedArrayElement) {
                try {
                    if (isPromise(mixedArrayElement)) {
                        instance = await mixedArrayElement;
                    } else {
                        // not a promise
                        instance = mixedArrayElement as T;
                    }
                    resolvedArray.push(instance);
                } catch (e) {
                    if (errorCallback) {
                        try {
                            await errorCallback.call(this, mixedArrayElement, i);
                        } catch (e2) {
                            console.error(e2);
                        }
                    } else {
                        console.error(e);
                    }
                }
            }
        } // for
    }
    return resolvedArray;
} // resolveMixedPromiseArray

/**
 * Get the full height of an HTMLElement, including padding, border and margin
 * @param element the element to be measured
 */
export function fullHeight(element: HTMLElement) {
    if (!element) return 0;
    let height = element.offsetHeight;
    let style = getComputedStyle(element);

    try {
        height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    } catch (e) { console.error(e); }
    return height;
} // fullHeight
/**
 * Get the full width of an HTMLElement, including padding, border and margin
 * @param element the element to be measured
 */
export function fullWidth(element: HTMLElement) {
    if (!element) return 0;
    let width = element.offsetWidth;
    let style = getComputedStyle(element);

    try {
        width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    } catch (e) { console.error(e); }
    return width;
} // fullWidth

/**
 * Get the Nexus Widget contained in this HTMLElement
 * @param element the element to be examined
 */
export function getNexusWidget<T extends AbstractWidget = AbstractWidget>(element: HTMLElement): T {
    if (!element) return null;
    let rawWidget = (element as any)[PROPERTY_NEXUS_WIDGET];
    if (rawWidget) {
        if (rawWidget instanceof AbstractWidget) {
            return rawWidget as T;
        }
    }
    return null;
}