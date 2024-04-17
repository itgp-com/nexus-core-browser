/// <reference path="./global.d.ts" />
import {Component} from "@syncfusion/ej2-base";
import {DataManager, Query} from "@syncfusion/ej2-data";
import {ColumnModel} from '@syncfusion/ej2-grids';
import * as CSS from 'csstype';
import * as _ from "lodash";
import {isArray, isString} from "lodash";
import tippy, {Props, roundArrow} from "tippy.js";
import {tModel, urlTableEj2} from "./AppPathUtils";
import {getErrorHandler} from "./CoreErrorHandling";
import {EJList} from "./data/Ej2Comm";
import {NexusAdaptor} from "./data/NexusAdaptor";
import {CssStyle} from "./gui/AbstractWidget";

export const NEXUS_WINDOW_ROOT_PATH = 'com.itgp.nexus';
export const IMMEDIATE_MODE_DELAY = 1000;

declare global {
    // noinspection JSUnusedGlobalSymbols
    interface Array<T> {
        insert(index: number, ...items: any): Array<T>
    }

    interface String {
        escapeHTML(): string;
    }
}

/**
 * Inserts one or more items at a specified index in the array.
 *
 * @this {Array} - The array context on which the method is called.
 * @param {number} index - The index at which the new items should be inserted.
 * @param {...any} items - The items to be inserted into the array.
 * @returns {Array} - Returns a new array with the items inserted at the specified index.
 *
 * @example
 * const arr = [1, 2, 4];
 * const newArr = arr.insert(2, 3);
 * console.log(newArr); // Outputs: [1, 2, 3, 4]
 */
Array.prototype.insert = function (index: number, ...items: any) {
    //return this.splice(index, 0, item);
    return [
        ...this.slice(0, index),
        ...items,
        ...this.slice(index)
    ];
};


/**
 * Escapes special HTML characters (`&`, `<`, `>`) in a string.
 *
 * @this {String} - The string context on which the method is called.
 * @returns {string} - Returns a new string with special HTML characters escaped.
 *
 * @example
 * const unsafeString = "<div>Hello & Welcome!</div>";
 * const safeString = unsafeString.escapeHTML();
 * console.log(safeString); // Outputs: "&lt;div&gt;Hello &amp; Welcome!&lt;/div&gt;"
 */
String.prototype.escapeHTML = function (this: Object) {
    if (this === undefined)
        return 'undefined';

    if (this == null)
        return 'null';

    if (typeof this == "number" && isNaN(this)) {
        return 'NaN'
    }

    let value: string = this.toString();

    const tagsToReplace: any = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };
    // noinspection UnnecessaryLocalVariableJS
    let x: string = value.replace(/[&<>]/g, function (tag: string) {
        return tagsToReplace[tag] || tag;
    });

    return x;
};


//------------------------- Data Provider filter function type -------

/**
 * Displays the provided error to the user using displayExceptionToUser on the default errorHandler and then returns the error.
 *
 * @export
 * @param {Error} ex - The error object to be displayed.
 * @returns {Error} - Returns the provided error object.
 *
 * @example
 * try {
 *     // Some code that might throw an error
 * } catch (error) {
 *     showEx(error);
 * }
 */
export function showEx(ex: Error): Error {
    getErrorHandler().displayExceptionToUser(ex);
    return ex;
}

/**
 * Determines if an HTMLElement is visible in the DOM.
 *
 * @export
 * @param {HTMLElement} elem - The HTML element to check.
 * @returns {boolean} - Returns true if the element is visible, otherwise returns false.
 *
 * @see {@link https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js} for the source of the implementation (as of 2018-03-11).
 *
 * @example
 * const elem = document.getElementById('myElement');
 * if (isVisible(elem)) {
 *     console.log('The element is visible!');
 * }
 */
// noinspection JSUnusedGlobalSymbols
export function isVisible(elem: HTMLElement): boolean {
    return (!!elem &&
        !!(elem.offsetWidth ||
            elem.offsetHeight ||
            elem.getClientRects().length
        )
    ); // source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
}

/**
 * Type definition for the callback function that gets triggered when a click occurs outside the specified element.
 * Used in the {@link callbackOnClickOutside} function.
 *
 * @typedef {Function} typeClickOutsideCallback
 * @param {HTMLElement} elem - The HTML element that was being monitored for outside clicks.
 * @param {MouseEvent} ev - The mouse event object associated with the outside click.
 */
export type typeClickOutsideCallback = (elem: HTMLElement, ev: MouseEvent) => void;

/**
 * Sets up an event listener to detect a click outside of a given element and triggers a callback when such a click occurs.
 * Useful for scenarios like closing a modal or dropdown when a user clicks outside of it.
 *
 * @export
 * @param {Component<HTMLElement>} component - The component to which the element belongs.
 * @param {HTMLElement} element - The HTML element to monitor for outside clicks.
 * @param {typeClickOutsideCallback} callbackFunction - The callback function to execute when an outside click is detected.
 *
 * @see {@link https://stackoverflow.com/questions/152975/how-do-i-detect-a-click-outside-an-element} for more details on the approach.
 *
 * @example
 * const myComponent = new MyComponent();
 * const myElem = document.getElementById('myDropdown');
 * callbackOnClickOutside(myComponent, myElem, (elem, event) => {
 *     console.log('Clicked outside the element!');
 *     myComponent.closeDropdown();
 * });
 */
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


