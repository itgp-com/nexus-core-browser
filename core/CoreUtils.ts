/// <reference path="./global.d.ts" />
import {Component}                                    from "@syncfusion/ej2-base";
import {getErrorHandler}                              from "./CoreErrorHandling";
import axios, {AxiosResponse}                         from "axios";
import {IDataProvider}                                from "./data/DataProvider";
import {AnyScreen}                                    from "./gui/AnyScreen";
import {DataManager, Query, ReturnOption, UrlAdaptor} from "@syncfusion/ej2-data";
import {EJList}                                       from "./ej2/Ej2Comm";

export const NEXUS_WINDOW_ROOT_PATH = 'com.itgp.nexus';
export const IMMEDIATE_MODE_DELAY   = 1000;

declare global {
   // noinspection JSUnusedGlobalSymbols
   interface Array<T> {
      insert(index: number, item: any): Array<T>
   }

   interface String {
      escapeHTML(): string;
   }
}

Array.prototype.insert      = function (index: number, item: any) {
   return this.splice(index, 0, item);
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
   let x: string            = value.replace(/[&<>]/g, function (tag: string) {
      return tagsToReplace[tag] || tag;
   });

   return x;
};

//
// export function escapeHTML(value: string) {
//     if (value == null)
//         return null;
//
//     value = value.toString();
//
//     var tagsToReplace = {
//         '&': '&amp;',
//         '<': '&lt;',
//         '>': '&gt;'
//     };
//     let x:string =  value.replace(/[&<>]/g, function(tag:string) {
//         return tagsToReplace[tag] || tag;
//     });
//
//     return x;
// };

export interface voidFunction {
   (): void;
}

export interface noArgsFunction {
   (): any;
}

export type StringFunction = () => string;
export type StringArg = (string | StringFunction);

export function isFunction(arg: any): boolean {
   return (arg ? (typeof arg === "function") : false);
}

export function stringArgVal(arg: StringArg): string {
   // arg can only be a String or StringFunction
   if (arg) {
      if (isFunction(arg)) {
         let s: string = (<StringFunction>arg)();
         return s;
      } else {
         return <string>arg;
      }
   } else {
      return '';
   }
} //stringArgVal


//---------------- Class instance/array/instance function/ array function type ------------------
/**
 * Returns an instance of the type described
 */
export type ClassFunction<T> = () => T;
/**
 * Returns an instance of the type described in the generic
 */
export type ClassArrayFunction<T> = () => T[];
export type ClassArg<T> = (T | ClassFunction<T>);
export type ClassArrayArg<T> = (T[] | ClassArrayFunction<T>);
export type ClassArgInstanceOrArray<T> = (T | T[] | ClassFunction<T> | ClassArrayFunction<T>);

/**
 * Extract an actual instance T regardless of whether the argument is already a T instance or if it's a function that yields the T instance when called
 * Returns null if argument is empty
 * @param arg
 */
export function classArgInstanceVal<T>(arg: ClassArg<T>): T {
   if (arg) {
      if (isFunction(arg)) {
         let val: T = (<ClassFunction<T>>arg)();
         return val;
      } else {
         return (<T>arg);
      }
   } else {
      return null;
   }
} // classArgInstanceVal

/**
 * Extract an actual array T[] regardless of whether the argument is already an array or if it's a function that yields the T[] array when called
 *  Returns null if argument is empty
 * @param arg
 */
export function classArgArrayVal<T>(arg: |ClassArrayArg<T>): T[] {
   if (arg) {
      if (isFunction(arg)) {
         let val: T[] = (<ClassArrayFunction<T>>arg)();
         return val;
      } else {
         return (<T[]>arg);
      }
   } else {
      return null;
   }
} // classArgInstanceVal

/**
 * /**
 * Extract an instance of an actual array (T| T[]) regardless of whether the argument is already an instance/array or if it's a function that yields the T instance or T[] array when called
 *  Returns null if argument is empty
 * @param arg
 */
export function classArgInstanceOrArrayVal<T>(arg: (ClassArg<T> | ClassArrayArg<T> | ClassArgInstanceOrArray<T>)): (T | T[]) {
   // arg can only be a String or StringFunction
   if (arg) {
      if (isFunction(arg)) {

         if (arg as ClassFunction<T>) {
            let val: T = (<ClassFunction<T>>arg)();
            return val;
         } else {
            let arrayVal: T[] = (<ClassArrayFunction<T>>arg)();
            return arrayVal;
         }

      } else {
         if (Array.isArray(arg)) {
            return (<T[]>arg);
         } else {
            return (<T>arg);
         }
      }
   } else {
      return null;
   }
} //stringArgVal


