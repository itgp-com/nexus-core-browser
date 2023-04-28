import {escape} from "lodash";
import {getRandomString, htmlToElement} from "../BaseUtils";
import {getErrorHandler} from '../CoreErrorHandling';
import {Nx2, NX2_CLASS} from "./Nx2";
import {IHtmlUtils, Nx2HtmlDecorator} from "./Nx2HtmlDecorator";
import {StateNx2} from "./StateNx2";

export const tags_no_closing_tag = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];

export type Elem_or_Nx2<STATE extends StateNx2 = any> = HTMLElement | Nx2<STATE>;

export type Elem_or_Nx2_or_StateNx2<NX2_TYPE extends (Nx2 | StateNx2) = any> = HTMLElement | NX2_TYPE;

/**
 * Checks if the given object is of type Nx2
 * @param obj
 * @return {obj is Nx2}
 */
export function isNx2(obj: any): obj is Nx2 {
    return (
        obj !== null &&
        obj !== undefined &&
        obj.className !== null &&
        obj.className !== undefined &&
        obj.isNx2 !== null &&
        obj.isNx2 !== undefined &&
        typeof obj.isNx2 === 'boolean' &&
        obj.isNx2 === true &&
        obj.state !== null &&
        obj.state !== undefined &&
        obj.state.ref !== null &&
        obj.state.ref !== undefined
    );
} // isNx2

function hasNoClosingHtmlTag(tag: string): boolean {
    if (!tag) return false;
    return tags_no_closing_tag.indexOf(tag.toLowerCase()) >= 0;
}

/**
 * Creates a basic HTML element from the given state.
 * It can only create basic decorator based elements, no wrappers since the base deco does not contain that
 * @param state
 */
export function createNx2HtmlBasic<STATE extends StateNx2>(state: STATE): HTMLElement {
    state = state || {} as STATE;
    state.deco = IHtmlUtils.init(state.deco);
    let deco: Nx2HtmlDecorator = state.deco;

    let hasWrapper: boolean = state.wrapper != null;
    let wrapper_deco: Nx2HtmlDecorator = null;
    let wrapperId: string = null;
    if (hasWrapper)
        wrapper_deco = IHtmlUtils.init(state.wrapper);

    if (!state.noTagIdInHtml && state?.tagId) {
        // if id attribute is generated
        deco.otherAttr['id'] = state.tagId;

        if (hasWrapper) {
            if ( state.wrapperTagId){
                wrapperId = state.wrapperTagId;
            } else {

                if ( state.tagId)
                    state.wrapperTagId = state.tagId + '_wrapper';
                 else
                    state.wrapperTagId = getRandomString(this._className + '_wrapper');


                 state.wrapperTagId = wrapperId;
            }
            wrapper_deco.otherAttr['id'] = wrapperId;
        }
    } // if tagId


    let x: string = "";
    x += `<${deco.tag} ${IHtmlUtils.all(deco)}>`;
    if (deco.text) {
        let value: string = deco.text;
        if (deco.escapeText)
            value = escape(value);
        x += value;
    }
    if (!hasNoClosingHtmlTag(deco.tag))
        x += `</${deco.tag}>`;

    let htmlElement: HTMLElement = htmlToElement(x);

    // Now process the children
    if (state.children) {
        let children: Elem_or_Nx2[] = state.children;
        for (let i = 0; i < children.length; i++) {
            let child: Elem_or_Nx2 = children[i];
            let childHtmlElement: HTMLElement;
            if (child) {
                if (isNx2(child)) {
                    childHtmlElement = child.htmlElement;
                } else {
                    childHtmlElement = child as HTMLElement;
                }
            } // if child

            if (childHtmlElement) {
                htmlElement.appendChild(childHtmlElement);
            }
        } // for children
    } // if (state.children)


    if (hasWrapper) {
        let innerHtmlElement: HTMLElement = htmlElement;

        let wrap_x: string = "";
        wrap_x += `<${wrapper_deco.tag} ${IHtmlUtils.all(wrapper_deco)}>`;
        if (wrapper_deco.text) {
            let value: string = wrapper_deco.text;
            if (wrapper_deco.escapeText)
                value = escape(value);
            wrap_x += value;
        }
        if (!hasNoClosingHtmlTag(wrapper_deco.tag))
            wrap_x += `</${wrapper_deco.tag}>`;

        htmlElement = htmlToElement(wrap_x); // replace the htmlElement with the wrapper
        htmlElement.appendChild(innerHtmlElement); // place the real anchor inside the wrapper
    } // if hasWrapper

    return htmlElement;
} // createHTMLStandard

