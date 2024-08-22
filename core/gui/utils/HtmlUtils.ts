import DOMPurify from 'dompurify';
import {escape, isArray, throttle} from "lodash";
import {Props} from "tippy.js";
import {getRandomString, voidFunction} from "../../BaseUtils";
import {htmlElement_addTooltip_CoreOnly} from "../../CoreUtils";
import {highlighted_grid_cell_content, isRecFieldVal, RecFieldVal} from '../../gui2/highlight/N2Highlight';
import {nexusMain} from "../../NexusMain";


export let htmlElement_html_link = (elem: HTMLElement, cellValue: string|RecFieldVal, linkValue: string) => {
    if (elem) {
        let wrapper_highlight: HTMLElement;

        let realLinkValue = linkValue;
        if (realLinkValue == null)
            realLinkValue = ''

        let visualValue:string; // default to the cellValue like it's a string
        if ( isRecFieldVal(cellValue)) {
            visualValue = cellValue.value_visible;
            if( cellValue.is_highlighted) {
                wrapper_highlight = highlighted_grid_cell_content(); // create a wrapper for the highlighted content classes
            }
        } else {
            visualValue = cellValue as string;
        }

       let innerHTML = `<a href="${realLinkValue}" >${visualValue}</a>`;
        if ( wrapper_highlight) {
            wrapper_highlight.innerHTML = DOMPurify.sanitize(innerHTML);
            elem.innerHTML = '';
            elem.appendChild(wrapper_highlight);
        } else {
            elem.innerHTML = DOMPurify.sanitize(innerHTML);
        }
        let a_elem = elem.querySelector('a');
        a_elem.setAttribute('target', '_blank'); // DOMPurify would remove the target attribute so we add it here
        a_elem.setAttribute('rel', 'noopener noreferrer'); // noopener gives no back access to original window object, noreferrer prevents the current page from showing as the referrer in the opened page
    }
}



export let htmlElement_link_clickFunction = (elem: HTMLElement, clickFunction: (evt: any) => (void | Promise<void>), options ?: { throttle_disable?: boolean, throttle_wait_ms?: number }) => {
    if (!elem)
        return;

    let original = elem.innerHTML
    if (original) {
// Example of an href the takes no action:<a href="#" onclick="return false;">
        elem.innerHTML = `<a href="#" onclick="return false;">${original}</a>`;
        elem.addEventListener('click', async (evt) => {

            let opt = options || {};
            let throttle_disable = opt.throttle_disable || false;
            let throttle_wait_ms = opt.throttle_wait_ms || 2000;

            let f_click = () => {
                // if it's a rowcell, change the focus from the <a> tag to the grid before doing anything else
                if (elem.classList.contains('e-rowcell')) {
                    let grid = elem.closest('.e-grid') as HTMLElement
                    if (grid) {
                        grid.focus();
                    }
                }
                setTimeout(() => {
                    clickFunction.call(this, evt);
                }, 50);
            }

            let f_throttle_click = throttle(
                f_click,
                throttle_wait_ms,
                {
                    leading: true, // leading: true allows the function to be called immediately on the first trigger within the wait period.
                    trailing: false // trailing: false prevents the function from being called at the end of the wait period as a result of calls that occurred during the wait.
                }
            );
            if (throttle_disable) {
                f_click();
            } else {
                f_throttle_click();
            }
        });
    }
}

export interface Options_htmlElement_link_clickFunction {
    /**
     * Defaults to 'pointer'
     */
    cursor?: string,
    /**
     * Defaults to '#2174af'
     */
    color?: string,
    throttle_disable?: boolean,
    throttle_wait_ms?: number
}

/**
 * This function is used to add a click function to an html element as well as turn the cursor into a pointer while hovering
 * and change the color of the text so it's identifiable as a link.
 *
 * @param elem
 * @param clickFunction
 * @param options change the pointer style and/or the color of the text
 */
export function htmlElement_clickFunction(
    elem: HTMLElement,
    clickFunction: (evt: any) => (void | Promise<void>),
    options ?: Options_htmlElement_link_clickFunction
) {
    if (!elem)
        return;

    options = options || {};

    let opt = options || {};
    let throttle_disable = opt.throttle_disable || false;
    let throttle_wait_ms = opt.throttle_wait_ms || 2000;
    let f_click = () => {
        let original = elem.innerHTML
        if (original) {
            Object.assign(elem.style, {
                cursor: options.cursor || 'pointer',
                color: options.color || '#2174af' // Bootstrap link blue '#0d6efd' / an alt more gray blue '#2174af')
            });
            elem.addEventListener('click', clickFunction);
        }
    }


    let f_throttle_click = throttle(
        f_click,
        throttle_wait_ms,
        {
            leading: true, // leading: true allows the function to be called immediately on the first trigger within the wait period.
            trailing: false // trailing: false prevents the function from being called at the end of the wait period as a result of calls that occurred during the wait.
        });
    if (throttle_disable) {
        f_click();
    } else {
        f_throttle_click();
    }


} // htmlElement_clickFunction