//--------------------------

// runScripts based on code from https://ghinda.net/article/script-tags/
/* helpers for runScripts below
 */

/**
 * Runs an array of asynchronous functions in sequential order. Once all functions have been executed,
 * a final callback is invoked.
 *
 * @param {any[]} arr - An array of asynchronous functions. Each function should accept a single callback as its argument.
 * @param {Function} callback - The final callback function to be invoked after all asynchronous functions have been executed.
 * @param {number} [index=0] - The starting index for the sequential execution. Typically used internally for recursive calls.
 *
 * @example
 * const asyncFunc1 = (cb) => {
 *     setTimeout(() => {
 *         console.log('First function executed');
 *         cb();
 *     }, 1000);
 * };
 *
 * const asyncFunc2 = (cb) => {
 *     setTimeout(() => {
 *         console.log('Second function executed');
 *         cb();
 *     }, 500);
 * };
 *
 * seq([asyncFunc1, asyncFunc2], () => {
 *     console.log('All functions executed');
 * });
 */
function seq(arr: any[], callback: any, index: any = 0) {
    // first call, without an index
    if (typeof index === 'undefined') {
        index = 0
    }

    if (arr.length == 0)
        return; // don't do anything

    arr[index](function () {
        index++;
        if (index === arr.length) {
            callback()
        } else {
            seq(arr, callback, index)
        }
    })
}

/**
 * Triggers a 'DOMContentLoaded' event on the document, simulating the browser's native event when the initial HTML is fully loaded and parsed.
 * Useful for manually signaling that scripts have finished executing and the DOM is ready.
 */
function scriptsDone() {
    const DOMContentLoadedEvent = document.createEvent('Event');
    DOMContentLoadedEvent.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(DOMContentLoadedEvent)
}

/**
 * Inserts a script into the document's head, either from a provided URL or from inline text.
 * Once the script is loaded (or if it's inline), a callback function is invoked.
 *
 * @param {$script} any - The script element or object containing either the 'src' attribute for external scripts or 'innerText' for inline scripts.
 * @param {Function} callback - The callback function to be invoked after the script has loaded (for external scripts) or after it's been inserted (for inline scripts).
 * @param {string} [className] - Optional class name for the script tag.
 * @param {string} [id] - Optional ID for the script tag.
 *
 * @example
 * // For an external script:
 * const extScript = document.createElement('script');
 * extScript.src = 'https://path.to/external/script.js';
 * insertScript(extScript, () => {
 *     console.log('External script loaded');
 * }, 'myScriptClass', 'myScriptID');
 *
 * // For an inline script:
 * const inlineScript = document.createElement('script');
 * inlineScript.innerText = 'console.log("Inline script executed");';
 * insertScript(inlineScript, () => {
 *     console.log('Inline script inserted');
 * });
 */
function insertScript($script: any, callback: any, className?: string, id?: string) {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    if ($script.src) {
        s.onload = callback;
        s.onerror = callback;
        s.src = $script.src;
    } else {
        s.textContent = $script.innerText;
    }

    // Optional class and id
    if (className) {
        s.className = className;
    }
    if (id) {
        s.id = id;
    }

    // re-insert the script tag so it executes.
    document.head.appendChild(s);

    // clean-up
    $script.parentNode.removeChild($script);

    // run the callback immediately for inline scripts
    if (!$script.src) {
        callback();
    }
}


// https://html.spec.whatwg.org/multipage/scripting.html
const runScriptTypes = [
    'application/javascript',
    'application/ecmascript',
    'application/x-ecmascript',
    'application/x-javascript',
    'text/ecmascript',
    'text/javascript',
    'text/javascript1.0',
    'text/javascript1.1',
    'text/javascript1.2',
    'text/javascript1.3',
    'text/javascript1.4',
    'text/javascript1.5',
    'text/jscript',
    'text/livescript',
    'text/x-ecmascript',
    'text/x-javascript'
];

/**
 * Finds and executes `<script>` tags within a specified container element.
 * The function ensures that the scripts are executed in the order they appear in the DOM.
 *
 * Note: Only runs scripts without a `type` attribute or those with a recognized JavaScript MIME type.
 *
 * @param {HTMLElement} $container - The container element within which to search for and execute `<script>` tags.
 *
 * @example
 * const container = document.getElementById('dynamicContent');
 * runScripts(container);
 */
// noinspection JSUnusedGlobalSymbols
export function runScripts($container: HTMLElement) {
    // get scripts tags from a node
    const $scripts = $container.querySelectorAll('script');
    const runList: any[] = [];
    let typeAttr;

    [].forEach.call($scripts, function ($script: any) {
        typeAttr = $script.getAttribute('type');

        // only run script tags without the type attribute
        // or with a javascript mime attribute value
        if (!typeAttr || runScriptTypes.indexOf(typeAttr) !== -1) {
            runList.push(function (callback: any) {
                insertScript($script, callback)
            })
        }
    });

    // insert the script tags sequentially
    // to preserve execution order
    seq(runList, scriptsDone)
}