/**
 * Creates an HTML element from the decorator passed in.
 * @param decorator
 */
export function createNx2HtmlBasicFromDecorator<DECORATOR extends Nx2HtmlDecorator>(decorator: DECORATOR): HTMLElement {
    decorator = IHtmlUtils.init(decorator) as DECORATOR;

    let x: string = "";
    x += `<${decorator.tag} ${IHtmlUtils.all(decorator)}>`;

    if (!hasNoClosingHtmlTag(decorator.tag)) {
        x += `</${decorator.tag}>`;
    }
    return htmlToElement(x);
} // createHTMLStandardForDecorator


/**
 * Finds the first level of Nx2 elements within the children of the parent element passed in (excluding it)
 * The first level of Nx2 elements could be direct children as HTMLElements or be children of the child HTMLElements that are not Nx2 elements.
 * The child tree is traversed until the first Nx2 is found or the end of the tree is reached.
 * @param parent the parent HTMLElement or Nx2 instance whose children to search. It itself is not included in the return list
 * @return the list of HTMLElement containing Nx2 instances
 */
export function findNx2ChildrenElementsFirstLevel(parent: HTMLElement | Nx2): HTMLElement[] {
    const nx2Elements: HTMLElement[] = [];
    if (!parent)
        return nx2Elements;

    try {
        const parentElement: HTMLElement = parent instanceof HTMLElement ? parent : parent.htmlElement;

        const firstLevelChildren: HTMLCollection = parentElement.children;
        for (let i = 0; i < firstLevelChildren.length; i++) {
            const firstLevelChild = firstLevelChildren[i]
            if ((firstLevelChild instanceof HTMLElement) && firstLevelChild.classList.contains(NX2_CLASS)) {
                // use the child element itself
                nx2Elements.push(firstLevelChild as HTMLElement);
            } else {
                // search for _nx2_ within the child's descendants
                const nx2DescendantElement = firstLevelChild.querySelector('.class1, .class2 > .class3._nx2_');
                if (nx2DescendantElement && nx2DescendantElement instanceof HTMLElement) {
                    nx2Elements.push(nx2DescendantElement);
                } // if (nx2DescendantElement && nx2DescendantElement instanceof HTMLElement)
            } // if (firstLevelChild instanceof  HTMLElement)
        } // for firstLevelChildren
    } catch (e) {
        console.error(e); // no used feedback
    }

    return nx2Elements;
} // findNx2ChildrenElementsFirstLevel

/**
 * Finds the first level of Nx2 elements within the children of the parent element passed in (excluding it)
 * The first level of Nx2 elements could be direct children as HTMLElements or be children of the child HTMLElements that are not Nx2 elements.
 * The child tree is traversed until the first Nx2 is found or the end of the tree is reached.
 * @param parent the parent HTMLElement or Nx2 instance whose children to search. It itself is not included in the return list
 * @return the list of Nx2 instances found
 */
export function findNx2ChildrenFirstLevel(parent: HTMLElement | Nx2): Nx2[] {
    let nx2Elements: Nx2[] = [];
    if (!parent)
        return nx2Elements;
    let nx2ElementsHtml: HTMLElement[] = findNx2ChildrenElementsFirstLevel(parent);
    //traverse and extract the NX2_CLASS elements
    for (let i = 0; i < nx2ElementsHtml.length; i++) {
        let nx2ElementHtml = nx2ElementsHtml[i];
        let nx2Element = nx2ElementHtml[NX2_CLASS];
        if (nx2Element) {
            nx2Elements.push(nx2Element);
        } // if (nx2Element)
    } // for nx2ElementsHtml
    return nx2Elements;
} // findNx2ChildrenFirstLevel

/**
 * Finds Nx2 containing HTMLElements at any levels within the children of the parent element passed in (excluding it),
 * and continues to search the children in the DOM tree until the end of the tree is reached.
 *
 * HTMLElements containing Nx2 elements at any level of the DOM tree under the parent are returned in the list.
 *
 * @param parent the parent HTMLElement or Nx2 instance whose children to search. It itself is not included in the return list
 * @return the list of HTMLElement containing Nx2 instances
 */
