import * as CSS from 'csstype';
import {isString} from 'lodash';

const defaultStyleId = 'NexusCoreCSS';


/**
 * Allows the style to be either a hardcoded string or an object that translates to read kebab-case CSS that (**NOT** the JS camelCase)
 */
export type CssStyle = CSS.PropertiesHyphen;


/**
 * Adds CSS content to a specified or default style element.
 *
 * @param {string} cssContent - The CSS content to be added.
 * @param {string} [styleId] - The ID of the style element to add the CSS content to. If not specified, the default style element '___nexus_default_style___' is used.
 * @param {boolean} [removePrevious=false] - If true and a styleId is provided, any existing style element with the same ID will be removed before adding the new CSS content. This helps to avoid duplicates and ensures that the new content is added cleanly.
 * @returns {void}
 */
export function cssAdd(cssContent: string, styleId?: string, removePrevious?:boolean): void {
    if (!cssContent) {
        console.error("cssAdd function was passed an empty cssContent parameter!");
        return;
    }
    if ( styleId && removePrevious )
        cssRemove(styleId); // remove any existing style element with the same id to avoid duplicates and ensure the new content is added cleanly

    let styleElement: HTMLStyleElement | null;
    if ( !styleId)
        styleId = defaultStyleId;

    if (styleId) {
        // Find or create the style element with the specified id
        styleElement = document.getElementById(styleId) as HTMLStyleElement;
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            styleElement.setAttribute('data-nexus-css-add', 'true');
            document.head.appendChild(styleElement);
        } else {
            styleElement.setAttribute('data-nexus-css-add', 'true');
        }
    }
    // Append the CSS content to the specified or default style element
    styleElement.textContent += cssContent;
} // end cssAdd

/**
 * Removes a style element that was previously added with cssAdd().
 *
 * @param {string} [styleId] - The ID of the style element to remove. If not specified, the default style element '___nexus_default_style___' is used.
 * @returns {boolean} - Returns true if the style element was successfully removed, otherwise false.
 */
export function cssRemove(styleId?: string): boolean {
    if (!styleId)
        styleId = defaultStyleId;

    const styleElement = document.getElementById(styleId);
    if (styleElement && styleElement.getAttribute('data-nexus-css-add') === 'true') {
        styleElement.remove();
        return true;
    }

    return false;
} // end cssRemove

//---------------------------- start CSS global variables definition ------------------------
export interface CssVariables {
    [key: string]: string;
}

/**
 * Sets and/or Updates (overwrites) CSS variables on the :root element.
 *
 * @param variables - An object containing CSS variable names and their current values.
 */
export function cssSetRootVariables(variables: CssVariables): void {
    const root = document.documentElement;
    Object.entries(variables).forEach(([key, value]) => {
        const cssVarName = `--${key.replace(/_/g, '-')}`;
        root.style.setProperty(cssVarName, value);
    });
}

export function cssSetRootVariable(variableName: string, value: string): void {
    const cssVarName = `--${variableName.replace(/_/g, '-')}`;
    document.documentElement.style.setProperty(cssVarName, value);
}


/**
 * Function to set a CSS variable on a specified selector
 *
 * Examples of Use
 *
 * Example 1 - Setting a variable on a class:
 *```typescript
 * cssSetElementVariable('.example-class', 'main-bg-color', 'cyan');
 * ```
 *
 * Example 2 - Setting a variable on an ID:
 *
 *```typescript
 * cssSetElementVariable('#example-id', 'main-text-color', 'magenta');
 * ```
 *
 * Example 3 - Setting a variable on a complex selector:
 *
 * ```typescript
 * cssSetElementVariable('body.dark-mode .content', 'link-color', 'yellow');
 * ```
 *the prefix '--' is automatically added and '_' is replaced with '-'.
 */
export function cssSetElementVariable(element_or_selector: string | Element | Element[], variableName: string, value: string): void {
    // Access elements by selector
    let elements:Element[];
    if (typeof element_or_selector === 'string') {
        elements = Array.from(document.querySelectorAll(element_or_selector));
    } else if (element_or_selector instanceof Element) {
        elements = [element_or_selector];
    } else if (Array.isArray(element_or_selector)) {
        elements = element_or_selector;
    } else {
        elements = [];
    }

    const cssVarName = `--${variableName.replace(/_/g, '-')}`;
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        // Set the CSS variable for each element
        (element as HTMLElement).style.setProperty(cssVarName, value);
    } // for
} // cssSetSelectorVariable

/**
 * Gets the current value of a CSS variable.
 *
 * @param variableName - The name of the CSS variable (without the leading '--').
 * @returns The current value of the CSS variable, or an empty string if not found.
 */
export function cssGetRootVariableValue(variableName: string): string {
    const cssVarName = `--${variableName.replace(/_/g, '-')}`;
    return getComputedStyle(document.documentElement).getPropertyValue(cssVarName).trim();
}
/**
 * Gets the current value of a CSS variable from one or more elements.
 *
 * @param element_or_selector - The element or selector to get the CSS variable value from.
 * @param variableName - The name of the CSS variable (without the leading '--').
 * @returns The current value of the CSS variable, or an empty string if not found.
 */
export function cssGetElementVariableValue(element_or_selector: string | Element | Element[], variableName: string): string {
    let element:Element | null;
    if (typeof element_or_selector === 'string') {
        element = document.querySelector(element_or_selector);
    } else if (element_or_selector instanceof Element) {
        element = element_or_selector;
    } else {
        element = null;
    }

    const cssVarName = `--${variableName.replace(/_/g, '-')}`;
    if (element) {
        return getComputedStyle(element).getPropertyValue(cssVarName).trim();
    } else {
        return '';
    }
} // cssGetElementVariableValue