/* To Title Case © 2018 David Gouch | https://github.com/gouch/to-title-case */
/**
 * Converts the string to title case. Specific rules are applied:
 * - Small words (e.g., "an", "and", "of") are left in lowercase unless they are the first or last word.
 * - Intentional capitalization is left as-is.
 * - URLs are left as-is.
 * - The first letter of other words is capitalized.
 *
 * @this {String} - The string context on which the method is called.
 * @returns {string} - Returns a new string converted to title case.
 *
 * @example
 * const str = "this is a test: the title case method";
 * console.log(str.toTitleCase()); // Outputs: "This is a Test: The Title Case Method"
 */
// eslint-disable-next-line no-extend-native
String.prototype.toTitleCase = function (): string {
    const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i;
    const alphanumericPattern = /([A-Za-z0-9\u00C0-\u00FF])/;
    const wordSeparators = /([ :–—-])/;

    return this.split(wordSeparators)
        .map(function (current: any, index: number, array: any[]) {
            if (
                /* Check for small words */
                current.search(smallWords) > -1 &&
                /* Skip first and last word */
                index !== 0 &&
                index !== array.length - 1 &&
                /* Ignore title end and subtitle start */
                array[index - 3] !== ':' &&
                array[index + 1] !== ':' &&
                /* Ignore small words that start a hyphenated phrase */
                (array[index + 1] !== '-' ||
                    (array[index - 1] === '-' && array[index + 1] === '-'))
            ) {
                return current.toLowerCase()
            }

            /* Ignore intentional capitalization */
            if (current.substr(1).search(/[A-Z]|\../) > -1) {
                return current
            }

            /* Ignore URLs */
            if (array[index + 1] === ':' && array[index + 2] !== '') {
                return current
            }

            /* Capitalize the first letter */
            return current.replace(alphanumericPattern, function (match: any) {
                return match.toUpperCase()
            })
        })
        .join('')
};

/**
 * Capitalizes the first character of the string and returns it.
 *
 * @this {String} - The string context on which the method is called.
 * @returns {string} - Returns a new string with the first character capitalized.
 *
 * @example
 * const str = "hello";
 * console.log(str.capitalize()); // Outputs: "Hello"
 */
String.prototype.capitalize = function (): string {
    return this.charAt(0).toUpperCase() + this.slice(1)
};

//---------------------------


/**
 * Removes all child nodes from the specified HTML element.
 *
 * @export
 * @param {(HTMLElement | string)} element - The target HTML element or its ID from which to remove child nodes.
 *
 * @example
 * // Using an HTMLElement reference
 * const myElem = document.getElementById('myDiv');
 * removeAllChildren(myElem);
 *
 * // Using an element ID string
 * removeAllChildren('myDiv');
 */
// noinspection JSUnusedGlobalSymbols
export function removeAllChildren(element: (HTMLElement | string)): void {
    if (element) {
        let htmlElement: HTMLElement;
        if (typeof (element) === 'string') {
            htmlElement = document.getElementById(element as string);
        } else if (element instanceof HTMLElement) {
            htmlElement = element as HTMLElement;
        } else {
            // Don't know what this is, so bail
            return;
        }

        while (htmlElement.firstChild)
            htmlElement.removeChild(htmlElement.firstChild);
    } // if element
}


//---------------------------------------
/**
 * Represents an RGB color with red, green, and blue components.
 */
class RGB {
    r: number;
    g: number;
    b: number;
}

/**
 * Converts an RGB color to its YIQ luminance value.
 * The YIQ value can be used to judge the brightness of a color.
 *
 * @param {RGB} rgb - The RGB color to convert.
 * @returns {number} - The YIQ luminance value.
 */
function rgbToYIQ(rgb: RGB) {
    return ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
}

/**
 * Converts a 6-character hexadecimal color string to its RGB representation.
 *
 * @export
 * @param {string} hex - The 6-character hexadecimal color string to convert.
 * @returns {RGB | undefined} - The RGB representation or `undefined` if the input isn't a valid 6-character hex color.
 *
 * @example
 * const color = hexToRgb("#FFFFFF");
 * console.log(color); // Outputs: { r: 255, g: 255, b: 255 }
 */
export function hexToRgb(hex: string) {
    if (!hex || hex === undefined || hex === '') {
        return undefined;
    }
    if (hex.length > 7) // 8 or 9 character hex with opacity
        return undefined;


    const result =
        /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : undefined;
}

/**
 * Converts an 8-character hexadecimal color string (including alpha) to its RGBA representation.
 *
 * @export
 * @param {string} hex8char - The 8-character hexadecimal color string to convert.
 * @returns {{ r: number, g: number, b: number, a: number } | undefined} - The RGBA representation or `undefined` if the input isn't a valid 8-character hex color with alpha.
 *
 * @example
 * const color = hexToRgba("#FFFFFF80");
 * console.log(color); // Outputs: { r: 255, g: 255, b: 255, a: 128 }
 */
export function hexToRgba(hex8char: string) {
    if (!hex8char || hex8char === undefined || hex8char === '') {
        return undefined;
    }

    const result =
        /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex8char);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: parseInt(result[4], 16),
    } : undefined;
}

/**
 * Generates contrasting text color as black or white for a given Background Color
 * @param backgroundColorHex
 * @param threshold
 */