export function findNx2ChildrenElementsAllLevels(parent: HTMLElement | Nx2): HTMLElement[] {
    const nx2Elements: HTMLElement[] = [];
    if (!parent)
        return nx2Elements;

    try {
        const parentElement: HTMLElement = parent instanceof HTMLElement ? parent : parent.htmlElement;


        const childElements = parentElement.children;

        for (let i = 0; i < childElements.length; i++) {
            const childElement = childElements[i];

            if (childElement && childElement instanceof HTMLElement) {
                if (childElement.classList.contains('_nx2_')) {
                    // use the current element if it has _nx2_ class
                    nx2Elements.push(childElement);
                }

                // recursively call findAllNx2Elements for each child element
                const childNx2Elements = findNx2ChildrenElementsAllLevels(childElement);
                // add childNx2Elements to nx2Elements
                nx2Elements.push(...childNx2Elements);
            } // if ( childElement && childElement instanceof HTMLElement)
        } // for childElements
    } catch (e) {
        console.error(e); // no used feedback
    }

    return nx2Elements;
} // findNx2ChildrenElementsAllLevels

/**
 * Finds Nx2 instances at any levels within the children of the parent element passed in (excluding it),
 * and continues to search the children in the DOM tree until the end of the tree is reached.
 *
 * Nx2 instances at any level of the DOM tree under the parent are returned in the list.
 *
 * @param parent the parent HTMLElement or Nx2 widget whose children to search. It itself is not included in the return list
 * @return the list of Nx2 instances
 */
export function findNx2ChildrenAllLevels(parent: HTMLElement | Nx2): Nx2[] {
    let nx2Elements: Nx2[] = [];
    if (!parent)
        return nx2Elements;
    let nx2ElementsHtml: HTMLElement[] = findNx2ChildrenElementsAllLevels(parent);
    //traverse and extract the NX2_CLASS elements
    for (let i = 0; i < nx2ElementsHtml.length; i++) {
        let nx2ElementHtml = nx2ElementsHtml[i];
        let nx2Element = nx2ElementHtml[NX2_CLASS];
        if (nx2Element) {
            nx2Elements.push(nx2Element);
        } // if (nx2Element)
    } // for nx2ElementsHtml
    return nx2Elements;
} // findNx2ChildrenAllLevels


export function addNx2Child(child: Nx2, parent: Elem_or_Nx2): boolean {
    if (!child) return false;
    if (!parent) return false;


    try {
        if (!child.initialized)
            child.initLogic();


        let parentHtmlElement = (parent instanceof HTMLElement ? parent : parent.htmlElement);
        if (parentHtmlElement) {
            parentHtmlElement.appendChild(child.htmlElement);
            return true;
        }
    } catch (ex) {
        getErrorHandler().displayExceptionToUser(ex);
    }

    return false;
} // addNx2Child

export function removeNx2Child(child: Nx2, parent: Elem_or_Nx2): boolean {
    if (!child) return false;
    if (!parent) return false;
    try {
        let parentHtmlElement = (parent instanceof HTMLElement ? parent : parent.htmlElement);
        let childHtmlElementV1 = child.htmlElement;
        if (childHtmlElementV1 && parentHtmlElement) {
            const childElement: HTMLElement | null = parentHtmlElement.querySelector(`#${childHtmlElementV1.id}`);

            if (childElement !== null) {
                childElement.parentNode?.removeChild(childElement);
                return true;
            }
        }
    } catch (ex) {
        console.error(ex, parent, child);
    }
    return false;
} // removeNx2Child

/**
 * Safely retrieves the first HTMLElement child of a given parent HTMLElement instance.
 * Returns null if the parent is null or no HTMLElement child is found.
 *
 * @param {HTMLElement | null} parent - The parent HTMLElement instance or null.
 * @returns {HTMLElement | null} The first HTMLElement child, or null if not found.
 */
export function getFirstHTMLElementChild(parent: HTMLElement | null): HTMLElement | null {
    if (!parent) {
        return null;
    }

    for (let i = 0; i < parent.children.length; i++) {
        const child = parent.children.item(i);
        if (child instanceof HTMLElement) {
            return child;
        }
    }

    return null;
}