export function appendDivToPage(): string {

    try {
        let id = getRandomString('div');
        let divElem: HTMLDivElement = document.createElement('div');
        divElem.id = id;

        let inserted = null;
        let lastElem = document.getElementById(nexusMain.ui.lastUITagID);
        if (lastElem)
            inserted = lastElem.parentNode?.insertBefore(divElem, lastElem);
        return (inserted ? id : null);

    } catch (ex) {
        console.log(ex);
        return null;
    }
}

export function removeHTMLfromPage(id: string): boolean {
    let success = false;
    try {
        let element = document.getElementById(id);
        if (element) {
            let removedElement = element.parentNode.removeChild(element);
            success = (removedElement != null); // success true if removed element found
        }
    } catch (ex) {
        console.log(ex);
    }
    return success;
}

/**
 * Find the highest z-index on the Page
 * From: https://bobbyhadz.com/blog/javascript-find-highest-z-index-on-page
 *
 * Overlapping div-layers example at https://www.mygreatname.com/css-div-tutorials/how-to-overlapping-div-layers.html
 */
export function getMaxZIndex() {
    return Math.max(
        ...Array.from(document.querySelectorAll('body *'), el =>
            parseFloat(window.getComputedStyle(el).zIndex),
        ).filter(zIndex => !Number.isNaN(zIndex)),
        0,
    );
} // getMaxZIndex

export class WxSizedHtmlElement {
    htmlElement: HTMLElement;
    htmlElementId: string;
    offsetHeight: number;
    offsetWidth: number;
    clientWidth: number;
    clientHeight: number;
    scrollWidth: number;
    scrollHeight: number;
    boundingClientRect: DOMRect;
} // WxSizedHtmlElement
/**
 * Take a HTMLElement fragment that IS NOT part of the DOM, initialize any JS, size it and return it and all the size info
 * @param htmlElement
 * @param initFunctions
 */
export async function sizeHtmlElementFragment(
    htmlElement: HTMLElement,
    initFunctions: { initNodeFunctions: voidFunction | voidFunction[] },
    childProcessesSemaphore ?: Promise<any>,
    childProcesses ?: { childProcesses: voidFunction | voidFunction[] },
): Promise<WxSizedHtmlElement> {
    let wx: WxSizedHtmlElement = new WxSizedHtmlElement()

    let visibility = htmlElement.style.visibility;
    let position = htmlElement.style.position;
    let top = htmlElement.style.top;
    let left = htmlElement.style.left;

    htmlElement.style.visibility = 'hidden';
    htmlElement.style.position = 'absolute';
    htmlElement.style.top = '0px';
    htmlElement.style.left = '0px';

    let body: HTMLBodyElement = document.getElementsByTagName('body')[0];
    body.appendChild(htmlElement);

    //--------------------------------------------------------------------------------


    if (initFunctions) {
        let fArray: voidFunction[] = null;
        if (isArray(initFunctions.initNodeFunctions)) {
            fArray = initFunctions.initNodeFunctions;
        } else {
            fArray = [initFunctions.initNodeFunctions];
        } // if - else


        // now the child is in the DOM, but invisible. Time to run the initDiagramFunctions before getting a size
        for (let i = 0; i < fArray.length; i++) {
            const f = fArray[i];
            try {
                await f(); // use this context
            } catch (e) {
                console.error(e);
            }
        } // for
    } // if initDiagramFunctions

    if (childProcessesSemaphore) {
        await childProcessesSemaphore;

        let fArray: voidFunction[] = null;
        if (isArray(childProcesses.childProcesses)) {
            fArray = childProcesses.childProcesses;
        } else {
            fArray = [childProcesses.childProcesses];
        } // if - else
        for (let i = 0; i < fArray.length; i++) {
            const f = fArray[i];
            try {
                await f(); // use this context
            } catch (e) {
                console.error(e);
            }
        } // for

    } // if childProcessesSemaphore


    //--------------------------------------------------------------------------------

    wx.htmlElement = htmlElement;
    wx.htmlElementId = htmlElement.id;
    wx.offsetHeight = htmlElement.offsetHeight;
    wx.offsetWidth = htmlElement.offsetWidth;
    wx.clientHeight = htmlElement.clientHeight;
    wx.clientWidth = htmlElement.clientWidth;
    wx.scrollHeight = htmlElement.scrollHeight;
    wx.scrollWidth = htmlElement.scrollWidth;
    wx.boundingClientRect = htmlElement.getBoundingClientRect();


    body.removeChild(htmlElement);

    htmlElement.style.visibility = visibility;
    htmlElement.style.position = position;
    htmlElement.style.top = top;
    htmlElement.style.left = left;

    return wx;
}