//------------------------- Data Provider filter function type -------
export type DataProviderFilterOptionalArgs = (any | noArgsFunction);
export type DataProviderFilter<T> = (provider: IDataProvider, optionalArgs: DataProviderFilterOptionalArgs) => T;


export function isA(ChildClass: any, ParentClass: any) {
   let _ = ChildClass.prototype;
   while (_ != null) {
      if (_ == ParentClass.prototype)
         return true;
      _ = _.__proto__;
   }
   return false;
}


// noinspection JSUnusedGlobalSymbols
/**
 * Used inside an async function to timeout for a number of milliseconds and then continue.
 * Uses the old setTimeout JS5 multithreading.
 *
 * @param ms
 */
export function wait(ms: number): void {
   // noinspection JSIgnoredPromiseFromCall
   new Promise(resolve => setTimeout(resolve, ms));
}

export function getWindowNexusRoot(): object {
   let current = window;

   if (!current[NEXUS_WINDOW_ROOT_PATH]) {
      current[NEXUS_WINDOW_ROOT_PATH] = {}
   }
   current = current[NEXUS_WINDOW_ROOT_PATH]; // move the root up

   return current;
}

/**
 * Returns the object that corresponds to the path passed in the array of names in the window global object.
 * If parts of the path do not yet exist, they are instantiated.
 *
 * For example getAtWindowPath('hello', 'there') is equivalent to window['hello']['there'] with the additional
 * functionality of instantiating window['hello'] for window['hello']['there'].
 *
 * @param pathElements
 */
export function getAtWindowPath(...pathElements: string[]): any {
   return getAtWindowPath2(pathElements);
   // let current = getWindowNexusRoot()
   //
   //
   // for (let i = 0; i < pathElements.length; i++) {
   //     let subElem = pathElements[i];
   //     if (!current[subElem]) {
   //         current[subElem] = {}
   //     }
   //
   //     current = current[subElem]; // move the root up
   // } // for
   // return current
}

/**
 * Returns the object that corresponds to the path passed in the array of names in the window global object.
 * If parts of the path do not yet exist, they are instantiated.
 *
 * For example getAtWindowPath('hello', 'there') is equivalent to window['hello']['there'] with the additional
 * functionality of instantiating window['hello'] for window['hello']['there'].
 *
 * @param pathElements
 */
export function getAtWindowPath2(pathElements: string[]): any {
   let current = getWindowNexusRoot();


   for (let i = 0; i < pathElements.length; i++) {
      let subElem = pathElements[i];
      if (!current[subElem]) {
         current[subElem] = {}
      }

      current = current[subElem]; // move the root up
   } // for
   return current
}


export function setAtWindowPath(pathElements: string[], value: any): void {
   if (!(pathElements))
      return; // no path

   if (pathElements.length == 0)
      return; // empty path

   let current = getWindowNexusRoot();


   for (let i = 0; i < pathElements.length - 1; i++) {
      let subElem = pathElements[i];
      if (!current[subElem]) {
         current[subElem] = {}
      }

      current = current[subElem]; // move the root up
   } // for

   // now the last path
   let subElem      = pathElements[pathElements.length - 1];
   current[subElem] = value;
}

// noinspection JSUnusedGlobalSymbols
export function getObjectPath(existingObject: any, ...pathElements: string[]): any {

   let current = existingObject;

   for (let i = 0; i < pathElements.length; i++) {
      let subElem = pathElements[i];
      if (!current[subElem]) {
         current[subElem] = {}
      }

      current = current[subElem]; // move the root up
   } // for
   return current
}

type ObjectBuilder<T> = () => T;

export function getOrInitialize<T>(existingObject: Object, pathName: string, instantiateNewFunction: ObjectBuilder<T>): T {
   if (!existingObject) {
      throw showEx(new Error(`Was asked to get property "${pathName}" from an undefined object!`));
   }

   if (!existingObject[pathName]) {
      existingObject[pathName] = instantiateNewFunction();
   }
   return existingObject[pathName]
}

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

export function setAppBase(location: URL): void {
   setAtWindowPath(['appBase'], location);
}

