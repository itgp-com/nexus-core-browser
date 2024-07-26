import * as _ from "lodash";
import {IKeyValueString} from "../BaseUtils";

import {CssStyle, cssStyleToString} from '../CssUtils';
import {StateN2} from "./StateN2";


export interface N2HtmlDecorator<STATE extends StateN2 = StateN2> {
    /**
     * the tag type of the HTMLElement
     */
    tag?: string;
    /**
     * the classes assigned to this HTMLElement
     */
    classes?: string | string[];

    /**
     * the style assigned to this HTMLElement (can be CssStyle or string as of 3.9.9)
     */
    style?: CssStyle | string;

    /**
     * other attributes assigned to this HTMLElement
     */
    otherAttr?: IKeyValueString;

    /**
     * Any string that belongs inside this tab. If this string is actually HTML, it should really be added as <link>N2Html</link> children of the widget.
     */
    text?: string;
    /**
     * set to true to escape the text before adding it to the HTML
     */
    escapeText?: boolean;

    /**
     * N2 component state (if any)
     */
    state?: STATE;

} // end of N2HtmlDecorator


export class IHtmlUtils {

    /**
     * Initializes an N2HtmlDecorator object for a given StateN2 object.
     * Assigns the decorator to the state object and stamps the state in the decorator.
     *
     * @static
     * @param {StateN2} state - The StateN2 object to initialize the N2HtmlDecorator for.
     */
    static initForN2(state: StateN2) {
        if (!state)
            return;
        let deco: N2HtmlDecorator = state.deco;
        state.deco = IHtmlUtils.init(deco); // if state.deco was null, it is now initialized
        state.deco.state = state; // stamp the state in the decorator
    }

    /**
     * Initializes an N2HtmlDecorator object with default values if not already set.
     * Sets the tag to 'div', initializes empty class list, style object, and other attributes object.
     *
     * @static
     * @param {N2HtmlDecorator} decorator - The N2HtmlDecorator object to initialize.
     * @returns {N2HtmlDecorator} - The initialized N2HtmlDecorator object with default values set if needed.
     */
    static init(decorator: N2HtmlDecorator): N2HtmlDecorator {
        if (!decorator)
            decorator = {};
        if (!decorator.tag)
            decorator.tag = 'div';// default to 'div'
        if (!decorator.classes)
            decorator.classes = [];
        if (!decorator.style)
            decorator.style = {};
        if (!decorator.otherAttr)
            decorator.otherAttr = {};
        return decorator;
    } //init

    /**
     * Generates a class attribute string with the class list from the given N2HtmlDecorator object.
     * Initializes the decorator if necessary and concatenates its class list into a single string.
     *
     * @static
     * @param {N2HtmlDecorator} decorator - The N2HtmlDecorator object containing the class list.
     * @returns {string} - The generated class attribute string, or an empty string if no classes are present.
     */
    static class(decorator: N2HtmlDecorator): string {
        decorator = IHtmlUtils.init(decorator);
        let c: string = '';
        if ( decorator?.classes) {
            let classes = decorator.classes;
            let classArray = (decorator?.classes ? Array.isArray(decorator.classes) ? decorator.classes : [decorator.classes] : [])
            if (classArray.length > 0)
                c = `class="${classArray.join(' ')}"`; // no space prefix
        }
        return c; // no space prefix
    }

    /**
     * Generates a style attribute string with the style properties from the given N2HtmlDecorator object.
     * Initializes the decorator if necessary and converts its style object into a single string.
     *
     * @static
     * @param {N2HtmlDecorator} decorator - The N2HtmlDecorator object containing the style properties.
     * @returns {string} - The generated style attribute string, or an empty string if no style properties are present.
     */
    static style(decorator: N2HtmlDecorator): string {
        decorator = IHtmlUtils.init(decorator);
        let htmlTagStyle = '';
        if (decorator.style) {
            if (typeof decorator.style === 'string') {
                const normalizedStyle = decorator.style.replace(/\s+/g, ' ').trim();
                htmlTagStyle = `style="${normalizedStyle}"`;
            } else if (!_.isEmpty(decorator.style)) {
                htmlTagStyle = `style="${cssStyleToString(decorator.style)}"`;
            }
        }
        return htmlTagStyle;
    }