export function fontColor(backgroundColorHex: string, threshold = 128): string {
    //https://medium.com/better-programming/generate-contrasting-text-for-your-random-background-color-ac302dc87b4
    if (backgroundColorHex === undefined) {
        return '#000';
    }

    let rgb = hexToRgb(backgroundColorHex);

    if (rgb === undefined) {
        rgb = hexToRgba(backgroundColorHex);
        if (rgb === undefined) {
            return '#000';
        }
    }

    return rgbToYIQ(rgb) >= threshold ? '#000000' : '#FFFFFF';
}


/**
 * Options for the `ej2Query` function.
 */
export interface Ej2QueryOptions {
    /**
     * The adaptor to be used for the query. If not provided, a default `NexusAdaptor` will be used.
     */
    adaptor?: NexusAdaptor;
}

/**
 * Queries the appserver using ej2 syntax and returns an array of records.
 *
 * @export
 * @param {string} tablename - The name of the table to be queried.
 * @param {Query} query - The query object specifying the conditions of the data retrieval.
 * @param {Ej2QueryOptions} [options] - Optional settings for the query.
 * @returns {Promise<any[]>} - A promise that resolves with an array of records or rejects with an error.
 *
 * @example
 * const table = "users";
 * const myQuery = new Query().where('id').equals(5);
 * ej2Query(table, myQuery)
 *   .then(records => {
 *     console.log(records);
 *   })
 *   .catch(error => {
 *     console.error("Error fetching data:", error);
 *   });
 */
export async function ej2Query(tablename: string, query: Query, options?: Ej2QueryOptions): Promise<any[]> {
    let dataManager = new DataManager({
        url: urlTableEj2(tablename),
        adaptor: (options?.adaptor ? options.adaptor : new NexusAdaptor()),
        crossDomain: true
    });

    return new Promise((resolve, reject) => {
            dataManager.executeQuery(query, (e: any) => {
                    let ejListFound: boolean = false;
                    let result: any = e.result as EJList;
                    if ((result.i_d == 'EJList')) {
                        ejListFound = true;
                    } else {
                        if (result.result) {
                            // sometimes it's nested
                            if (result.result.i_d == 'EJList') {
                                result = result.result;
                                ejListFound = true;
                            }
                        }

                        if (!ejListFound) {
                            if (e.actual) {
                                result = e.actual;
                                if ((result.i_d == 'EJList')) {
                                    ejListFound = true;
                                } // if ( (result.i_d == 'EJList'))
                            } // if (e.actual)
                        } // if (!ejListFound)

                    } //  if (! (result.i_d == 'EJList')){

                    if (ejListFound) {
                        if (!result.errMsgDisplay) {
                            let records: any[] = <any[]>result.result;
                            resolve(records);
                        } else {
                            console.log(result.errMsgDisplay);
                            console.log(result.errMsgLog);
                            reject(result.errMsgDisplay);
                        }
                    } else {
                        let error = `EJList class not found in response!:\n ${JSON.stringify(e, null, 2)}`
                        reject(error);
                    }
                },
                (error: any) => {
                    reject(error);
                },
                (e: any) => {

                }
            );
        }
    );
}// ej2Query


// noinspection JSUnusedGlobalSymbols
export function isDev(): boolean {
    return tModel;
}

/**
 * Remove all double spaces from a string
 * @param s
 */
export function removeDoubleSpaces(s: string): string {
    return s.replace(/  +/g, ' ');
}

/**
 * Converts the provided input, which can be either a string or an array of strings, into a single string.
 * If the input is an array of strings, it joins the array using the specified delimiter.
 *
 * @export
 * @param {(string | string[])} input - The input which can be either a single string or an array of strings.
 * @param {string} [joinUsing=' '] - The delimiter to use when joining an array of strings. Defaults to a single space.
 * @returns {string} - The converted string.
 *
 * @example
 * // Using a single string:
 * toStringFromMaybeArray('hello'); // Outputs: 'hello'
 *
 * // Using an array of strings:
 * toStringFromMaybeArray(['hello', 'world'], ', '); // Outputs: 'hello, world'
 */
export function toStringFromMaybeArray(input: (string | string[]), joinUsing: string = ' '): string {
    if (!input)
        return '';
    if (isArray(input)) {
        return (input as string[]).join(joinUsing);
    }
    return input as string;
}

//----------------------------------------------------------------------------
//------------------- Start dynamic CSS section ------------------------------
//----------------------------------------------------------------------------

let cachedStyle: HTMLStyleElement;
let ruleMap: Map<string, number> = new Map<string, number>();

/**
 * Function to set a CSS variable on the root element
 *
 * Example:
 * ```typescript
 * cssSetRootVariable('--my-color', 'green');
 * ```
 */
export function cssSetRootCSSVariable(variableName: string, value: string): void {
    // Access the root element
    const root = document.documentElement;

    // Set the CSS variable
    root.style.setProperty(variableName, value);
} // cssSetRootCSSVariable

/**
 * Function to set a CSS variable on a specified selector
 *
 * Examples of Use
 *
 * Example 1 - Setting a variable on a class:
 *```typescript
 * cssSetSelectorVariable('.example-class', '--main-bg-color', 'cyan');
 * ```
 *
 * Example 2 - Setting a variable on an ID:
 *
 *```typescript
 * cssSetSelectorVariable('#example-id', '--main-text-color', 'magenta');
 * ```
 *
 * Example 3 - Setting a variable on a complex selector:
 *
 * ```typescript
 * cssSetSelectorVariable('body.dark-mode .content', '--link-color', 'yellow');
 * ```
 *
 */