export class Args_SkinnyTooltip {
    htmlElement: HTMLElement;
    text: string | RecFieldVal;
    maxWidth: number;
    tippyProps ?: Partial<Props>;
    /**
     * Superseedes the 'text' when opening the dialog
     * @type {string | HTMLElement}
     */
    htmlForDialog ?: string;
}

export function skinnyHtmlElementTooltip(args: Args_SkinnyTooltip): string {

    let htmlElement: HTMLElement = args.htmlElement;
    let text: string | RecFieldVal = args.text;
    let maxWidth: number = args.maxWidth || 40;
    let tippyProps: Partial<Props> = args.tippyProps || {};

    let isHTML = false;
    let content:string;
    if ( isRecFieldVal(text)) {
        if ( text.is_highlighted ) {
            content = text.value_visible;
            isHTML = true;
        } else {
            content = escape(text.value); // same as text.value_visible actually
        }
    } else {
        content = escape(text);
    }


    let retVal = content;
    if (content) {
        if (countDisplayableCharacters(content) > maxWidth - 2) {
            let cell = htmlElement as HTMLElement

            htmlElement_addTooltip_CoreOnly(cell, {
                ...tippyProps,
                content: content, // escape(text),   // overwrite the content no matter what
            });

            if( isHTML) {
                retVal = truncateHtml(content, maxWidth) + '..';
                cell.innerHTML = retVal;
            } else {
                retVal = content.substring(0, (maxWidth - 1)) + '..';
                cell.innerText = retVal;
            }

        } // if (text.length > 80)
    } //if (text)
    return retVal;
} // skinnyHtmlElementWithTooltipOverflow

/**
 * Truncates an HTML string without breaking tags.
 *
 * This function ensures that the HTML string is truncated to a specified length
 * without cutting off in the middle of a tag. It also appends ellipsis (`..`)
 * if the string is truncated and closes any open tags properly.
 *
 * @param {string} html - The HTML string to be truncated.
 * @param {number} maxLength - The maximum length of the text content.
 * @returns {string} - The truncated HTML string with tags properly closed.
 */
export function truncateHtml(html: string, maxLength: number): string {
    let truncated = '';
    let inTag = false;
    let currentLength = 0;
    const tags = [];

    for (let i = 0; i < html.length; i++) {
        const char = html[i];

        if (char === '<') {
            inTag = true;
            const tagMatch = html.slice(i).match(/^<\/?[\w\s="/.':;#-\/\?]+>/);
            if (tagMatch) {
                const tag = tagMatch[0];
                truncated += tag;
                i += tag.length - 1;

                if (!tag.startsWith('</')) {
                    const tagName = tag.match(/<\s*([a-zA-Z0-9]+)/)?.[1];
                    if (tagName) tags.push(tagName);
                } else {
                    tags.pop();
                }

                continue;
            }
        }

        if (char === '>') {
            inTag = false;
            continue;
        }

        if (!inTag) {
            if (currentLength < maxLength) {
                truncated += char;
                currentLength++;
            } else {
                while (tags.length > 0) {
                    truncated += `</${tags.pop()}>`;
                }
                truncated += '..';
                break;
            }
        } else {
            truncated += char;
        }
    }

    return truncated;
} // truncateHtml

/**
 * Counts the displayable characters in an HTML string, excluding tags and their contents.
 *
 * This function iterates through an HTML string and counts only the characters that are
 * part of the displayable text, ignoring tags and their contents.
 *
 * @param {string} html - The HTML string to be analyzed.
 * @returns {number} - The count of displayable characters in the HTML string.
 */
export function countDisplayableCharacters(html: string): number {
    let inTag = false;
    let displayableLength = 0;

    for (let i = 0; i < html.length; i++) {
        const char = html[i];

        if (char === '<') {
            inTag = true;
        } else if (char === '>') {
            inTag = false;
        } else if (!inTag) {
            displayableLength++;
        }
    }

    return displayableLength;
}