    /**
     * Generates a string with other attributes from the given N2HtmlDecorator object.
     * Initializes the decorator if necessary and concatenates its other attributes into a single string.
     *
     * @static
     * @param {N2HtmlDecorator} decorator - The N2HtmlDecorator object containing the other attributes.
     * @returns {string} - The generated other attributes string, or an empty string if no other attributes are present.
     */
    static otherAttr(decorator: N2HtmlDecorator): string {
        decorator = IHtmlUtils.init(decorator);
        let otherAttrArray = Object.entries(decorator.otherAttr);
        let htmlAttrs: string = '';
        if (decorator.otherAttr) {
            otherAttrArray.forEach(entry => {
                let key = entry[0];
                let value = entry[1];
                //use key and value here
                let spacer:string = (htmlAttrs.length > 0 ? ' ' : '');
                if (value == null) {
                    htmlAttrs += `${spacer}${key}` // attributes like 'required' that don't have an equal something after the name
                } else {
                    htmlAttrs += `${spacer}${key}="${_.escape(value)}"`;
                }
            });
        }

        return htmlAttrs;
    }

    /**
     * Generates a single string containing class, style, and other attributes from the given N2HtmlDecorator object.
     * Initializes the decorator if necessary and concatenates its class, style, and other attributes into a single string.
     *
     * @static
     * @param {N2HtmlDecorator} decorator - The N2HtmlDecorator object containing the class, style, and other attributes.
     * @returns {string} - The generated string with class, style, and other attributes, or an empty string if no attributes are present.
     */
    static all(decorator: N2HtmlDecorator): string {
        let classStr = IHtmlUtils.class(decorator);
        let styleStr = IHtmlUtils.style(decorator);
        let otherAttrStr = IHtmlUtils.otherAttr(decorator);

        let x = `${classStr}`;

        if (styleStr.length > 0){
            if (x.length > 0)
                x += ' ';
            x += styleStr;
        }

        if (otherAttrStr.length > 0){
            if (x.length > 0)
                x += ' ';
            x += otherAttrStr;
        }
        return x; // no space prefix
        //return `${IHtmlUtils.class(decorator)}${IHtmlUtils.style(decorator)}${IHtmlUtils.otherAttr(decorator)}`;
    }


} // end of IHtmlUtils

/**
 * Adds specified classes to the given N2HtmlDecorator object's class list.
 * If the associated widget is initialized, the HTML element's class list will also be updated.
 *
 * @param {N2HtmlDecorator} args - The N2HtmlDecorator object containing the class list to update.
 * @param {(string | string[])} additionalClasses - The class or classes to add to the class list.
 * @returns {N2HtmlDecorator} - The updated N2HtmlDecorator object with the specified classes added.
 */
export function addN2Class(args: N2HtmlDecorator, ...additionalClasses: string[]): N2HtmlDecorator {
    args = IHtmlUtils.init(args);

    if (!additionalClasses)
        return args;

    let classes = args?.classes;
    let classArray = (classes ? Array.isArray(classes) ? classes : [classes] : [])


    args.classes = addClassesToClassList(classArray, additionalClasses);

    if (args?.state?.ref?.widget?.initialized) {
        // synchronize classes here with htmlElement if initialized
        // if not initialized, the classes will be synchronized automatically when the widget is initialized
        let htmlElement = args.state.ref.widget.htmlElement;
        addClassesToElement(htmlElement, args.classes);
    } // if args.state.ref.widget.initialized
    return args;
} // addN2Class

/**
 * Removes specified classes from the given N2HtmlDecorator object's class list.
 * If the associated widget is initialized, the HTML element's class list will also be updated.
 *
 * @param {N2HtmlDecorator} args - The N2HtmlDecorator object containing the class list to update.
 * @param {(string | string[])} classesToRemove - The class or classes to remove from the class list.
 * @returns {N2HtmlDecorator} - The updated N2HtmlDecorator object with the specified classes removed.
 */
export function removeN2Class(args:N2HtmlDecorator, ...classesToRemove: string[]): N2HtmlDecorator {

    args = IHtmlUtils.init(args);

    if (!classesToRemove)
        return args;

    let classArray = (args?.classes ? Array.isArray(args.classes) ? args.classes : [args.classes] : []);
    args.classes = removeClassesFromClassList(classArray, classesToRemove);

    if (args?.state?.ref?.widget?.initialized) {
        // synchronize classes here with htmlElement if initialized
        // if not initialized, the classes will be synchronized automatically when the widget is initialized
        let htmlElement = args.state.ref.widget.htmlElement;
        removeClassesFromElement(htmlElement, args.classes);
    } // if args.state.ref.widget.initialized

    return args;
} // removeN2Class

// Extend applyCssToElement to handle CssStyle or string
export function applyCssToElement(element: HTMLElement, css: CssStyle | string): void {
    if (typeof css === 'string') {
        const styles = parseCssString(css);
        Object.keys(styles).forEach(property => {
            element.style.setProperty(property, styles[property]);
        });
    } else {
        Object.keys(css).forEach(property => {
            element.style.setProperty(property, (css as any)[property]);
        });
    }
}