/**
 * Removes a CSS variable from the :root element.
 * @param {string} variableName - The name of the CSS variable (without the leading '--').
 */
export function cssRemoveRootVariable(variableName: string): void {
    const cssVarName = `--${variableName.replace(/_/g, '-')}`;
    document.documentElement.style.removeProperty(cssVarName);
}

/**
 * Removes a CSS variable from one or more elements.
 * @param {string | Element | Element[]} element_or_selector - The element or selector to remove the CSS variable from.
 * @param {string} variableName - The name of the CSS variable (without the leading '--').
 */
export function cssRemoveElementVariable(element_or_selector: string | Element | Element[], variableName: string): void {
    let elements:Element[];
    if (typeof element_or_selector === 'string') {
        elements = Array.from(document.querySelectorAll(element_or_selector));
    } else if (element_or_selector instanceof Element) {
        elements = [element_or_selector];
    } else if (Array.isArray(element_or_selector)) {
        elements = element_or_selector;
    } else {
        elements = [];
    }

    const cssVarName = `--${variableName.replace(/_/g, '-')}`;
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        // Remove the CSS variable for each element
        (element as HTMLElement).style.removeProperty(cssVarName);
    } // for
} // cssRemoveElementVariable


let cachedStyle: HTMLStyleElement;
let ruleMap: Map<string, number> = new Map<string, number>();



/**
 * Dynamically adds an @media query to the cached stylesheet.
 * Use {@link cssRemoveQuery} to remove the media query.
 *
 * **Example usage:**
 * ```typescript
 * cssAddMediaQuery('@media (min-width: 992px)', `
 *     .o-main-title-row-right {
 *         align-items: center;
 *         gap: 15px;
 *     }
 * `);
 * ```
 *
 * @param {string} cssQuery
 * @param {string} rules
 */
export function cssAddQuery(cssQuery: string, rules: string): void {
    const styleSheet = document.createElement('style');
    document.head.appendChild(styleSheet);
    styleSheet.appendChild(document.createTextNode(`${cssQuery} { ${rules} }`));
} // cssAddQuery
/**
 * Remove a @media or other @query (ex: @keyframes) rule from the existing CSS
 *
 * Use {@link cssAddQuery} to add a  query.
 *
 * Example:
 *  ```typescript
 * cssRemoveQuery('@media (min-width: 992px)', '.o-main-title-row-right');
 * ```
 *
 * @param {string} cssQuery the query string to find the selector under
 * @param {string} selector the selector to remove
 */
function cssRemoveQuery(cssQuery: string, selector: string): void {
    const styleSheets = Array.from(document.styleSheets) as CSSStyleSheet[];
    for (const sheet of styleSheets) {
        for (const rule of Array.from(sheet.cssRules)) {
            if (rule.constructor.name === 'CSSMediaRule' && (rule as CSSMediaRule).media.mediaText === cssQuery) {
                const mediaRule = rule as CSSMediaRule;
                const index = Array.from(mediaRule.cssRules).findIndex(r =>
                    r.constructor.name === 'CSSStyleRule' && (r as CSSStyleRule).selectorText === selector
                );
                if (index !== -1) {
                    mediaRule.deleteRule(index);
                }
            }
        }
    }
} // cssRemoveQuery
/**
 * Adds or overwrites a rule within a media query
 *
 * Alternative to using {@link cssAddQuery} and {@link cssRemoveQuery}
 *
 * **Example Usages:**
 *
 * Add a media query rule
 * ```typescript
 * manageMediaQuery('@media (min-width: 992px)', '.o-main-title-row-right', 'align-items: center; gap: 15px;', false);
 *```
 *
 * Overwrite the same rule
 * ```typescript
 * manageMediaQuery('@media (min-width: 992px)', '.o-main-title-row-right', 'align-items: flex-start; gap: 10px;', true);
 * ```
 */
function cssManageQuery(cssquery: string, selector: string, rules: string, overwrite: boolean): void {
    const styleSheets = Array.from(document.styleSheets) as CSSStyleSheet[];
    let mediaStyleSheet: CSSStyleSheet | undefined;
    let mediaRule: CSSMediaRule | undefined;

    // Find existing media query
    for (const sheet of styleSheets) {
        for (const rule of Array.from(sheet.cssRules)) {
            if (rule.constructor.name === 'CSSMediaRule' && (rule as CSSMediaRule).media.mediaText === cssquery) {
                mediaStyleSheet = sheet;
                mediaRule = rule as CSSMediaRule;
                break;
            }
        }
        if (mediaRule) break;
    }

    // Create a new media rule if it does not exist
    if (!mediaRule && !overwrite) {
        const styleSheet = document.createElement('style');
        document.head.appendChild(styleSheet);
        mediaStyleSheet = styleSheet.sheet as CSSStyleSheet;
        mediaStyleSheet.insertRule(`${cssquery} {}`, mediaStyleSheet.cssRules.length);
        mediaRule = mediaStyleSheet.cssRules[mediaStyleSheet.cssRules.length - 1] as CSSMediaRule;
    }

    if (mediaRule) {
        const index = Array.from(mediaRule.cssRules).findIndex(rule =>
            (rule.constructor.name === 'CSSStyleRule' && (rule as CSSStyleRule).selectorText === selector)
        );

        if (index !== -1 && overwrite) {
            mediaRule.deleteRule(index);
        }

        mediaRule.insertRule(`${selector} { ${rules} }`, mediaRule.cssRules.length);
    }
}

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


//---------------------------- end CSS global variables definition ------------------------
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
export function cssStyleToString(cssStyle: CssStyle | string | CssLikeObject, cssDelimiter: string = ''): string {
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