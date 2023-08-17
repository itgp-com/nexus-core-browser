import {escape} from "lodash";
import {getRandomString, htmlToElement} from "../BaseUtils";
import {getErrorHandler} from '../CoreErrorHandling';
import {N2Dialog} from './ej2/ext/N2Dialog';
import {N2, N2_CLASS} from "./N2";
import {IHtmlUtils, N2HtmlDecorator} from "./N2HtmlDecorator";
import {StateN2} from "./StateN2";

export const tags_no_closing_tag = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];

export type Elem_or_N2<STATE extends StateN2 = any> = HTMLElement | N2<STATE>;

export type Elem_or_N2_or_StateN2<N2_TYPE extends (N2 | StateN2) = any> = HTMLElement | N2_TYPE;

/**
 * Checks if the given object is an N2 object.
 *
 * An N2 object is defined as an object that has the following properties:
 * - className: a non-null, non-undefined string
 * - isN2: a boolean value that is true
 * - state: an object with a ref property that is non-null and non-undefined
 *
 * @param {*} obj - The object to check.
 * @returns {obj is N2} - True if the object is an N2 object, false otherwise.
 */
export function isN2(obj: any): obj is N2 {
    return (
        obj !== null &&
        obj !== undefined &&
        obj.className !== null &&
        obj.className !== undefined &&
        obj.isN2 !== null &&
        obj.isN2 !== undefined &&
        typeof obj.isN2 === 'boolean' &&
        obj.isN2 === true &&
        obj.state !== null &&
        obj.state !== undefined &&
        obj.state.ref !== null &&
        obj.state.ref !== undefined
    );
} // isN2

/**
 * Checks if the given HTML element is an N2 element.
 * An N2 element is defined as an element with a class of 'n2'
 * and a corresponding N2 object attached to it.
 *
 * @param {HTMLElement} elem - The HTML element to check.
 * @returns {boolean} - True if the element is an N2 element, false otherwise.
 */
export function isN2HtmlElement(elem: HTMLElement): boolean {
    if (elem) {
        if (elem.classList.contains(N2_CLASS)) {
            let obj: any = elem[N2_CLASS]
            if (obj && isN2(obj)) {
                return true;
            }  // if obj is N2
        } // if classList contains N2_CLASS
    } // if elem exists
    return false;
}

/**
 * Retrieves the N2 object attached to the given HTML element, if it exists.
 *
 * An N2 object is defined as an object that has the following properties:
 * - className: a non-null, non-undefined string
 * - isN2: a boolean value that is true
 * - state: an object with a ref property that is non-null and non-undefined
 *
 * @param {HTMLElement} elem - The HTML element to retrieve the N2 object from.
 * @returns {N2|null} - The N2 object attached to the element, or null if none exists.
 */
export function getN2FromHtmlElement(elem: HTMLElement): N2 {
    if (elem) {
        if (elem.classList.contains(N2_CLASS)) {
            let obj: any = elem[N2_CLASS]
            if (obj && isN2(obj)) {
                return obj;
            }  // if obj is N2
        } // if classList contains N2_CLASS
    } // if elem exists
    return null;
}

function hasNoClosingHtmlTag(tag: string): boolean {
    if (!tag) return false;
    return tags_no_closing_tag.indexOf(tag.toLowerCase()) >= 0;
}

/**
 * Creates a basic HTML element from the given state.
 * It can only create basic decorator based elements, no wrappers since the base deco does not contain that
 * @param state
 */