/**
 * Adds one or more classes to a class list and ensures there are no duplicates
 * @param {string[]} classList original class list (will be modified if it exists, or created as [] if null)
 * @param {string | string[]} additionalClasses
 * @return {string[]} original class list with additional classes added, or new class list if original was null
 */
export function addClassesToClassList(classList: string[] | null, additionalClasses: string | string[] | null): string[] {
    classList = classList || [];
    additionalClasses = additionalClasses || [];

    if (!Array.isArray(additionalClasses)) {
        additionalClasses = [additionalClasses];
    }

    additionalClasses.forEach(classInstance => {
        if (classInstance && !classList.includes(classInstance)) {
            classList.push(classInstance);
        }
    });

    return classList;
}


/**
 * Removes all classes in the `classesToRemove` parameter from the `classList` array.
 *
 * @param {string[] | null | undefined} classList - The array of classes to remove from.
 * @param {(string | string[])=} classesToRemove - The class(es) to remove from the `classList` array.
 * @returns {string[]} The resulting array of classes after removal.
 */
export function removeClassesFromClassList(classList: string[] | null | undefined, classesToRemove: (string | string[]) = []): string[] {
    if (!classList) {
        return []; // handle null/undefined classList
    }

    const classesToRemoveArray = Array.isArray(classesToRemove) ? classesToRemove : (classesToRemove ? [classesToRemove] : []);
    return classList.filter(className => !classesToRemoveArray.includes(className));
} // removeClassesFromClassList

/**
 * Adds the specified class(es) to the given HTML element's class list, without duplicating any existing classes.
 *
 * @param {HTMLElement} htmlElement - The HTML element to add classes to.
 * @param {string | string[]} classNames - The class(es) to add to the element.
 * @returns {void}
 */
export function addClassesToElement(htmlElement: HTMLElement | null | undefined, classNames: string | string[] | null | undefined): void {
    if (!htmlElement) {
        return; // handle null/undefined htmlElement
    }

    const classList = htmlElement.classList;
    const classesToAdd = Array.isArray(classNames) ? classNames : (classNames ? [classNames] : []);

    for (const className of classesToAdd) {
        if (className && !classList.contains(className)) { // handle null/undefined classNames
            classList.add(className);
        }
    }
} // addClassesToElement

/**
 * Removes the specified class(es) from the given HTML element's class list.
 *
 * @param {HTMLElement | null | undefined} htmlElement - The HTML element to remove classes from.
 * @param {string | string[]} classNames - The class(es) to remove from the element.
 * @returns {void}
 */
export function removeClassesFromElement(htmlElement: HTMLElement | null | undefined, classNames: string | string[]): void {
    if (!htmlElement) {
        return; // handle null/undefined htmlElement
    }

    const classList = htmlElement.classList;
    const classesToRemove = Array.isArray(classNames) ? classNames : [classNames]; // convert single class string to array if needed

    classesToRemove.forEach(className => {
        if (classList.contains(className)) {
            classList.remove(className);
        }
    });
}

/**
 * Transfers classes, style, and other attributes from the source N2HtmlDecorator to the target HTMLElement.
 * Optionally, changes the tag type of the target HTMLElement.
 *
 * @param {N2HtmlDecorator} source - The source N2HtmlDecorator instance from which to transfer the attributes.
 * @param {HTMLElement} target - The target HTMLElement to which the attributes will be transferred.
 * @param {string=} changeTagType - The new tag type to change the target HTMLElement. If specified and different from the source tag type, the function will replace the target element with a new element of the specified tag type.
 * @returns {void}
 */
export function decoToHtmlElement(source: N2HtmlDecorator, target: HTMLElement, changeTagType?: string): void {
    if (!source || !target) {
        return;
    }

    // Transfer classes
    let classArray = source.classes ? (Array.isArray(source.classes) ? source.classes : [source.classes]) : [];
    if (classArray.length > 0) {
        target.classList.add(...classArray);
    }

    // Transfer style
    if (source.style) {
        if (typeof source.style === 'string') {
            const styles = parseCssString(source.style);
            Object.keys(styles).forEach(property => {
                target.style.setProperty(property, styles[property]);
            });
        } else {
            Object.assign(target.style, source.style);
        }
    }

    // Transfer other attributes
    if (source.otherAttr) {
        for (const [attrName, attrValue] of Object.entries(source.otherAttr)) {
            target.setAttribute(attrName, attrValue);
        }
    }
} // decoToHtmlElement

