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

export const NEXUS_WINDOW_ROOT_PATH = 'com.itgp.nexus';

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
      throw new Error(`Was asked to get property "${pathName}" from an undefined object!`);
   }

   if (!existingObject[pathName]) {
      existingObject[pathName] = instantiateNewFunction();
   }
   return existingObject[pathName]
}