export function cssSetSelectorVariable(selector: string, variableName: string, value: string): void {
    // Access elements by selector
    const elements = document.querySelectorAll(selector);

    // Set the CSS variable for each element
    elements.forEach((element) => {
        element.style.setProperty(variableName, value);
    });
} // cssSetSelectorVariable


/**
 * Adds a CSS class with specified rules to a cached stylesheet.
 * If the class already exists, it will be overwritten.
 *
 * @export
 * @param {string} className - The name of the class to be added, without the preceding dot.
 * @param {string | CssLikeObject} rules - The rules to be applied to the class. Can be a simple string or a CssLikeObject.
 *
 * @example
 * // To add a simple CSS class:
 * cssAddClass('whatever', 'background-color: green;');
 *
 * // To add a CSS class using a CssLikeObject:
 * const rulesObj = { backgroundColor: 'green', fontSize: '16px' };
 * cssAddClass('whatever', rulesObj);
 */
export function cssAddClass(className: string, rules: string | CssLikeObject) {

    // Remove starting periods and spaces from the class name
    while (className.startsWith('.') || className.startsWith(' ')) {
        className = className.substring(1);
    }

    // Prepend a period to the class name
    className = `.${className}`;

    // Add the class with the given rules
    cssAddSelector(className, rules);
} // cssAddClass


/**
 * Removes the first instance of the specified class from the cached stylesheet.
 *
 * @export
 * @param {string} className - The name of the class to be removed.
 * @returns {boolean} - Returns true if the class was successfully removed, otherwise returns false.
 *
 * @example
 * // To remove a CSS class:
 * cssRemoveClass('.whatever');
 */
export function cssRemoveClass(className: string): boolean {
    return cssRemoveSelector(className);
} // cssRemoveClass


/**
 * Adds a CSS selector with specified rules to a cached stylesheet. If the selector already exists, it is first removed.
 *
 * @export
 * @param {string} cssSelectorName - The CSS selector name to be added.
 * @param {string | CssLikeObject} rules - The rules to be applied to the selector. Can be a simple string or a CssLikeObject.
 * @returns {void}
 * @throws {Error} - Throws an error if there's an issue accessing or modifying the stylesheet, or if the input parameters are not valid.
 *
 * @example
 * // To add a simple CSS selector:
 * cssAddSelector('.myClass', 'color: red;');
 *
 * // To add a CSS selector using a CssLikeObject:
 * const rulesObj = { color: 'red', fontSize: '16px' };
 * cssAddSelector('.myClass', rulesObj);
 */
export function cssAddSelector(cssSelectorName: string, rules: string | CssLikeObject) {

    if (!cssSelectorName) {
        getErrorHandler().displayExceptionToUser(`CoreUtils.cssAddClass method was passed an empty className parameter! className = ${cssSelectorName}`);
        return;
    }

    while (cssSelectorName.startsWith(' ')) {
        cssSelectorName = cssSelectorName.substr(1); // eliminate starting periods and spaces
    }

    if (!rules) {
        getErrorHandler().displayExceptionToUser(`CoreUtils.cssAddSelector method was passed an empty rules parameter! rules = ${rules}`);
        return;
    }

    let classArray: CssRule[];
    let t = typeof rules;
    if ((t === 'string')) {
        classArray = [{className: cssSelectorName, body: rules as string}];
    } else {
        classArray = cssNestedDeclarationToRuleStrings(cssSelectorName, rules as CssLikeObject);
    }

    if (!cachedStyle) {
        // Create it the first time through
        cachedStyle = document.createElement('style');
        // noinspection JSDeprecatedSymbols
        cachedStyle.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(cachedStyle);
    }


    if (ruleMap.get(cssSelectorName)) {
        let removed = cssRemoveSelector(cssSelectorName);
    }


    for (const cssRule of classArray) {
        if (!(cachedStyle.sheet || {}).insertRule) {
            // noinspection JSDeprecatedSymbols
            (((cachedStyle as any).styleSheet || cachedStyle.sheet) as any).addRule(`${cssRule.className}`, cssRule.body);
        } else {
            // Modern browsers use this path
            let n: number = cachedStyle.sheet?.cssRules.length; // insert at the end
            cachedStyle.sheet.insertRule(`${cssRule.className}{${cssRule.body}}`, n); // insert at the end
            ruleMap.set(cssRule.className, 1); // keep track of the fact that it's already been added
        }
    } // for CssRule

} // cssAddSelector

/**
 * Removes the specified CSS selector from the stylesheets.
 *
 * @export
 * @param {string} cssSelectorName - The CSS selector name to be removed.
 * @param {boolean} [global=false] - If true, the function searches all stylesheets. If false, it searches only the cached stylesheet.
 * @returns {boolean} - Returns true if the selector was successfully removed, otherwise returns false.
 * @throws {Error} - Throws an error if there's an issue accessing or modifying the stylesheet(s).
 *
 * @example
 * // To remove a selector from all stylesheets:
 * cssRemoveSelector('.myClass', true);
 *
 * // To remove a selector from the cached stylesheet:
 * cssRemoveSelector('.myClass');
 */
