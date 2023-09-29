import {isEmpty} from "lodash";
import {IKeyValueString} from "../BaseUtils";
import {cssStyleToString} from "../CoreUtils";
import {CssStyle} from "../gui/AbstractWidget";
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
     * the style assigned to this HTMLElement
     */
    style?: CssStyle;

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
                c = ` class="${classArray.join(' ')}"`;
        }
        return c;
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
        if (decorator.style && !isEmpty(decorator.style))
            htmlTagStyle = ` style="${cssStyleToString(decorator.style)}"`;
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
        let otherAttrArray = Object.entries(decorator.otherAttr as any);
        let htmlAttrs: string = (otherAttrArray.length > 0 ? ' ' : '');
        if (decorator.otherAttr) {
            otherAttrArray.forEach(entry => {
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

    /**
     * Generates a single string containing class, style, and other attributes from the given N2HtmlDecorator object.
     * Initializes the decorator if necessary and concatenates its class, style, and other attributes into a single string.
     *
     * @static
     * @param {N2HtmlDecorator} decorator - The N2HtmlDecorator object containing the class, style, and other attributes.
     * @returns {string} - The generated string with class, style, and other attributes, or an empty string if no attributes are present.
     */
    static all(decorator: N2HtmlDecorator): string {
        return `${IHtmlUtils.class(decorator)}${IHtmlUtils.style(decorator)}${IHtmlUtils.otherAttr(decorator)}`;
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
    let classArray = (source.classes ? Array.isArray(source.classes) ? source.classes : [source.classes]: []);
    if (classArray && classArray.length > 0) {
        target.classList.add(...classArray);
    }

    // Transfer style
    if (source.style) {
        Object.assign(target.style, source.style);
    }

    // Transfer other attributes as attributes
    if (source.otherAttr) {
        for (const [attrName, attrValue] of Object.entries(source.otherAttr)) {
            target.setAttribute(attrName, attrValue);
        }
    }
} // transferN2HtmlDecorator