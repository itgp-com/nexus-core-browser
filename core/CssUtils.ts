import * as CSS from 'csstype';
import {isString} from 'lodash';
import {getErrorHandler} from './CoreErrorHandling';

const defaultStyleId = '___nexus_default_style___';


/**
 * Allows the style to be either a hardcoded string or an object that translates to read kebab-case CSS that (**NOT** the JS camelCase)
 */
export type CssStyle = CSS.PropertiesHyphen;


/**
 * Adds CSS content to a specified or default style element.
 *
 * @param {string} cssContent - The CSS content to be added.
 * @param {string} [styleId] - The ID of the style element to add the CSS content to. If not specified, the default style element '___nexus_default_style___' is used.
 * @returns {void}
 */
export function cssAdd(cssContent: string, styleId?: string): void {
    if (!cssContent) {
        console.error("cssAdd function was passed an empty cssContent parameter!");
        return;
    }

    let styleElement: HTMLStyleElement | null;
    if ( !styleId)
        styleId = defaultStyleId;

    if (styleId) {
        // Find or create the style element with the specified id
        styleElement = document.getElementById(styleId) as HTMLStyleElement;
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
    }
    // Append the CSS content to the specified or default style element
    styleElement.textContent += cssContent;
} // end cssAdd

/**
 * Removes a CSS selector from a specified or default style element ('___nexus_default_style___').
 *
 * @param {string} cssSelector - The CSS selector to be removed.
 * @param {string} [styleId] - The ID of the style element to remove the CSS selector from. If not specified, the default style element is checked first, and then all other styles are traversed.
 * @returns {boolean} - Returns true if the selector was successfully removed, otherwise false.
 */
export function cssRemove(cssSelector: string, styleId?: string): boolean {
    if (!cssSelector) {
        console.error("cssRemoveSelector function was passed an empty cssSelector parameter!");
        return false;
    }

    const removeRule = (styleElement: HTMLStyleElement): boolean => {
        if (!styleElement.sheet) return false;

        const rules = styleElement.sheet.cssRules;
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i] as CSSStyleRule;
            if (rule.selectorText === cssSelector) {
                styleElement.sheet.deleteRule(i);
                return true;
            }
        }
        return false;
    };

    if (styleId) {
        const styleElement = document.getElementById(styleId) as HTMLStyleElement;
        if (styleElement && removeRule(styleElement)) {
            return true;
        }
    } else {
        const defaultStyleElement = document.getElementById(defaultStyleId) as HTMLStyleElement;
        if (defaultStyleElement && removeRule(defaultStyleElement)) {
            return true;
        }
    }

    // Traverse all style elements if not found in the specified or default style element
    const styleElements = document.getElementsByTagName('style');
    for (let i = 0; i < styleElements.length; i++) {
        const styleElement = styleElements[i];
        if (styleElement.id !== styleId && styleElement.id !== defaultStyleId) {
            if (removeRule(styleElement as HTMLStyleElement)) {
                return true;
            }
        }
    }

    console.warn(`cssRemove: Selector ${cssSelector} not found in any style element.`);
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
function cssNestedDeclarationToRuleStrings(rootClassName: string, declaration: CssLikeObject): CssRule[] {
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