/**
 * Parses a CSS string into an object.
 *
 * This utility function takes a CSS string, typically containing multiple CSS declarations,
 * and converts it into an object where each key is a CSS property and each value is the corresponding CSS value.
 * It handles comments and trims whitespace from properties and values.
 *
 * @param {string} css - The CSS string to be parsed.
 * @returns {Record<string, string>} - An object representing the CSS properties and values.
 *
 * @example
 * const cssString = "min-width: 20px; height: 20px;";
 * const styleObject = parseCssString(cssString);
 * console.log(styleObject); // { min-width: '20px', height: '20px' }
 */
export function parseCssString(css: string): Record<string, string> {
    const styleObject: Record<string, string> = {};
    const declarations = css.split(';')
        .map(decl => decl.trim())
        .filter(decl => decl.length > 0 && !decl.startsWith('/*') && !decl.endsWith('*/'));

    declarations.forEach(declaration => {
        const [property, value] = declaration.split(':').map(part => part.trim());
        if (property && value) {
            styleObject[property] = value;
        }
    });

    return styleObject;
} // parseCssString

/**
 * Merges two styles into one.
 *
 * This function takes two styles, which can be either CSS strings or `CssStyle` objects,
 * and merges them into a single style. If either style is a string, the merged style is returned as a string.
 * Otherwise, it returns the merged `CssStyle` object.
 *
 * @param {CssStyle | string} style1 - The first style to be merged.
 * @param {CssStyle | string} style2 - The second style to be merged.
 * @returns {CssStyle | string} - The merged style, in the same format as the input styles.
 *
 * @example
 * const style1 = "min-width: 20px; height: 20px;";
 * const style2 = { width: "30px", height: "40px" };
 * const mergedStyle = decoMergeStyles(style1, style2);
 * console.log(mergedStyle); // "min-width: 20px; height: 40px; width: 30px;"
 */
export  function decoMergeStyles(style1: CssStyle | string, style2: CssStyle | string): CssStyle | string {
    let styleObj1: Record<string, string> = {};
    let styleObj2: Record<string, string> = {};

    // Convert style1 to an object if it's a string
    if (typeof style1 === 'string') {
        styleObj1 = parseCssString(style1);
    } else {
        styleObj1 = convertCssStyleToStringMap(style1);
    }

    // Convert style2 to an object if it's a string
    if (typeof style2 === 'string') {
        styleObj2 = parseCssString(style2);
    } else {
        styleObj2 = convertCssStyleToStringMap(style2);
    }

    // Merge the two style objects
    const mergedStyleObj = { ...styleObj1, ...styleObj2 };

    // Return the merged styles in the appropriate format
    if (typeof style1 === 'string' || typeof style2 === 'string') {
        return Object.entries(mergedStyleObj)
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ');
    } else {
        return mergedStyleObj;
    }
}

function convertCssStyleToStringMap(cssStyle: CssStyle): Record<string, string> {
    const styleMap: Record<string, string> = {};
    Object.keys(cssStyle).forEach(key => {
        const value = (cssStyle as any)[key];
        styleMap[key] = typeof value === 'string' ? value : String(value);
    });
    return styleMap;
}

function toCamelCase(property: string): string {
    return property.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * Transforms a style into a `CssStyle` object.
 *
 * This function takes a style, which can be either a CSS string or a `CssStyle` object,
 * and converts it into a `CssStyle` object. It handles both hyphenated and camelCase property names.
 *
 * @param {CssStyle | string} style - The style to be converted.
 * @returns {CssStyle} - The converted `CssStyle` object.
 *
 * @example
 * const style1 = "min-width: 20px; height: 20px;";
 * const cssStyle1 = decoToCssStyle(style1);
 * console.log(cssStyle1); // { minWidth: '20px', height: '20px' }
 *
 * const style2 = { minWidth: "20px", height: "20px" };
 * const cssStyle2 = decoToCssStyle(style2);
 * console.log(cssStyle2); // { minWidth: '20px', height: '20px' }
 */
export function decoToCssStyle(style: CssStyle | string): CssStyle {
    const cssStyle: CssStyle = {};

    if (typeof style === 'string') {
        const parsedStyle = parseCssString(style);
        Object.keys(parsedStyle).forEach(key => {
            const camelCaseKey = toCamelCase(key);
            (cssStyle as any)[camelCaseKey] = parsedStyle[key];
        });
    } else {
        // Directly return the original CssStyle object
        return style;
    }

    return cssStyle;
} // decoToCssStyle