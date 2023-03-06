import {isArray, isEmpty} from "lodash";
import {IKeyValueString} from "../BaseUtils";
import {cssStyleToString} from "../CoreUtils";
import {CssStyle} from "../gui/AbstractWidget";
import {StateNx2} from "./StateNx2";

export interface Nx2HtmlDecorator {
    /**
     * the tag type of the HTMLElement
     */
    tag?: string;
    /**
     * the classes assigned to this HTMLElement
     */
    classes?: string[];

    /**
     * the style assigned to this HTMLElement
     */
    style?: CssStyle;

    /**
     * other attributes assigned to this HTMLElement
     */
    otherAttr?: IKeyValueString;

    /**
     * Any string that belongs inside this tab. If this string is actually HTML, it should really be added as <link>Nx2Html</link> children of the widget.
     */
    text?: string;
    /**
     * set to true to escape the text before adding it to the HTML
     */
    escapeText?: boolean;

} // end of Nx2HtmlDecorator


export class IHtmlUtils {

    static initDecorator(state: StateNx2) {
        state.deco = IHtmlUtils.init(state.deco);
    }

    /**
     * Initializes the decorator with default values.
     * If the original decorator is null, a new one is created.
     * @param decorator
     */
    static init(decorator: Nx2HtmlDecorator): Nx2HtmlDecorator {
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

    static class(decorator: Nx2HtmlDecorator): string {
        decorator = IHtmlUtils.init(decorator);
        let c: string = '';
        if (decorator.classes.length > 0)
            c = ` class="${decorator.classes.join(' ')}"`;
        return c;
    }

    static style(decorator: Nx2HtmlDecorator): string {
        decorator = IHtmlUtils.init(decorator);
        let htmlTagStyle = '';
        if (decorator.style && !isEmpty(decorator.style))
            htmlTagStyle = ` style="${cssStyleToString(decorator.style)}"`;
        return htmlTagStyle;
    }

    static otherAttr(decorator: Nx2HtmlDecorator): string {
        decorator = IHtmlUtils.init(decorator);
        let otherAttrArray = Object.entries(decorator.otherAttr);
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

    static all(decorator: Nx2HtmlDecorator): string {
        return `${IHtmlUtils.class(decorator)}${IHtmlUtils.style(decorator)}${IHtmlUtils.otherAttr(decorator)}`;
    }


} // end of IHtmlUtils

/**
 * Append classes to classes in Nx2HtmlDecorator.
 *
 * Duplicates will not be allowed
 * @param args the arguments passed to the widget
 * @param additionalClasses
 */
export function addNx2Class(args: Nx2HtmlDecorator, additionalClasses: (string | string[])): Nx2HtmlDecorator {
    args = IHtmlUtils.init(args);

    if (!additionalClasses)
        return args;

    let classList: string[] = args.classes;

    // at this point we have an array of classes (or an empty array)
    if (isArray(additionalClasses)) {
        let classInstanceArray: string[] = additionalClasses;
        for (let i = 0; i < classInstanceArray.length; i++) {
            const classInstanceArrayElement = classInstanceArray[i];
            if (classInstanceArrayElement) {
                if ((classList as string[]).indexOf(classInstanceArrayElement) < 0)
                    classList.push(classInstanceArrayElement);
            }
        } // for
    } else {
        if ((classList as string[]).indexOf(additionalClasses) < 0)
            classList.push(additionalClasses);

    }
    args.classes = classList;
    return args;
} // addWidgetClass