export function cssRemoveSelector(cssSelectorName: string, global: boolean = false): boolean {
    let removed: boolean = false;

    if (global) {
        // Loop through all stylesheets
        for (let i = 0; i < document.styleSheets.length; i++) {
            const styleSheet = document.styleSheets[i] as CSSStyleSheet;
            try {
                const rules = styleSheet.cssRules || styleSheet.rules;
                for (let j = 0; j < rules.length; j++) {
                    const rule = rules[j] as CSSStyleRule;
                    if (rule.selectorText === cssSelectorName) {
                        styleSheet.deleteRule(j);
                        removed = true;
                        // do not exit just in case the selector exists in multiple styleSheets
                        // break;
                    }
                } // for j
            } catch (ex) {
                console.error(ex);
                // Your custom error handler
                getErrorHandler().displayExceptionToUser(ex);
            } // catch

            // do not exit just in case the selector exists in multiple styleSheets
            // if (removed) break;

        } // for
    } else { // if global
        let cachedSheet: CSSStyleSheet = cachedStyle.sheet;
        if (cachedSheet) {


            for (let j = 0; j < cachedSheet.cssRules.length; j++) {
                if ((cachedSheet.cssRules[j] as CSSStyleRule).selectorText == `${cssSelectorName}`) {
                    try {
                        cachedSheet.deleteRule(j);
                        removed = true;
                        break;
                    } catch (ex) {
                        console.error(ex);
                        getErrorHandler().displayExceptionToUser(ex);
                    }
                } // if
            } //for
        } // cssRemoveClass
    } // if global

    if (removed)
        ruleMap.delete(cssSelectorName);
    return removed;
} // cssRemoveSelector


//https://yyjhao.com/posts/roll-your-own-css-in-js/
export type CssLikeObject = | { [selector: string]: CSS.PropertiesHyphen | CssLikeObject; } | CSS.PropertiesHyphen;


function joinSelectors(parentSelector: string, nestedSelector: string) {
    if (nestedSelector[0] === ":") {
        return parentSelector + nestedSelector;
    } else {
        return `${parentSelector} ${nestedSelector}`;
    }
}

export class CssRule {
    className: string;
    body: string;
}

/**
 * Converts a nested CSS declaration object into an array of CSS rules.
 * The function handles nested CSS properties by generating appropriate selectors.
 * This is an implementation inspired by CSS-in-JS methodologies.
 *
 * @export
 * @param {string} rootClassName - The root class name to which the CSS properties should be applied.
 * @param {CssLikeObject} declaration - A nested object representing CSS properties and their values.
 * @returns {CssRule[]} - An array of CSS rules where each rule has a `className` and a `body`.
 *
 * @see {@link https://yyjhao.com/posts/roll-your-own-css-in-js/} for more details on the inspiration.
 *
 * @example
 * const cssObj = {
 *   color: 'red',
 *   '&:hover': {
 *     color: 'blue'
 *   }
 * };
 *
 * cssNestedDeclarationToRuleStrings('.myClass', cssObj);
 * // Outputs:
 * // [
 * //   { className: '.myClass', body: 'color:red;' },
 * //   { className: '.myClass:hover', body: 'color:blue;' }
 * // ]
 */
export function cssNestedDeclarationToRuleStrings(rootClassName: string, declaration: CssLikeObject): CssRule[] {
    const result: CssRule[] = [];

    // We use a helper here to walk through the tree recursively
    function _helper(selector: string, declaration: CssLikeObject) {
        // We split the props into either nested css rules
        // or plain css props.
        const nestedNames: string[] = [];
        const cssProps: CSS.PropertiesHyphen = {};

        for (let prop in declaration) {
            const value = (<any>declaration)[prop];

            if (value instanceof Object) {
                nestedNames.push(prop);
            } else {
                (<any>cssProps)[prop] = value;
            }
        }

        const lines: string[] = [];
        // Collect all generated css rules.
        // lines.push(`${selector} {`);
        for (let prop in cssProps) {
            // collect the topContainer level css rules
            lines.push(`${prop}:${(<any>cssProps)[prop]};`);
        }
        // lines.push("}");

        // Each string has to be a complete rule, not just a single
        // property
        result.push({className: selector, body: lines.join("\n")});

        // Go through all nested css rules, generate string css rules
        // and collect them
        nestedNames.forEach((nestedSelector) =>
            _helper(
                joinSelectors(selector, nestedSelector),
                (<any>declaration)[nestedSelector]
            )
        );
    }

    _helper(rootClassName, declaration);
    return result;
}

/**
 * Converts the provided CSS style, which can be either a string or a `CssPropertiesHyphen` object, into a single string.
 *
 * @export
 * @param {CssStyle} cssStyle - Either a string of CSS or a `CssPropertiesHyphen` object.
 * @param {string} [cssDelimiter=''] - The delimiter to use between individual CSS rules. Defaults to an empty string (no delimiter).
 * @returns {string} - A single string representation of the provided CSS style.
 *
 * @example
 * // Using a simple CSS string:
 * cssStyleToString('color: red;');
 * // Outputs: 'color: red;'
 *
 * // Using a CssPropertiesHyphen object:
 * const cssObj = { color: 'red', 'font-size': '16px' };
 * cssStyleToString(cssObj, ' ');
 * // Outputs: 'color:red; font-size:16px;'
 */
