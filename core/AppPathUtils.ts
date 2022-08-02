import {getAtWindowPath, setAtWindowPath} from "./WindowPathUtils";
import axios, {AxiosResponse}             from "axios";

export function setAppBase(location: URL): void {
   setAtWindowPath(['appBase'], location);
}

export function getAppBase(): URL {
   return getAtWindowPath('appBase') as URL;
}

let appPathCached: string  = null;
export let tModel: boolean = false;

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