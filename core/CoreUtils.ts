/// <reference path="./global.d.ts" />
import {Component}                                    from "@syncfusion/ej2-base";
import {getErrorHandler}                              from "./CoreErrorHandling";
import axios, {AxiosResponse}                         from "axios";
import {IDataProvider}                                from "./data/DataProvider";
import {AnyScreen}                                    from "./gui/AnyScreen";
import {DataManager, Query, ReturnOption, UrlAdaptor} from "@syncfusion/ej2-data";
import {EJList}                                       from "./ej2/Ej2Comm";
import {IArgs_HtmlDecoration, IKeyValueString}        from "./gui/Args_AnyWidget";
import {isArray, isString}                            from "lodash";
import {ClientVersion}                                from "./gui/ClientVersion";
import * as CSS                                       from 'csstype';
import {Args_AbstractWidget}                          from "./gui/AbstractWidget";

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

//-------------------------------
let _clientVersion: ClientVersion = null;

export function getClientVersion() {
   return _clientVersion;
}

export function setClientVersion(newClientVersion: ClientVersion): void {
   _clientVersion = newClientVersion;
}

//------------------------------

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
                                                                            let result: any = e.result as EJList;
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


// noinspection JSUnusedGlobalSymbols
export function isDev(): boolean {
   return tModel;
}

/**
 * Remove all double spaces from a string
 * @param s
 */
export function removeDoubleSpaces(s: string): string {
   return s.replace(/  +/g, ' ');
}

export function applyHtmlDecoration(htmlElement: HTMLElement, decoration: IArgs_HtmlDecoration): void {
   if (!htmlElement)
      return;
   if (!decoration)
      return;

   // first append any classes
   try {
      let htmlTagClass: string = decoration.htmlTagClass;
      htmlTagClass             = removeDoubleSpaces(htmlTagClass);
      if (htmlTagClass)
         htmlElement.classList.add(...htmlTagClass.split(' '));
   } catch (ex) {
      console.log(ex);
   }

   // now update the style attribute
   try {
      let htmlTagStyle: string = decoration.htmlTagStyle;
      htmlTagStyle             = removeDoubleSpaces(htmlTagStyle);
      if (htmlTagStyle) {
         let currentStyle: string = htmlElement.getAttribute('style');
         if (!currentStyle)
            currentStyle = ''
         if (currentStyle.length > 0 && (!currentStyle.endsWith(';')))
            currentStyle += ';'

         currentStyle += htmlTagStyle;
         htmlElement.setAttribute('style', currentStyle);
      }
   } catch (ex) {
      console.log(ex);
   }

   // now add any additional  attributes

   try {
      let htmlOtherAttr: IKeyValueString = decoration.htmlOtherAttr;
      if (htmlOtherAttr) {

         for (let key in htmlOtherAttr) {
            if (key) {
               let value: string = htmlOtherAttr[key];

               if (value == null)
                  value = ''; // empty attribute
               try {
                  htmlElement.setAttribute(key, value);
               } catch (ex) {
                  console.log(ex);
               }
            } // if key
         } // for
      } //if (htmlOtherAttr )
   } catch (ex) {
      console.log(ex);
   }

} // applyHtmlDecoration

export function toStringFromMaybeArray(input: (string | string[]), joinUsing: string = ' '): string {
   if (!input)
      return '';
   if (isArray(input)) {
      return (input as string[]).join(joinUsing);
   }
   return input as string;
}

//----------------------------------------------------------------------------
//------------------- Start dynamic CSS section ------------------------------
//----------------------------------------------------------------------------

let cachedStyle: HTMLStyleElement;
let ruleMap: Map<string, number> = new Map<string, number>();


/**
 * Add a class with a body under to the document css.
 * It will overwrite an existing class if it exists.
 * Example: cssAddClass('whatever',"background-color: green;");
 * @param className
 * @param rules
 */