export function cssStyleToString(cssStyle: CssStyle, cssDelimiter: string = ''): string {
    const cssProps: CSS.PropertiesHyphen = {};
    let style = '';

    if (cssStyle) {
        if (isString(cssStyle)) {
            style = cssStyle;
        } else {
            for (let prop in cssStyle) {
                const value = (<any>cssStyle)[prop];
                if (value instanceof Object) {
                    // do nothing
                } else {
                    (<any>cssProps)[prop] = value;
                }
            } // for
            const lines: string[] = [];
            for (let prop in cssProps) {
                // collect the topContainer level css rules
                lines.push(`${prop}:${(<any>cssProps)[prop]};`);
            }
            style = lines.join(cssDelimiter); // no spaces needed
        } // if cssStyle is string
    } // if cssStyle

    return style;
} //cssStyleToString


/**
 * Checks if the provided object looks like a Promise by determining if it has a `then` function.
 *
 * @export
 * @param {any} obj - The object to check.
 * @returns {boolean} - Returns true if the object looks like a Promise, otherwise returns false.
 */
export function isPromise(obj: any) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}


export function wrapVoidFunction(existingFunction: (...args: any[]) => (void | Promise<void>), newFunction: (...args: any[]) => (void | Promise<void>)): (...args: any[]) => (void | Promise<void>) {
    if (existingFunction) {
        let f = (...args: any[]) => {
            existingFunction(...args);
            newFunction(...args);
        };
        return f;
    } else {
        return newFunction;
    }
} // wrapVoidFunction

export function wrapFunction<T = void>(
    existingFunction: (...args: any[]) => (T | Promise<T>),
    wrapperFunction: (...args: any[]) => (T | Promise<T>)
): (...args: any[]) => (T | Promise<T>) {

    if (existingFunction) {
        let f = (...args: any[]) => {
            let existingFunctionOutput = existingFunction(...args);
            if (existingFunctionOutput)
                return existingFunctionOutput;

            return wrapperFunction(...args);
        };
        return f;
    } else {
        let f = (...args: any[]) => {
            return wrapperFunction(...args);
        };
        return f;
    }
} // wrapFunction

export let htmlElement_addTooltip_CoreOnly = (elem: HTMLElement, tippyProps: Partial<Props>) => {
    if (!elem)
        return;
    if (!tippyProps)
        return;

    let tippyModel: Partial<Props> = {
        arrow: roundArrow,
        // delay:    100,
        // duration: [275, 0],
        // interactive: false,

        allowHTML: true,
        appendTo: document.body,

        //-----------
        theme: 'nexus-core-001',
        duration: [275, 0],
        delay: 100,
        interactive: false,
        maxWidth: screen.width * 0.3,

        placement: "auto",
        popperOptions: {
            strategy: 'fixed',
            modifiers: [
                {
                    name: 'flip',
                    options: {
                        fallbackPlacements: ['left', 'right', 'bottom'],
                    },
                },
                {
                    name: 'preventOverflow',
                    options: {
                        altAxis: true,
                        tether: false,
                    },
                },
            ],
        },

        ...tippyProps,

        // hideOnClick: true,
        // trigger:     'click',

    };


    tippy(elem, tippyModel);

}

/**
 * Checks if the provided object is an instance of `HTMLElement`.
 *
 * @export
 * @param {any} obj - The object to check.
 * @returns {boolean} - Returns true if the object is an instance of `HTMLElement`, otherwise returns false.
 *
 * @example
 * const element = document.createElement('div');
 * isHTMLElement(element); // Outputs: true
 *
 * const notElement = { foo: "bar" };
 * isHTMLElement(notElement); // Outputs: false
 */
export function isHTMLElement(obj: any): boolean {
    return obj instanceof HTMLElement;
}

/**
 *  * This function replaces `<p>`, `</p>`, `<br>`, `<br />`, and new line characters in the input HTML string
 *  * with a specified separator string. It then trims the leading and trailing separators if specified.
 *  * Finally, it converts the resulting HTML string to plain text by creating a temporary DOM element and
 *  * returning its text content.
 *
 *  Usage:
 *  <code>
 *      let html = `<p><strong>Test <em>001</em></strong></p><p><strong><em>Line2</em></strong></p>`;
 *      console.log(htmlToTextWithReplacement(html, ' / ', true));  // Outputs: "Test 001 / Line2"
 * </code>
 *
 * @param {string} html - The input HTML string.
 * @param {string} [separator=' / '] - The string to use as a replacement for `<p>`, `</p>`, `<br>`, `<br />`, and new lines. Defaults to ' / '.
 * @param {boolean} [removeLeadingTrailingSeparators=true] - Whether to remove leading and trailing separators. Defaults to true.
 * @return {string} The resulting plain text string.
 */
