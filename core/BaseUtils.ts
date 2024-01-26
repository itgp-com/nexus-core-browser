/**
 * Basic utils that have no 'import' statements from anywhere else in Core
 */
// import base32Encode       from 'base32-encode'
let base32Encode: any;

async function init() {
   base32Encode = (await import('base32-encode')).default;
}

init();


import {isFunction} from "lodash";
import {cssStyleToString, removeDoubleSpaces} from "./CoreUtils";
import {CssStyle} from "./gui/AbstractWidget";

export type StringFunction = () => string;
export type StringArg = (string | StringFunction);

export interface voidFunction {
   (): void;
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
} // noinspection JSUnusedGlobalSymbols

export function getRandomText(length: number): string {
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
   let result = '';
   for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
   }
   return result;
}

export interface noArgsFunction {
   (): any;
}

// export function isFunction(arg: any): boolean {
//    return (arg ? (typeof arg === "function") : false);
// }

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
export function isA(ChildClass: any, ParentClass: any) {
   let _ = ChildClass.prototype;
   while (_ != null) {
      if (_ == ParentClass.prototype)
         return true;
      _ = _.__proto__;
   }
   return false;
}

/**
 * Used inside an async function to timeout for a number of milliseconds and then continue.
 * Uses the old setTimeout JS5 multithreading.
 *
 * @param ms
 */
export function wait(ms: number): void {
   // noinspection JSIgnoredPromiseFromCall
   new Promise(resolve => setTimeout(resolve, ms));
} // noinspection JSUnusedGlobalSymbols
/**
 * @htmlString {String} HTML representing a single element
 * @return {HTMLElement}
 */
export function htmlToElement(htmlString: string): HTMLElement {
   const div     = document.createElement('div');
   div.innerHTML = htmlString.trim();

   // Change this to div.childNodes to support multiple topContainer-level nodes
   return div.firstElementChild as HTMLElement;
} //---------------------------------------
/**
 * Removes all the tags after the lastIdTag passed in
 *
 * @param lastIdTag the last tag of the application html inside body. Defaults to 'app__l_a_s_t__' if not passed in
 */
export function cleanUpHtml(lastIdTag: string = 'app__l_a_s_t__') {
   // get rid of all the junk in the page
   nextAll(null, document.getElementById(lastIdTag)).forEach((el: HTMLElement) => {
      el.remove();
   });
} // noinspection SpellCheckingInspection

/**
 * Select all HTMLElements at the same level as the element passed in and return them in an array
 * Equivalent to jQuery nextAll()
 * @param selector null or selector for which siblings to return
 * @param element anchor element to start from
 */
export function nextAll(selector: string, element: HTMLElement): HTMLElement[] {
   let all: HTMLElement[] = [];
   if (element) {
      while (element.nextElementSibling) {
         element = element.nextElementSibling as HTMLElement;
         if (selector) {
            if (element.matches(selector)) {
               all.push(element);
            }
         } else {
            // no selector - all elements go in
            all.push(element);
         }
      }
   }
   return all;
}


/*
 * Deletes an element from the DOM by its ID.
 *
 * @param {string} elementId - The ID of the element to delete.
 *
 * Finds the element in the DOM with the provided ID using document.getElementById().
 * If the element exists, it is removed from the DOM using removeChild().
 *
 * Example usage:
 * ```
 * deleteElementById('myElement');
 * ```
 */
export function deleteElementById(elementId: string) {
   // Find the element by its ID
   var element = document.getElementById(elementId);

   // If the element exists, remove it from the DOM
   if (element) {
      element.parentNode.removeChild(element);
   }
} // deleteElementById

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

export function hgetInput(id: string): HTMLInputElement {
   return hget(id) as HTMLInputElement;
} // noinspection JSUnusedGlobalSymbols
// noinspection JSUnusedGlobalSymbols
export function cast<T>(obj: any, cl: { new(args: any): T }): T {
   if (obj)
      obj.__proto__ = cl.prototype;
   return obj;
}

export function castArray<T>(array: Object[], cl: { new(args: any): T }): T[] {
   if (array) {
      array.forEach(elem => {
         cast(elem, cl);
      });
   }
   return array as T[];
}

export class Args_FunctionsTable {
   functionName: string;
   /**
    * Concatenation of arguments to pass to this function complete with surrounding quotes, commas between parameters, etc
    * Ex: arguments = "'arg1', 'arg2', 'arg3'"
    */
   arguments ?: string;
}