export function getAppBase(): URL {
   return getAtWindowPath('appBase') as URL;
}

let appPathCached: string = null;
let tModel: boolean       = false;

export async function asyncGetAppPath(): Promise<string> {

   if (appPathCached)
      return appPathCached;

   let basePageURL: URL = getAppBase();

   let appPathname: string = basePageURL.pathname; // path from base (host:port) to page

   // Now let's try the appPathName and call localhost:port + AppPathName + core/running

   let urlCoreRunning = `${appPathname}core/running`;

   let response: AxiosResponse = await axios.get(urlCoreRunning);

   if (response.status === 200) {
      appPathCached = appPathname;

      try {
         // noinspection UnnecessaryLocalVariableJS
         let tFlag = response.data['t'];
         tModel    = tFlag;
      } catch (ignore) {
      }
   } else {
      appPathCached = '/'
   }
   return appPathCached;
}

// noinspection JSUnusedGlobalSymbols
export function isTModel() {
   return tModel;
}


// noinspection JSUnusedGlobalSymbols
/**
 * This method returns the cached app path instantiated by a call the{@link asyncGetAppPath}
 * That call is made by default in CoreUI's async init_async() function at the start of the system
 */
export function getAppPath(): string {
   return appPathCached;
}

export const MODULE_CORE: string          = 'core/';
export const REC_ANYTABLE: string         = 'rec/{tablename}';
export const REC_ANYTABLE_EJ2: string     = REC_ANYTABLE + "/ej2";
export const REC_ANYTABLE_EJ2CRUD: string = REC_ANYTABLE + "/ej2crud";
export const REC_ANYTABLE_LIST: string    = REC_ANYTABLE + "/list";

export function urlTable(tablename: string, rawPath: string): string {
   let x = rawPath;
   x     = x.replace('{tablename}', tablename);

   let appPath: string = getAppPath();
   // noinspection UnnecessaryLocalVariableJS
   let url: string     = encodeURI(`${appPath}${MODULE_CORE}${x}`); // the name must be uri encoded before transmission. Spring controller decodes automatically
   return url;
}

// noinspection JSUnusedGlobalSymbols
export function urlTableEj2(tablename: string): string {
   return urlTable(tablename, REC_ANYTABLE_EJ2);
}


// noinspection JSUnusedGlobalSymbols
export function urlTableEj2Crud(tablename: string): string {
   return urlTable(tablename, REC_ANYTABLE_EJ2CRUD);
}

// noinspection JSUnusedGlobalSymbols
export function urlTableList(tablename: string): string {
   return urlTable(tablename, REC_ANYTABLE_LIST);
}

// noinspection JSUnusedGlobalSymbols
export function url(modName: string, endpointName: string) {
   let appPath: string = getAppPath();

   if (!(modName.endsWith('/') || endpointName.startsWith('/')))
      modName = modName + "/"; // ensure delimiter exists
   // noinspection UnnecessaryLocalVariableJS
   let url: string = encodeURI(`${appPath}${modName}${endpointName}`);
   return url;
}


// noinspection JSUnusedGlobalSymbols
export interface tagScriptParams {
   src: string,
   integrity: string,
   crossorigin: string
}

// noinspection JSUnusedGlobalSymbols
/**
 * @htmlString {String} HTML representing a single element
 * @return {HTMLElement}
 */
export function htmlToElement(htmlString: string): HTMLElement {
   const div     = document.createElement('div');
   div.innerHTML = htmlString.trim();

   // Change this to div.childNodes to support multiple top-level nodes
   return div.firstElementChild as HTMLElement;
}

