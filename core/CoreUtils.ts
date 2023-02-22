/// <reference path="./global.d.ts" />
import {Component} from "@syncfusion/ej2-base";
import {DataManager, Query} from "@syncfusion/ej2-data";
import * as CSS from 'csstype';
import {isArray, isString} from "lodash";
import {tModel, urlTableEj2} from "./AppPathUtils";
import {IArgs_HtmlDecoration, IKeyValueString} from "./BaseUtils";
import {getErrorHandler} from "./CoreErrorHandling";
import {EJList} from "./data/Ej2Comm";
import {CssStyle} from "./gui/AbstractWidget";
import {NexusAdaptor} from "./data/NexusAdaptor";
import tippy, {Props, roundArrow} from "tippy.js";

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

Array.prototype.insert = function (index: number, ...items: any) {
    //return this.splice(index, 0, item);
    return [
        ...this.slice(0, index),
        ...items,
        ...this.slice(index)
    ];
};
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


export function showEx(ex: Error): Error {
    getErrorHandler().displayExceptionToUser(ex);
    return ex;
}

// noinspection JSUnusedGlobalSymbols
export function isVisible(elem: HTMLElement): boolean {
    return (!!elem &&
        !!(elem.offsetWidth ||
            elem.offsetHeight ||
            elem.getClientRects().length
        )
    ); // source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
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


//--------------------------

// runScripts based on code from https://ghinda.net/article/script-tags/
/* helpers for runScripts below
 */

// runs an array of async functions in sequential order
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

// trigger DOMContentLoaded
function scriptsDone() {
    const DOMContentLoadedEvent = document.createEvent('Event');
    DOMContentLoadedEvent.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(DOMContentLoadedEvent)
}

/* script runner
 */

function insertScript($script: any, callback: any) {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    if ($script.src) {
        s.onload = callback;
        s.onerror = callback;
        s.src = $script.src
    } else {
        s.textContent = $script.innerText
    }

    // re-insert the script tag so it executes.
    document.head.appendChild(s);

    // clean-up
    $script.parentNode.removeChild($script);

    // run the callback immediately for inline scripts
    if (!$script.src) {
        callback()
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

String.prototype.capitalize = function (): string {
    return this.charAt(0).toUpperCase() + this.slice(1)
};

//---------------------------


// noinspection JSUnusedGlobalSymbols
/**
 * Remove all children of  HTMLElement or of an element ID
 * @param element can be either an HTMLElement or the string element ID
 */
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

class RGB {
    r: number;
    g: number;
    b: number;
}

function rgbToYIQ(rgb: RGB) {
    return ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
}

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

export interface Ej2QueryOptions {
    adaptor?: NexusAdaptor;
}

/**
 * Query the appserver (using ej2 syntax) and return back an array of records
 * @param tablename
 * @param query
 * @param options
 */
export async function ej2Query(tablename: string, query: Query, options?: Ej2QueryOptions): Promise<any[]> {
    let dataManager = new DataManager({
        url: urlTableEj2(tablename),
        adaptor: (options?.adaptor ? options.adaptor : new NexusAdaptor()),
        crossDomain: true
    });

    return  new Promise((resolve, reject) => {
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
        console.log(ex);
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
        console.log(ex);
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
                        console.log(ex);
                    }
                } // if key
            } // for
        } //if (htmlOtherAttr )
    } catch (ex) {
        console.log(ex);
    }

} // applyHtmlDecoration

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
 * Add a class with a body under to the document css.
 * It will overwrite an existing class if it exists.
 * Example: cssAddClass('whatever',"background-color: green;");
 * @param className
 * @param rules
 */
export function cssAddClass(className: string, rules: string | CssLikeObject) {

    while (className.startsWith('.') || className.startsWith(' ')) {
        className = className.substr(1); // eliminate starting periods and spaces
    }

    className = `.${className}`;
    return cssAddSelector(className, rules);
} // cssAddClass


/**
 * Removes the first instance of the class from the document css
 * Example : cssRemoveClass('whatever')
 * @param className
 */
export function cssRemoveClass(className: string): boolean {
    return cssRemoveSelector(className);
} // cssRemoveClass


/**
 * Add a css selector with a body under to the document css.
 * It will overwrite an existing class if it exists.
 * Example: cssAddSelector_O1('whatever',"background-color: green;");
 * @param cssSelectorName
 * @param rules
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

    let classArray: cssRule[];
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
        // First, remove the class if it already exists
        let removed = cssRemoveClass(cssSelectorName);
        if (removed)
            ruleMap.delete(cssSelectorName);
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
    } // for cssRule

} // cssAddSelector

/**
 ------Exists in CORE----
 * @param cssSelectorName
 */
export function cssRemoveSelector(cssSelectorName: string): boolean {
    let removed: boolean = false;
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

export class cssRule {
    className: string;
    body: string;
}

// https://yyjhao.com/posts/roll-your-own-css-in-js/
export function cssNestedDeclarationToRuleStrings(rootClassName: string, declaration: CssLikeObject): cssRule[] {
    const result: cssRule[] = [];

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
            // collect the top level css rules
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
 *
 * @param cssStyle either a string of css or a CssPropertiesHyphen object
 * @param cssDelimiter - default is '' (no delimiter between css rules)
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
                // collect the top level css rules
                lines.push(`${prop}:${(<any>cssProps)[prop]};`);
            }
            style = lines.join(cssDelimiter); // no spaces needed
        } // if cssStyle is string
    } // if cssStyle

    return style;
} //cssStyleToString


/**
 *
 * @param value true if the object looks like a Promise (has a then function)
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