export function functionAsTable(param: Args_FunctionsTable): string {
   if (!param.arguments) {
      return `${param.functionName}()`; // no arguments
   } else {
      // Base32 encode, then add second set of paranthesis to indicate encoding

      let uint8array  = new TextEncoder().encode(param.arguments);
      // https://www.npmjs.com/package/base32-encode
      let encodedArgs = base32Encode(uint8array, 'RFC4648'); // RFC4648 is the default standard that the application server uses

      // double paranthesis to indicate encoded arguments
      return `${param.functionName}((${encodedArgs}))`;

   } // if arguments
} // functionAsTable


export interface IKeyValueString {
   [key: string]: string
}

export interface IArgs_HtmlDecoration {
   htmlTagClass?: string;
   htmlTagStyle?: CssStyle;
   htmlOtherAttr?: IKeyValueString; // {string:string};
}

export interface IArgs_HtmlTag extends IArgs_HtmlDecoration {
   htmlTagType?: string; // div by default
}

export class IArgs_HtmlTag_Utils {

   static init(args: IArgs_HtmlDecoration): IArgs_HtmlTag {
      if (!args)
         args = {};
      if (!(args as any).htmlTagType)
         (args as IArgs_HtmlTag).htmlTagType = 'div';// default to 'div'
      if (!args.htmlTagClass)
         args.htmlTagClass = '';
      if (!args.htmlTagStyle)
         args.htmlTagStyle = {};
      if (!args.htmlOtherAttr)
         args.htmlOtherAttr = {};

      return args;
   }

   static class(args: IArgs_HtmlDecoration): string {
      args             = IArgs_HtmlTag_Utils.init(args);
      let htmlTagClass = '';
      if (args.htmlTagClass)
         htmlTagClass = ` class="${args.htmlTagClass}"`;

      return htmlTagClass;
   }

   static style(args: IArgs_HtmlDecoration): string {
      args             = IArgs_HtmlTag_Utils.init(args);
      let htmlTagStyle = '';
      if (args.htmlTagStyle)
         htmlTagStyle = ` style="${cssStyleToString(args.htmlTagStyle)}"`;
      return htmlTagStyle;
   }

   static otherAttr(args: IArgs_HtmlDecoration): string {
      args          = IArgs_HtmlTag_Utils.init(args);
      let htmlAttrs = '';
      if (args.htmlOtherAttr) {
         Object.entries(args.htmlOtherAttr).forEach(entry => {
            let key   = entry[0];
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

   static all(args: IArgs_HtmlDecoration): string {
      return `${IArgs_HtmlTag_Utils.class(args)}${IArgs_HtmlTag_Utils.style(args)}${IArgs_HtmlTag_Utils.otherAttr(args)}`;
   }

}

/**
 * Applies decorations (classes, styles, and attributes) to a given HTML element.
 *
 * @export
 * @param {HTMLElement} htmlElement - The target HTML element to which decorations should be applied.
 * @param {IArgs_HtmlDecoration} decoration - The decoration arguments specifying classes, styles, and attributes.
 *
 * @example
 * const elem = document.getElementById('myDiv');
 * const decoration = {
 *   htmlTagClass: 'div',
 *   htmlTagStyle: { color: 'red', fontSize: '16px' },
 *   htmlOtherAttr: { 'data-test': 'testValue' }
 * };
 * applyHtmlDecoration(elem, decoration);
 */
export function applyHtmlDecoration(htmlElement: HTMLElement, decoration: IArgs_HtmlDecoration): void {
   if (!htmlElement)
      return;
   if (!decoration)
      return;

   // first append any classes
   try {
      let htmlTagClass: string = decoration.htmlTagClass;
      if (htmlTagClass) {
         htmlTagClass = removeDoubleSpaces(htmlTagClass);
         if (htmlTagClass) {
            let newClasses: string[] = htmlTagClass.split(' ');
            htmlElement.classList.remove(...newClasses)
            htmlElement.classList.add(...newClasses);
         }
      } // if ( htmlTagClass)
   } catch (ex) {
      console.log(ex);
   }

   // now update the style attribute
   try {
      let styleAsString: string = cssStyleToString(decoration.htmlTagStyle);
      if (styleAsString) {
         styleAsString = removeDoubleSpaces(styleAsString);
         if (styleAsString) {
            let currentStyle: string = htmlElement.getAttribute('style');
            if (!currentStyle)
               currentStyle = ''
            if (currentStyle.length > 0 && (!currentStyle.endsWith(';')))
               currentStyle += ';'

            currentStyle += styleAsString;
            htmlElement.setAttribute('style', currentStyle);
         }
      } // if (htmlTagStyle)
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