import {Props} from "tippy.js";
import {getRandomString, voidFunction} from "../../BaseUtils";
import {nexusMain} from "../../NexusMain";
import {escape, isArray} from "lodash";
import {htmlElement_addTooltip_CoreOnly} from "../../CoreUtils";


export let htmlElement_html_link = (elem: HTMLElement, cellValue: string, linkValue: string) => {
   if (elem)
      elem.innerHTML = `<a href="${linkValue}" target="_blank" >${cellValue}</a>`;
}

export let htmlElement_link_clickFunction = (elem: HTMLElement, clickFunction: (evt: any) => (void | Promise<void>)) => {
   if (!elem)
      return;

   let original = elem.innerHTML
   if (original) {
// Example of an href the takes no action:<a href="#" onclick="return false;">
      elem.innerHTML = `<a href="#" onclick="return false;">${original}</a>`;
      elem.addEventListener('click', async (evt) => {
         // if it's a rowcell, change the focus from the <a> tag to the grid before doing anything else
         if (elem.classList.contains('e-rowcell')) {
            let grid = elem.closest('.e-grid') as HTMLElement
            if (grid) {
               grid.focus();
            }
         }
         setTimeout(() => {
            clickFunction(evt);
         }, 50);
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

   let original = elem.innerHTML
   if (original) {
      Object.assign(elem.style, {
         cursor: options.cursor || 'pointer' ,
         color: options.color || '#2174af' // Bootstrap link blue '#0d6efd' / an alt more gray blue '#2174af')
      });
      elem.addEventListener('click', clickFunction);
   }
}

export function appendDivToPage(): string {

   try {
      let id                      = getRandomString('div');
      let divElem: HTMLDivElement = document.createElement('div');
      divElem.id                  = id;

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
         success            = (removedElement != null); // success true if removed element found
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
   let position   = htmlElement.style.position;
   let top        = htmlElement.style.top;
   let left       = htmlElement.style.left;

   htmlElement.style.visibility = 'hidden';
   htmlElement.style.position   = 'absolute';
   htmlElement.style.top        = '0px';
   htmlElement.style.left       = '0px';

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

   wx.htmlElement        = htmlElement;
   wx.htmlElementId      = htmlElement.id;
   wx.offsetHeight       = htmlElement.offsetHeight;
   wx.offsetWidth        = htmlElement.offsetWidth;
   wx.clientHeight       = htmlElement.clientHeight;
   wx.clientWidth        = htmlElement.clientWidth;
   wx.scrollHeight       = htmlElement.scrollHeight;
   wx.scrollWidth        = htmlElement.scrollWidth;
   wx.boundingClientRect = htmlElement.getBoundingClientRect();


   body.removeChild(htmlElement);

   htmlElement.style.visibility = visibility;
   htmlElement.style.position   = position;
   htmlElement.style.top        = top;
   htmlElement.style.left       = left;

   return wx;
}

export class Args_SkinnyTooltip {
   htmlElement: HTMLElement;
   text: string;
   maxWidth: number;
   tippyProps ?: Partial<Props>;
   /**
    * Superseedes the 'text' when opening the dialog
    * @type {string | HTMLElement}
    */
   htmlForDialog ?: string;
}

export function skinnyHtmlElementTooltip(args: Args_SkinnyTooltip): string {

   let htmlElement: HTMLElement   = args.htmlElement;
   let text: string               = args.text;
   let maxWidth: number           = args.maxWidth || 40;
   let tippyProps: Partial<Props> = args.tippyProps || {};

   let retVal = text;
   if (text) {
      if (text.length > maxWidth - 2) {
         let cell = htmlElement as HTMLElement

         htmlElement_addTooltip_CoreOnly(cell, {
            ...tippyProps,
            content: escape(text),   // overwrite the content no matter what
         });
         retVal         = text.substring(0, (maxWidth - 1)) + '..';
         cell.innerText = retVal;
      } // if (text.length > 80)
   } //if (text)
   return retVal;
} // skinnyHtmlElementWithTooltipOverflow