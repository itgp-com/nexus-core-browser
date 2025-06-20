/**
 * Basic utils that have no 'import' statements from anywhere else in Core
 */
// import base32Encode       from 'base32-encode'
let base32Encode: any;

async function init() {
    base32Encode = (await import('base32-encode')).default;
}

init();


import DOMPurify from 'dompurify';
import {isFunction} from "lodash";
import {removeDoubleSpaces} from "./CoreUtils";
import {CssStyle, cssStyleToString} from './CssUtils';

export type StringFunction = () => string;
export type StringArg = (string | StringFunction);

export interface voidFunction {
    (): void;
}

export function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}

export function getRandomString(prefix?: string): string {
    let p: string = (prefix ? `${prefix}_` : '');
    p = p.replace(/\./g, '_'); // replaces '.' with '_'
    p = p.replace(/#|:/g, '_'); // replaces '#' and ':' with '_'
    let retVal = `${p}${getRandomInt(1000)}_${getRandomInt(100000)}`;
    return retVal;
} // noinspection JSUnusedGlobalSymbols

export function getRandomText(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export interface noArgsFunction {
    (): any;
}

// export function isFunction(arg: any): boolean {
//    return (arg ? (typeof arg === "function") : false);
// }

export function stringArgVal(arg: StringArg): string {
    // arg can only be a String or StringFunction
    if (arg) {
        if (isFunction(arg)) {
            let s: string = (<StringFunction>arg)();
            return s;
        } else {
            return <string>arg;
        }
    } else {
        return '';
    }
} //stringArgVal
//---------------- Class instance/array/instance function/ array function type ------------------
/**
 * Returns an instance of the type described
 */
export type ClassFunction<T> = () => T;
/**
 * Returns an instance of the type described in the generic
 */
export type ClassArrayFunction<T> = () => T[];
export type ClassArg<T> = (T | ClassFunction<T>);
export type ClassArrayArg<T> = (T[] | ClassArrayFunction<T>);
export type ClassArgInstanceOrArray<T> = (T | T[] | ClassFunction<T> | ClassArrayFunction<T>);

/**
 * Extract an actual instance T regardless of whether the argument is already a T instance or if it's a function that yields the T instance when called
 * Returns null if argument is empty
 * @param arg
 */
export function classArgInstanceVal<T>(arg: ClassArg<T>): T {
    if (arg) {
        if (isFunction(arg)) {
            let val: T = (<ClassFunction<T>>arg)();
            return val;
        } else {
            return (<T>arg);
        }
    } else {
        return null;
    }
} // classArgInstanceVal
/**
 * Extract an actual array T[] regardless of whether the argument is already an array or if it's a function that yields the T[] array when called
 *  Returns null if argument is empty
 * @param arg
 */
export function classArgArrayVal<T>(arg: |ClassArrayArg<T>): T[] {
    if (arg) {
        if (isFunction(arg)) {
            let val: T[] = (<ClassArrayFunction<T>>arg)();
            return val;
        } else {
            return (<T[]>arg);
        }
    } else {
        return null;
    }
} // classArgInstanceVal
/**
 * /**
 * Extract an instance of an actual array (T| T[]) regardless of whether the argument is already an instance/array or if it's a function that yields the T instance or T[] array when called
 *  Returns null if argument is empty
 * @param arg
 */
export function classArgInstanceOrArrayVal<T>(arg: (ClassArg<T> | ClassArrayArg<T> | ClassArgInstanceOrArray<T>)): (T | T[]) {
    // arg can only be a String or StringFunction
    if (arg) {
        if (isFunction(arg)) {

            if (arg as ClassFunction<T>) {
                let val: T = (<ClassFunction<T>>arg)();
                return val;
            } else {
                let arrayVal: T[] = (<ClassArrayFunction<T>>arg)();
                return arrayVal;
            }

        } else {
            if (Array.isArray(arg)) {
                return (<T[]>arg);
            } else {
                return (<T>arg);
            }
        }
    } else {
        return null;
    }
} //stringArgVal
export function isA(ChildClass: any, ParentClass: any) {
    let _ = ChildClass.prototype;
    while (_ != null) {
        if (_ == ParentClass.prototype)
            return true;
        _ = _.__proto__;
    }
    return false;
}

/**
 * Sanitizes an HTML string using DOMPurify, allowing 'target' and 'rel' attributes.
 *
 * This function should be used to clean user-supplied or dynamic HTML before inserting it into the DOM,
 * to prevent XSS attacks. It is used internally by {@link htmlToElement}, {@link htmlToElements}, and {@link htmlToFragment}.
 *
 * @param {string} htmlString - The HTML string to sanitize.
 * @returns {string} The sanitized HTML string.
 *
 * @example
 * const safeHtml = DOMPurifyNexus('<a href="..." target="_blank" rel="noopener">link</a>');
 */
export function DOMPurifyNexus(htmlString: string): string {
    return DOMPurify.sanitize(htmlString.trim(), {ADD_ATTR: ['target', 'rel']});
}


/**
 * Options for HTML parsing functions.
 * @typedef {Object} HtmlParseOptions
 * @property {boolean} [disableSanitize] - If true, skips DOMPurifyNexus sanitization. Use with caution!
 */
export type HtmlParseOptions = {
    /**
     * If true, disables HTML sanitization via DOMPurifyNexus.
     * Use only if you trust the HTML source!
     */
    disableSanitize?: boolean;
};

/**
 * Converts an HTML string representing a single element into an HTMLElement.
 *
 * By default, the HTML string is sanitized using {@link DOMPurifyNexus} to prevent XSS.
 * You can disable sanitization by passing `{ disableSanitize: true }` as the second parameter.
 * Use this function when your HTML string contains only one top-level element.
 * For multiple elements, use {@link htmlToElements} or {@link htmlToFragment}.
 *
 * @param {string} htmlString - HTML representing a single element.
 * @param {HtmlParseOptions} [options] - Optional settings (e.g., disableSanitize).
 * @returns {HTMLElement} The resulting HTMLElement.
 *
 * @example
 * const el = htmlToElement('<button>Click me</button>');
 * document.body.appendChild(el);
 *
 * @example
 * // Unsafe: disables sanitization
 * const el = htmlToElement('<button onclick="alert(1)">Unsafe</button>', { disableSanitize: true });
 */
export function htmlToElement(htmlString: string, options?: HtmlParseOptions): HTMLElement {
    const div = document.createElement('div');
    const html = options?.disableSanitize
        ? htmlString.trim()
        : DOMPurifyNexus(htmlString.trim());
    div.innerHTML = html;
    return div.firstElementChild as HTMLElement;
}

/**
 * Converts an HTML string containing multiple top-level elements into an array of HTMLElements.
 *
 * By default, the HTML string is sanitized using {@link DOMPurifyNexus} to prevent XSS.
 * You can disable sanitization by passing `{ disableSanitize: true }` as the second parameter.
 * Use this function when your HTML string contains multiple sibling elements at the top level.
 * For a single element, use {@link htmlToElement}. For a fragment, use {@link htmlToFragment}.
 *
 * @param {string} htmlString - HTML containing one or more top-level elements.
 * @param {HtmlParseOptions} [options] - Optional settings (e.g., disableSanitize).
 * @returns {HTMLElement[]} An array of HTMLElements parsed from the string.
 *
 * @example
 * const elements = htmlToElements('<div>One</div><div>Two</div>');
 * elements.forEach(el => document.body.appendChild(el));
 *
 * @example
 * // Unsafe: disables sanitization
 * const elements = htmlToElements('<div onclick="alert(1)">Unsafe</div>', { disableSanitize: true });
 */
export function htmlToElements(htmlString: string, options?: HtmlParseOptions): HTMLElement[] {
    const div = document.createElement('div');
    const html = options?.disableSanitize
        ? htmlString.trim()
        : DOMPurifyNexus(htmlString.trim());
    div.innerHTML = html;
    return Array.from(div.children) as HTMLElement[];
}

/**
 * Converts an HTML string into a DocumentFragment containing all top-level nodes.
 *
 * By default, the HTML string is sanitized using {@link DOMPurifyNexus} to prevent XSS.
 * You can disable sanitization by passing `{ disableSanitize: true }` as the second parameter.
 * Use this when you want to insert multiple elements or nodes (including text nodes) into the DOM efficiently.
 * For a single element, use {@link htmlToElement}. For an array of elements, use {@link htmlToElements}.
 *
 * @param {string} htmlString - HTML containing one or more top-level nodes.
 * @param {HtmlParseOptions} [options] - Optional settings (e.g., disableSanitize).
 * @returns {DocumentFragment} A DocumentFragment containing the parsed nodes.
 *
 * @example
 * const fragment = htmlToFragment('<div>One</div><div>Two</div>');
 * document.body.appendChild(fragment);
 *
 * @example
 * // Unsafe: disables sanitization
 * const fragment = htmlToFragment('<div onclick="alert(1)">Unsafe</div>', { disableSanitize: true });
 */
export function htmlToFragment(htmlString: string, options?: HtmlParseOptions): DocumentFragment {
    const template = document.createElement('template');
    const html = options?.disableSanitize
        ? htmlString.trim()
        : DOMPurifyNexus(htmlString.trim());
    template.innerHTML = html;
    return template.content;
}




//---------------------------------------
/**
 * Removes all the tags after the lastIdTag passed in
 *
 * @param lastIdTag the last tag of the application html inside body. Defaults to 'app__l_a_s_t__' if not passed in
 */
export function cleanUpHtml(lastIdTag: string = 'app__l_a_s_t__') {
    // get rid of all the junk in the page
    nextAll(null, document.getElementById(lastIdTag)).forEach((el: HTMLElement) => {
        el.remove();
    });
} // noinspection SpellCheckingInspection

/**
 * Select all HTMLElements at the same level as the element passed in and return them in an array
 * Equivalent to jQuery nextAll()
 * @param selector null or selector for which siblings to return
 * @param element anchor element to start from
 */
export function nextAll(selector: string, element: HTMLElement): HTMLElement[] {
    let all: HTMLElement[] = [];
    if (element) {
        while (element.nextElementSibling) {
            element = element.nextElementSibling as HTMLElement;
            if (selector) {
                if (element.matches(selector)) {
                    all.push(element);
                }
            } else {
                // no selector - all elements go in
                all.push(element);
            }
        }
    }
    return all;
}


/*
 * Deletes an element from the DOM by its ID.
 *
 * @param {string} elementId - The ID of the element to delete.
 *
 * Finds the element in the DOM with the provided ID using document.getElementById().
 * If the element exists, it is removed from the DOM using removeChild().
 *
 * Example usage:
 * ```
 * deleteElementById('myElement');
 * ```
 */
export function deleteElementById(elementId: string) {
    // Find the element by its ID
    var element = document.getElementById(elementId);

    // If the element exists, remove it from the DOM
    if (element) {
        element.parentNode.removeChild(element);
    }
} // deleteElementById

// noinspection SpellCheckingInspection
/** Return the document element by it's ID or null if it doesn't exist
 *
 * @param id
 */
export function hget(id: string): HTMLElement {
    if (id)
        return document.getElementById(id);
    else
        return null;
}

export function hgetInput(id: string): HTMLInputElement {
    return hget(id) as HTMLInputElement;
} // noinspection JSUnusedGlobalSymbols
// noinspection JSUnusedGlobalSymbols
export function cast<T>(obj: any, cl: { new(args: any): T }): T {
    if (obj)
        obj.__proto__ = cl.prototype;
    return obj;
}

export function castArray<T>(array: Object[], cl: { new(args: any): T }): T[] {
    if (array) {
        array.forEach(elem => {
            cast(elem, cl);
        });
    }
    return array as T[];
}

export class Args_FunctionsTable {
    functionName: string;
    /**
     * Concatenation of arguments to pass to this function complete with surrounding quotes, commas between parameters, etc
     * Ex: arguments = "'arg1', 'arg2', 'arg3'"
     */
    arguments ?: string;
}

export function functionAsTable(param: Args_FunctionsTable): string {
    if (!param.arguments) {
        return `${param.functionName}()`; // no arguments
    } else {
        // Base32 encode, then add second set of paranthesis to indicate encoding

        let uint8array = new TextEncoder().encode(param.arguments);
        // https://www.npmjs.com/package/base32-encode
        let encodedArgs = base32Encode(uint8array, 'RFC4648'); // RFC4648 is the default standard that the application server uses

        // double paranthesis to indicate encoded arguments
        return `${param.functionName}((${encodedArgs}))`;

    } // if arguments
} // functionAsTable


export interface IKeyValueString {
    [key: string]: string
}

export interface IArgs_HtmlDecoration {
    htmlTagClass?: string;
    htmlTagStyle?: CssStyle;
    htmlOtherAttr?: IKeyValueString; // {string:string};
}

export interface IArgs_HtmlTag extends IArgs_HtmlDecoration {
    htmlTagType?: string; // div by default
}

export class IArgs_HtmlTag_Utils {

    static init(args: IArgs_HtmlDecoration): IArgs_HtmlTag {
        if (!args)
            args = {};
        if (!(args as any).htmlTagType)
            (args as IArgs_HtmlTag).htmlTagType = 'div';// default to 'div'
        if (!args.htmlTagClass)
            args.htmlTagClass = '';
        if (!args.htmlTagStyle)
            args.htmlTagStyle = {};
        if (!args.htmlOtherAttr)
            args.htmlOtherAttr = {};

        return args;
    }

    static class(args: IArgs_HtmlDecoration): string {
        args = IArgs_HtmlTag_Utils.init(args);
        let htmlTagClass = '';
        if (args.htmlTagClass)
            htmlTagClass = ` class="${args.htmlTagClass}"`;

        return htmlTagClass;
    }

    static style(args: IArgs_HtmlDecoration): string {
        args = IArgs_HtmlTag_Utils.init(args);
        let htmlTagStyle = '';
        if (args.htmlTagStyle)
            htmlTagStyle = ` style="${cssStyleToString(args.htmlTagStyle)}"`;
        return htmlTagStyle;
    }

    static otherAttr(args: IArgs_HtmlDecoration): string {
        args = IArgs_HtmlTag_Utils.init(args);
        let htmlAttrs = '';
        if (args.htmlOtherAttr) {
            Object.entries(args.htmlOtherAttr).forEach(entry => {
                let key = entry[0];
                let value = entry[1];
                //use key and value here
                if (value == null) {
                    htmlAttrs += ` ${key}` // attributes like 'required' that don't have an equal something after the name
                } else {
                    htmlAttrs += ` ${key}="${value}"`;
                }
            });
        }
        return htmlAttrs;
    }

    static all(args: IArgs_HtmlDecoration): string {
        return `${IArgs_HtmlTag_Utils.class(args)}${IArgs_HtmlTag_Utils.style(args)}${IArgs_HtmlTag_Utils.otherAttr(args)}`;
    }

}

/**
 * Applies decorations (classes, styles, and attributes) to a given HTML element.
 *
 * @export
 * @param {HTMLElement} htmlElement - The target HTML element to which decorations should be applied.
 * @param {IArgs_HtmlDecoration} decoration - The decoration arguments specifying classes, styles, and attributes.
 *
 * @example
 * const elem = document.getElementById('myDiv');
 * const decoration = {
 *   htmlTagClass: 'div',
 *   htmlTagStyle: { color: 'red', fontSize: '16px' },
 *   htmlOtherAttr: { 'data-test': 'testValue' }
 * };
 * applyHtmlDecoration(elem, decoration);
 */
export function applyHtmlDecoration(htmlElement: HTMLElement, decoration: IArgs_HtmlDecoration): void {
    if (!htmlElement)
        return;
    if (!decoration)
        return;

    // first append any classes
    try {
        let htmlTagClass: string = decoration.htmlTagClass;
        if (htmlTagClass) {
            htmlTagClass = removeDoubleSpaces(htmlTagClass);
            if (htmlTagClass) {
                let newClasses: string[] = htmlTagClass.split(' ');
                htmlElement.classList.remove(...newClasses)
                htmlElement.classList.add(...newClasses);
            }
        } // if ( htmlTagClass)
    } catch (ex) {
        console.error(ex);
    }

    // now update the style attribute
    try {
        let styleAsString: string = cssStyleToString(decoration.htmlTagStyle);
        if (styleAsString) {
            styleAsString = removeDoubleSpaces(styleAsString);
            if (styleAsString) {
                let currentStyle: string = htmlElement.getAttribute('style');
                if (!currentStyle)
                    currentStyle = ''
                if (currentStyle.length > 0 && (!currentStyle.endsWith(';')))
                    currentStyle += ';'

                currentStyle += styleAsString;
                htmlElement.setAttribute('style', currentStyle);
            }
        } // if (htmlTagStyle)
    } catch (ex) {
        console.error(ex);
    }

    // now add any additional  attributes

    try {
        let htmlOtherAttr: IKeyValueString = decoration.htmlOtherAttr;
        if (htmlOtherAttr) {
            for (let key in htmlOtherAttr) {
                if (key) {
                    let value: string = htmlOtherAttr[key];

                    if (value == null)
                        value = ''; // empty attribute
                    try {
                        htmlElement.setAttribute(key, value);
                    } catch (ex) {
                        console.error(ex);
                    }
                } // if key
            } // for
        } //if (htmlOtherAttr )
    } catch (ex) {
        console.error(ex);
    }

} // applyHtmlDecoration


/**
 * Gets the inner width of an HTMLElement, including padding but excluding borders and margins.
 * Handles elements with any display type, including inline elements.
 *
 * @param {HTMLElement} element - The HTMLElement to measure.
 * @returns {number} The client width of the element in pixels.
 */
export function getClientWidth(element: HTMLElement): number {
    // Temporarily change display to inline-block to measure width if needed
    const originalDisplay = element.style.display;
    if (window.getComputedStyle(element).display === 'inline') {
        element.style.display = 'inline-block';
    }

    const width = element.clientWidth;

    // Restore the original display value
    element.style.display = originalDisplay;

    return width;
} // getClientWidth
/**
 * Gets the inner height of an HTMLElement, including padding but excluding borders and margins.
 * Handles elements with any display type, including inline elements.
 *
 * @param {HTMLElement} element - The HTMLElement to measure.
 * @returns {number} The client height of the element in pixels.
 */
export function getClientHeight(element: HTMLElement): number {
    // Temporarily change display to inline-block to measure height if needed
    const originalDisplay = element.style.display;
    if (window.getComputedStyle(element).display === 'inline') {
        element.style.display = 'inline-block';
    }

    const height = element.clientHeight;

    // Restore the original display value
    element.style.display = originalDisplay;

    return height;
} // getClientHeight

/**
 * Gets the offset width of an HTMLElement, including padding, borders, and vertical scrollbars, but excluding margins.
 * Handles elements with any display type, including inline elements.
 *
 * @param {HTMLElement} element - The HTMLElement to measure.
 * @returns {number} The offset width of the element in pixels.
 */
export function getOffsetWidth(element: HTMLElement): number {
    // Temporarily change display to inline-block to measure width if needed
    const originalDisplay = element.style.display;
    if (window.getComputedStyle(element).display === 'inline') {
        element.style.display = 'inline-block';
    }

    const width = element.offsetWidth;

    // Restore the original display value
    element.style.display = originalDisplay;

    return width;
} // getOffsetWidth

/**
 * Gets the offset height of an HTMLElement, including padding, borders, and horizontal scrollbars, but excluding margins.
 * Handles elements with any display type, including inline elements.
 *
 * @param {HTMLElement} element - The HTMLElement to measure.
 * @returns {number} The offset height of the element in pixels.
 */
export function getOffsetHeight(element: HTMLElement): number {
    // Temporarily change display to inline-block to measure height if needed
    const originalDisplay = element.style.display;
    if (window.getComputedStyle(element).display === 'inline') {
        element.style.display = 'inline-block';
    }

    const height = element.offsetHeight;

    // Restore the original display value
    element.style.display = originalDisplay;

    return height;
} // getOffsetHeight

/**
 * Removes leading forward slashes from a given string.
 *
 * @param {string} input - The string from which to remove leading slashes.
 * @returns {string} - The modified string with leading slashes removed.
 */
export function removeSlashPrefix(input: string): string {
    return input.replace(/^\/+/, "");
}