// /**
//  * @param {String} HTML representing any number of sibling elements
//  * @return {NodeList}
//  */
// export function htmlToElements(html: string ) : NodeListOf<ChildNode>{
//     var template = document.createElement('template');
//     template.innerHTML = html;
//     return template.content.childNodes;
// }

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
   s.type  = 'text/javascript';
   if ($script.src) {
      s.onload  = callback;
      s.onerror = callback;
      s.src     = $script.src
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
   const $scripts       = $container.querySelectorAll('script');
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

// noinspection JSUnusedGlobalSymbols
export function cast<T>(obj: any, cl: { new(args: any): T }): T {
   if (obj)
      obj.__proto__ = cl.prototype;
   return obj;
}

// noinspection JSUnusedGlobalSymbols
export function castArray<T>(array: Object[], cl: { new(args: any): T }): T[] {
   if (array) {
      array.forEach(elem => {
         cast(elem, cl);
      });
   }
   return array as T[];
}

/* To Title Case © 2018 David Gouch | https://github.com/gouch/to-title-case */

// eslint-disable-next-line no-extend-native
String.prototype.toTitleCase = function (): string {
   const smallWords          = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i;
   const alphanumericPattern = /([A-Za-z0-9\u00C0-\u00FF])/;
   const wordSeparators      = /([ :–—-])/;

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
/**
 * Removes all the tags after the lastIdTag passed in
 *
 * @param lastIdTag the last tag of the application html inside body. Defaults to 'app__l_a_s_t__' if not passed in
 */
export function cleanUpHtml(lastIdTag: string = 'app__l_a_s_t__') {
   $(`#${lastIdTag}`).nextAll('div').remove() // get rid of all the junk in the page
}

// noinspection SpellCheckingInspection
/** Return the document element by it's ID or null if it doesn't exist
 *
 * @param id
 */
export function hget(id: string): HTMLElement {
   if (id)
      return document.getElementById(id);
   else
      return null;
}

// noinspection SpellCheckingInspection
export function hgetInput(id: string): HTMLInputElement {
   return hget(id) as HTMLInputElement;
}


export function getRandomInt(max: number) {
   return Math.floor(Math.random() * Math.floor(max));
}

export function getRandomString(prefix?: string): string {
   let p: string = (prefix ? `${prefix}_` : '');
   p             = p.replace(/\./g, '_'); // replaces '.' with '_'
   p             = p.replace(/#|:/g, '_'); // replaces '#' and ':' with '_'
   let retVal    = `${p}${getRandomInt(1000)}_${getRandomInt(100000)}`;
   return retVal;
}

/**
 * Creates a template under the {@link createTemplate.template_id} id, with the body being the {@link createTemplate.templateHtmlContent}
 * Adds the template id to the screen list of templates
 *
 * <code>
 * <script id="' + instance.template_id + '" type="text/x-template">
 * ${templateHtmlContent}
 * </script>
 * </code>
 * @param screen the screen to add the template to (auto destroys the template on close)
 * @param template_id string unique id for this template
 * @param templateHtmlContent content body to be inserted between <script></script>
 * @return null if there's a problem, the HTMLElement if all is ok
 */
export function addTemplate(screen: AnyScreen, template_id: string, templateHtmlContent: string): HTMLElement {
   let templateDiv: HTMLElement = null;
   if (template_id && templateHtmlContent) {
      try {
         let templateDiv = htmlToElement(`
<script id="${template_id}" type="text/x-template">
${templateHtmlContent}
</script>`);
         document.body.appendChild(templateDiv);
         if (screen)
            screen.addTemplateId(template_id);
      } catch (ex) {
         console.log(ex);
      }
   }
   return templateDiv;
}

/**
 * Remove the template added with {@link addTemplate} in order to clean up.
 * This is usually done in the destroy phase.
 *
 * Called automatically by the localDestroyImplementation of AnyScreen.
 *
 * @param screen
 * @param template_id
 */
export function removeTemplate(screen: AnyScreen, template_id: string): boolean {
   let success: boolean = false;
   if (template_id) {
      try {
         let removedChild = document.body.removeChild(document.getElementById(template_id));
         if (screen)
            screen.removeTemplateId(template_id);
         return (removedChild != null)
      } catch (ex) {
         console.log(ex);
      }
   }
   return success;
}

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

/**
 * Query the appserver (using ej2 syntax) and return back an array of records
 * @param tablename
 * @param query
 * @param options
 */
export async function ej2Query(tablename: string, query: Query, options?: any): Promise<any[]> {
   let dataManager = new DataManager({
                                        url:         urlTableEj2(tablename),
                                        adaptor:     new UrlAdaptor(),
                                        crossDomain: true
                                     });

   let promise: Promise<any[]> = new Promise((resolve, reject) => {
                                                dataManager.executeQuery(query, (e: ReturnOption) => {
                                                                            let result:any           = e.result as EJList;
                                                                            if (!result.errMsgDisplay) {
                                                                               let records: any[] = <any[]>result.result;
                                                                               resolve(records);
                                                                            } else {
                                                                               console.log(result.errMsgDisplay);
                                                                               console.log(result.errMsgLog);
                                                                               reject(result.errMsgDisplay);
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
   return promise;
}