export function htmlToText(html: string, separator: string = ' / ', removeLeadingTrailingSeparators: boolean = true): string {


    let inner1 = ((html || '') + '').toString().trim();

    // Replace <p>, </p>, <br>, <br />, and new lines with separator
    inner1 = inner1.replace(/(<\/?p>|<br\s*\/?>|\n)/gi, separator);


    // If removeLeadingTrailingSeparators is true, trim leading and trailing separators
    if (removeLeadingTrailingSeparators) {
        let separatorPattern = new RegExp(`^\\s*${separator}|${separator}\\s*$`, 'gi');
        inner1 = inner1.replace(separatorPattern, '');
    }

    /*
     NOTE: Observed that using the string coming out of replace DIRECTLY makes the queryCellInfo string not register at all - no rows show up
     in the grid any more.  So we create a new string and use that instead.
     */
    let inner2 = inner1 + '';

    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = inner2;
    return tempDiv.textContent || tempDiv.innerText || "";
}

/**
 * Type declaration for an isEqual function that compares two objects of type T.
 *
 * @template T - The type of objects to compare.
 *
 * @param a - The first object to compare.
 * @param b - The second object to compare.
 *
 * @returns boolean - True if the objects are equal, false otherwise.
 *
 * Example usage:
 * ```ts
 * const myIsEqual: isEqualFunction<MyType> = (a, b) => {
 *   // compare a and b
 *   return a.id === b.id;
 * }
 * ```
 */
export type isEqualFunction<T = any> = (a: T, b: T) => boolean;

/**
 * Adds an object or array of objects to an array if they don't already exist inside the array.
 *
 * If an isEqualFunction is not supplied, then it uses lodash's isEqual function.
 * Does nothing if array or object are null
 * @param {T[]} array
 * @param {T | T[]} object
 * @param {isEqualFunction<T>} isEqualFunction
 */
export function addToArrayIfNotFound<T = any>(array: T[], object: T | T[], isEqualFunction ?: isEqualFunction<T>): void {
    if (array == null || object == null)
        return; // no change

    // internal single add function
    const addSingleObject = (obj: T) => {
        if (isEqualFunction == null)
            isEqualFunction = _.isEqual;
        try {
            const exists = _.find(array, currentObject => isEqualFunction(currentObject, obj));
            if (!exists)
                array.push(obj);
        } catch (e) { console.error(e); }
    };

    if (Array.isArray(object)) {
        object.forEach(obj => addSingleObject(obj));
    } else {
        addSingleObject(object);
    }
} // addToArrayIfNotFound

/**
 * Removes an object or array of objects from an array if they exist inside the array.
 *
 * If an isEqualFunction is not supplied, then it uses lodash's isEqual function.
 * Does nothing if array or object are null
 * @param {T[]} array
 * @param {T | T[]} object
 * @param {isEqualFunction<T>} isEqualFunction
 */
export function removeFromArrayIfExists<T = any>(array: T[], object: T | T[], isEqualFunction ?: isEqualFunction<T>): void {
    if (array == null || object == null)
        return; // no change

    // internal single remove function
    const removeSingleObject = (obj: T) => {
        if (isEqualFunction == null)
            isEqualFunction = _.isEqual;
        try {
            for (let i = 0; i < array.length; i++) {
                if (isEqualFunction(array[i], obj)) {
                    array.splice(i, 1);
                    break; // assuming unique objects, stop after finding the first match
                }
            }
        } catch (e) { console.error(e); }
    };

    if (Array.isArray(object)) {
        object.forEach(obj => removeSingleObject(obj));
    } else {
        removeSingleObject(object);
    }
} // removeFromArrayIfExists

/**
 * Finds the indices of records that match the existing selection.
 *
 * @param {T[]} records - The array of records to search.
 * @param {T[]} existingSelection - The array of selected records.
 * @param {isEqualFunction<T>} [isEqualFunction=_.isEqual] - Function to check equality between records and selection.
 *
 * @returns {number[]} - Array of indices of the matching records.
 *
 * Loops through the records array and checks if each record exists in the selection using the isEqualFunction.
 * If a match is found, the index is added to the indices array.
 *
 * Example usage:
 * ```ts
 * const indices = findMatchingIndices(myRecords, mySelection);
 * ```
*/
export function findMatchingIndices<T = any>(records: T[], existingSelection: T[], isEqualFunction: isEqualFunction<T> = _.isEqual): number[] {
    let indices: number[] = [];

    for (let i = 0; i < records.length; i++) {
        const record = records[i];
        const exists = existingSelection.some(selection => isEqualFunction(record, selection));
        if (exists)
            indices.push(i);

    } // for

    return indices;
}

/**
 * Creates an inert column model configuration object.
 *
 * @returns {ColumnModel} - The inert column model configuration.
 *
 * The returned object has all features disabled and default values set:
 * - Empty header text
 * - Width of 30
 * - Center text alignment
 * - Filtering, sorting, searching, grouping, reordering, editing disabled
 * - No column menu
 *
 * This is useful for creating placeholder inert columns in a grid.
 *
 * Example usage:
 * ```ts
 * const inertColumn = inertColumnModel();
 * ```
*/
export function inertColumnModel(): ColumnModel {
    return     {
        headerText: '',
        headerTextAlign: undefined,
        width: 30,
        textAlign: 'Center',
        allowFiltering: false,
        allowSorting: false,
        allowSearching: false,
        allowGrouping: false,
        allowReordering: false,
        allowEditing: false,
        showColumnMenu: false,
    } as ColumnModel;
}