export function cssAddClass(className: string, rules: string | CssLikeObject) {

   if (!className) {
      getErrorHandler().displayExceptionToUser(`CoreUtils.cssAddClass method was passed an empty className parameter! className = ${className}`);
      return;
   }

   while (className.startsWith('.') || className.startsWith(' ')) {
      className = className.substr(1); // eliminate starting periods and spaces
   }

   if (!rules) {
      getErrorHandler().displayExceptionToUser(`CoreUtils.cssAddClass method was passed an empty rules parameter! rules = ${rules}`);
      return;
   }

   let classArray: cssRule[];
   let t = typeof rules;
   if ((t === 'string')) {
      classArray = [{className: className, body: rules as string}];
   } else {
      classArray = cssNestedDeclarationToRuleStrings(className, rules as CssLikeObject);
   }

   if (!cachedStyle) {
      // Create it the first time through
      cachedStyle      = document.createElement('style');
      // noinspection JSDeprecatedSymbols
      cachedStyle.type = 'text/css';
      document.getElementsByTagName('head')[0].appendChild(cachedStyle);
   }


   if (ruleMap.get(className)) {
      // First, remove the class if it already exists
      let removed = cssRemoveClass(className);
      if (removed)
         ruleMap.delete(className);
   }


   for (const cssRule of classArray) {
      if (!(cachedStyle.sheet || {}).insertRule) {
         // noinspection JSDeprecatedSymbols
         (((cachedStyle as any).styleSheet || cachedStyle.sheet) as any).addRule(`.${cssRule.className}`, cssRule.body);
      } else {
         // Modern browsers use this path
         let n: number = cachedStyle.sheet?.cssRules.length; // insert at the end
         cachedStyle.sheet.insertRule(`.${cssRule.className}{${cssRule.body}}`, n); // insert at the end
         ruleMap.set(cssRule.className, 1); // keep track of the fact that it's already been added
      }
   } // for cssRule

} // cssAddClass


/**
 * Removes the first instance of the class from the document css
 * Example : cssRemoveClass('whatever')
 * @param className
 */
export function cssRemoveClass(className: string): boolean {
   let removed: boolean           = false;
   let cachedSheet: CSSStyleSheet = cachedStyle.sheet;
   if (cachedSheet) {


      for (let j = 0; j < cachedSheet.cssRules.length; j++) {
         if ((cachedSheet.cssRules[j] as CSSStyleRule).selectorText == `.${className}`) {
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

   return removed;
} // cssRemoveClass

//https://yyjhao.com/posts/roll-your-own-css-in-js/
type CssLikeObject = | { [selector: string]: CSS.PropertiesHyphen | CssLikeObject; } | CSS.PropertiesHyphen;

function joinSelectors(parentSelector: string, nestedSelector: string) {
   if (nestedSelector[0] === ":") {
      return parentSelector + nestedSelector;
   } else {
      return `${parentSelector} ${nestedSelector}`;
   }
}

class cssRule {
   className: string;
   body: string;
}

// https://yyjhao.com/posts/roll-your-own-css-in-js/
function cssNestedDeclarationToRuleStrings(rootClassName: string, declaration: CssLikeObject): cssRule[] {
   const result: cssRule[] = [];

   // We use a helper here to walk through the tree recursively
   function _helper(selector: string, declaration: CssLikeObject) {
      // We split the props into either nested css rules
      // or plain css props.
      const nestedNames: string[]          = [];
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
         // collect the top level css rules
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


export function htmlElement_link_clickFunction(elem: HTMLElement, clickFunction: (evt: any) => (void | Promise<void>)){
   if (!elem)
      return;

   let original = elem.innerHTML
   if (original) {
// Example of an href the takes no action:<a href="#" onclick="return false;">
      elem.innerHTML = `<a href="#" onclick="return false;">${original}</a>`;
      elem.addEventListener('click', clickFunction);
   }
}


export function addCssClass(args: Args_AbstractWidget, classInstance: (string | string[])){
   if (!classInstance)
      return;

   if (!args.cssClasses)
      args.cssClasses = []
   if (isString(args.cssClasses)){
      let x =args.cssClasses
      args.cssClasses = [x]
   }
   // at this point we have an array

   if (isArray(classInstance)){
      let classInstanceArray:string[] = classInstance;
      for (let i = 0; i < classInstanceArray.length; i++) {
         const classInstanceArrayElement = classInstanceArray[i];
         if (classInstanceArrayElement) {
            if ((args.cssClasses as string[]).indexOf(classInstanceArrayElement) < 0)
               args.cssClasses.push(classInstanceArrayElement);
         }
      } // for
   } else {
      if ((args.cssClasses as string[]).indexOf(classInstance) < 0)
         args.cssClasses.push(classInstance);

   }
} // addCssClass