export function createN2HtmlBasic<STATE extends StateN2>(state: STATE): HTMLElement {
    state = state || {} as STATE;
    state.deco = IHtmlUtils.init(state.deco);
    let deco: N2HtmlDecorator = state.deco;

    if ( state.siblings || state.prefixSiblings){
        state.wrapper = state.wrapper || {} // there needs to be a wrapper if there are any siblings
    }

    let hasWrapper: boolean = state.wrapper != null;
    let wrapper_deco: N2HtmlDecorator = null;
    let wrapperId: string = null;
    if (hasWrapper)
        wrapper_deco = IHtmlUtils.init(state.wrapper);

    if (!state.noTagIdInHtml && state?.tagId) {
        // if id attribute is generated
        deco.otherAttr['id'] = state.tagId;

        if (hasWrapper) {
            if (state.wrapperTagId) {
                wrapperId = state.wrapperTagId;
            } else {

                if (state.tagId)
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


    let prefixSiblingElems: HTMLElement[] = [];
    if (state.prefixSiblings) {
        let siblings: Elem_or_N2[] = state.prefixSiblings;
        for (let i = 0; i < siblings.length; i++) {
            try {
                let e_or_n: Elem_or_N2 = siblings[i];
                let localElem: HTMLElement;
                if (e_or_n) {
                    if (isN2(e_or_n)) {
                        localElem = e_or_n.htmlElement;
                    } else {
                        localElem = e_or_n as HTMLElement;
                    }
                } // if child
                if (localElem) {
                    prefixSiblingElems.push(localElem);
                }
            } catch (e) {
                console.error(e);
            }
        } //for
    } // if prefixSiblings


    let siblingElems: HTMLElement[] = [];
    if (state.siblings) {
        let siblings: Elem_or_N2[] = state.siblings;
        for (let i = 0; i < siblings.length; i++) {
            try {
                let e_or_n: Elem_or_N2 = siblings[i];
                let localElem: HTMLElement;
                if (e_or_n) {
                    if (isN2(e_or_n)) {
                        localElem = e_or_n.htmlElement;
                    } else {
                        localElem = e_or_n as HTMLElement;
                    }
                } // if child
                if (localElem) {
                    siblingElems.push(localElem);
                }
            } catch (e) {
                console.error(e);
            }
        } //for
    } // if prefixSiblings

    // Now process the children
    if (state.children) {
        let children: Elem_or_N2[] = state.children;
        for (let i = 0; i < children.length; i++) {
            let child: Elem_or_N2 = children[i];
            let childHtmlElement: HTMLElement;
            if (child) {
                if (isN2(child)) {
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


        if ( prefixSiblingElems.length > 0) {
            for (let i = 0; i < prefixSiblingElems.length; i++) {
                htmlElement.appendChild(prefixSiblingElems[i]);
            } // for
        } // if prefixSiblingElems

        htmlElement.appendChild(innerHtmlElement); // place the real anchor inside the wrapper

        if ( siblingElems.length > 0) {
            for (let i = 0; i < siblingElems.length; i++) {
                htmlElement.appendChild(siblingElems[i]);
            } // for
        } // if siblingElems

    } // if hasWrapper

    return htmlElement;
} // createHTMLStandard

/**
 * Creates an HTML element from the decorator passed in.
 * @param decorator
 */
export function createN2HtmlBasicFromDecorator<DECORATOR extends N2HtmlDecorator>(decorator: DECORATOR): HTMLElement {
    decorator = IHtmlUtils.init(decorator) as DECORATOR;

    let x: string = "";
    x += `<${decorator.tag} ${IHtmlUtils.all(decorator)}>`;

    if (!hasNoClosingHtmlTag(decorator.tag)) {
        x += `</${decorator.tag}>`;
    }
    return htmlToElement(x);
} // createHTMLStandardForDecorator


/**
 * Finds the first level of N2 elements within the children of the parent element passed in (excluding it)
 * The first level of N2 elements could be direct children as HTMLElements or be children of the child HTMLElements that are not N2 elements.
 * The child tree is traversed until the first N2 is found or the end of the tree is reached.
 * @param parent the parent HTMLElement or N2 instance whose children to search. It itself is not included in the return list
 * @return the list of HTMLElement containing N2 instances
 */
export function findN2ChildrenElementsFirstLevel(parent: HTMLElement | N2): HTMLElement[] {
    const n2Elements: HTMLElement[] = [];
    if (!parent)
        return n2Elements;

    try {
        const parentElement: HTMLElement = parent instanceof HTMLElement ? parent : parent.htmlElement;

        const firstLevelChildren: HTMLCollection = parentElement.children;
        for (let i = 0; i < firstLevelChildren.length; i++) {
            const firstLevelChild = firstLevelChildren[i]
            if ((firstLevelChild instanceof HTMLElement) && firstLevelChild.classList.contains(N2_CLASS)) {
                // use the child element itself
                n2Elements.push(firstLevelChild as HTMLElement);
            } else {
                // search for _n2_ within the child's descendants
                const n2DescendantElement = firstLevelChild.querySelector(`.class1, .class2 > .class3.${N2_CLASS}`);
                if (n2DescendantElement && n2DescendantElement instanceof HTMLElement) {
                    n2Elements.push(n2DescendantElement);
                } // if (n2DescendantElement && n2DescendantElement instanceof HTMLElement)
            } // if (firstLevelChild instanceof  HTMLElement)
        } // for firstLevelChildren
    } catch (e) {
        console.error(e); // no used feedback
    }

    return n2Elements;
} // findN2ChildrenElementsFirstLevel

/**
 * Finds the first level of N2 elements within the children of the parent element passed in (excluding it)
 * The first level of N2 elements could be direct children as HTMLElements or be children of the child HTMLElements that are not N2 elements.
 * The child tree is traversed until the first N2 is found or the end of the tree is reached.
 * @param parent the parent HTMLElement or N2 instance whose children to search. It itself is not included in the return list
 * @return the list of N2 instances found
 */
export function findN2ChildrenFirstLevel(parent: HTMLElement | N2): N2[] {
    let n2Elements: N2[] = [];
    if (!parent)
        return n2Elements;
    let n2ElementsHtml: HTMLElement[] = findN2ChildrenElementsFirstLevel(parent);
    //traverse and extract the N2_CLASS elements
    for (let i = 0; i < n2ElementsHtml.length; i++) {
        let n2ElementHtml = n2ElementsHtml[i];
        let n2Element: any = n2ElementHtml[N2_CLASS];
        if (n2Element) {
            n2Elements.push(n2Element);
        } // if (n2Element)
    } // for n2ElementsHtml
    return n2Elements;
} // findN2ChildrenFirstLevel

/**
 * Finds N2 containing HTMLElements at any levels within the children of the parent element passed in (excluding it),
 * and continues to search the children in the DOM tree until the end of the tree is reached.
 *
 * HTMLElements containing N2 elements at any level of the DOM tree under the parent are returned in the list.
 *
 * @param parent the parent HTMLElement or N2 instance whose children to search. It itself is not included in the return list
 * @return the list of HTMLElement containing N2 instances
 */
export function findN2ChildrenElementsAllLevels(parent: HTMLElement | N2): HTMLElement[] {
    const n2Elements: HTMLElement[] = [];
    if (!parent)
        return n2Elements;

    try {
        const parentElement: HTMLElement = parent instanceof HTMLElement ? parent : parent.htmlElement;


        const childElements = parentElement.children;

        for (let i = 0; i < childElements.length; i++) {
            const childElement = childElements[i];

            if (childElement && childElement instanceof HTMLElement) {
                if (childElement.classList.contains('_n2_')) {
                    // use the current element if it has _n2_ class
                    n2Elements.push(childElement);
                }

                // recursively call findAllN2Elements for each child element
                const childN2Elements = findN2ChildrenElementsAllLevels(childElement);
                // add childN2Elements to n2Elements
                n2Elements.push(...childN2Elements);
            } // if ( childElement && childElement instanceof HTMLElement)
        } // for childElements
    } catch (e) {
        console.error(e); // no used feedback
    }

    return n2Elements;
} // findN2ChildrenElementsAllLevels

/**
 * Finds N2 instances at any levels within the children of the parent element passed in (excluding it),
 * and continues to search the children in the DOM tree until the end of the tree is reached.
 *
 * N2 instances at any level of the DOM tree under the parent are returned in the list.
 *
 * @param parent the parent HTMLElement or N2 widget whose children to search. It itself is not included in the return list
 * @return the list of N2 instances
 */
export function findN2ChildrenAllLevels(parent: HTMLElement | N2): N2[] {
    let n2Elements: N2[] = [];
    if (!parent)
        return n2Elements;
    let n2ElementsHtml: HTMLElement[] = findN2ChildrenElementsAllLevels(parent);
    //traverse and extract the N2_CLASS elements
    for (let i = 0; i < n2ElementsHtml.length; i++) {
        let n2ElementHtml = n2ElementsHtml[i];
        let n2Element = n2ElementHtml[N2_CLASS];
        if (n2Element) {
            n2Elements.push(n2Element);
        } // if (n2Element)
    } // for n2ElementsHtml
    return n2Elements;
} // findN2ChildrenAllLevels


export function addN2Child(child: N2, parent: Elem_or_N2): boolean {
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
} // addN2Child

export function removeN2Child(child: N2, parent: Elem_or_N2): boolean {
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
} // removeN2Child

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
} // getFirstHTMLElementChild


/**
 * Finds the first parent of an existing HTMLElement with the specified class name.
 * @param {HTMLElement} current - The current HTMLElement from which the search will start.
 * @param {string} className - The class name to search for in the parent elements.
 * @returns {HTMLElement | null} The found parent HTMLElement or null if not found.
 */
export function findParentHTMLElement(current: HTMLElement, className: string): HTMLElement | null {
    let parent = current.parentElement;

    while (parent !== null) {
        if (parent.classList.contains(className)) {
            return parent;
        }
        parent = parent.parentElement;
    }

    return null;
}

/**
 * Finds the first parent N2 dialog from the current HTMLElement or N2 component.
 * @param {HTMLElement | N2} current - The current HTMLElement or N2 component from which the search will start.
 * @returns {N2 | null} The found parent N2 dialog or null if not found.
 */
export function findParentN2Dialog<T extends N2Dialog = N2Dialog>(current: HTMLElement | N2) : T {
    if (!current) return null;
    let htmlElement = current instanceof HTMLElement ? current : current.htmlElement;
    let parentElement = findParentHTMLElement(htmlElement, 'N2EjDialog');
    if ( parentElement ) {
        let parent =  getN2FromHtmlElement(parentElement);
        if (parent)
            return parent as T;
    }
    return null;
}

/**
 * Finds the parent N2 element by a specified class name.
 *
 * @template T - A type that extends N2, representing the expected return type.
 * @param {HTMLElement | N2} current - The current HTML element or N2 instance to start the search from.
 * @param {string} n2ClassName - The class name to search for in the parent elements.
 * @returns {T | null} The parent N2 element matching the specified class name, or null if not found.
 */
export function findParentN2ByClass<T extends N2 = N2>(current: HTMLElement | N2, n2ClassName:string) : T {
    if (!current) return null;
    if ( !n2ClassName ) return null;
    let htmlElement = current instanceof HTMLElement ? current : current.htmlElement;
    let parentElement = findParentHTMLElement(htmlElement, n2ClassName);
    if ( parentElement ) {
        let parent =  getN2FromHtmlElement(parentElement);
        if (parent)
            return parent as T;
    }
    return null;
}

/**
 * Finds an HTMLInputElement within the given HTMLElement or N2 object.
 *
 * The function first checks if the provided `current` object is an HTMLInputElement with a matching ID (or `tagId` if `current` is an N2 object).
 * If not, it searches for an element with the specified ID within the `current` object.
 * If no matching element is found, it returns the first input element within the `current` object.
 *
 * @param {HTMLElement | N2} current - The current HTML element or N2 instance to start the search from.
 * @returns {HTMLInputElement | null} The HTMLInputElement that matches the specified criteria, or null if no matching element is found.
 * @export
 */
export function findHtmlInputElement(current: HTMLElement | N2,): HTMLInputElement {
    if (!current) return null;
    let elemInput: HTMLInputElement;
    let elem:HTMLElement =  current instanceof HTMLElement ? current : current.htmlElement;
    let tagId:string = current instanceof HTMLElement ? current.id : current.state.tagId;
    if ( elem.id == tagId && elem instanceof  HTMLInputElement) {
        // only if it's also an HTMLInputElement, not just if tagId matches
        elemInput = elem;
    } else {
        // search by tagId next
        if ( tagId) {
            let possibleInput = elem.querySelector(`#${tagId}`);
            if (possibleInput instanceof HTMLInputElement) {
                elemInput = possibleInput;
            }
        } // if tagId

        if ( !elemInput ) {
            // any input will do
            elem = elem.querySelector('input');
            if (elem)
                elemInput = elem as HTMLInputElement;
        } // if !elemInput
    } // if elem.id == this.state.tagId && elem instanceof  HTMLInputElement
    return elemInput;
} // findHtmlInputElement