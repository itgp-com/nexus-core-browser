import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {RetVal}                                   from "./Core";
import {cast, hget}                               from "./BaseUtils";
import {createSpinner, hideSpinner, showSpinner}  from "@syncfusion/ej2-popups";

let _globalHttpHeaders:Map<string,string> = new Map<string,string>();

export function getGlobalHttpHeaders(): Map<string, string> {
   return _globalHttpHeaders;
}

export function setGlobalHttpHeaders(value: Map<string, string>) {
   if (value)
      _globalHttpHeaders = value;
}

export function applyGlobalHttpHeaders(headers: any) {

   //!!!!!!!!! Function applyPermanentHttpHeadersToHttpRequest below also does the same thing !!!!!!!!!!

   // set the global http headers for each request
   _globalHttpHeaders.forEach((value, key) => {
      if (key && value)
         headers[key] = value;
   });
}

export function applyGlobalHttpHeadersToHttpRequest(request: XMLHttpRequest) {

   //!!!!!!!!! Function applyPermanentHttpHeaders above also does the same thing !!!!!!!!!!

   // set the global http headers for each request
   _globalHttpHeaders.forEach((value, key) => {
      if (key && value)
         request.setRequestHeader(key, value);
   });
}

export async function asyncHttpGet<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {

   let localConfig: AxiosRequestConfig = config || {}; // empty object or config passed in
   if (!localConfig.headers)
      localConfig.headers = {}

   applyGlobalHttpHeaders(localConfig.headers);

   return axios.get(url, localConfig);
}

export async function asyncHttpPost<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {

   let localConfig: AxiosRequestConfig = config || {}; // empty object or config passed in
   if (!localConfig.headers)
      localConfig.headers = {}

   applyGlobalHttpHeaders(localConfig.headers);

   return axios.post(url, data, localConfig);
}

export interface ArgsPost<RESPONSE = any> {
   url: string,
   data: any,
   config?: AxiosRequestConfig,
   waitFeedbackTagID?: string;

}

/**
 * Do a POST and either return the exact object or throw an error (and return undefined
 * @param argsPost
 */
export async function asyncPost<T = any>(argsPost: ArgsPost<T>): Promise<T> {
   try {
      let waitElem: HTMLElement;

      if (argsPost.waitFeedbackTagID) {
         waitElem = hget(argsPost.waitFeedbackTagID);
         if (waitElem) {
            createSpinner({target: waitElem});
            showSpinner(waitElem);
         }
      }
      let response: AxiosResponse;


      let localConfig: AxiosRequestConfig = argsPost.config || {}; // empty object or config passed in
      if (!localConfig.headers)
         localConfig.headers = {}

      try {
         response = await asyncHttpPost(
            argsPost.url,
            argsPost.data,
            localConfig, // AxiosRequestConfig
         )
      } finally {
         try {

            waitElem = hget(argsPost.waitFeedbackTagID);
            if (waitElem && argsPost.waitFeedbackTagID)
               hideSpinner(waitElem);
         } catch (ignore) {
         } // if close pressed, there's nothing to hide and we get undefined
      }

      // noinspection ExceptionCaughtLocallyJS
      if (response.status >= 200 && response.status < 400 && response.data) {
         return response.data;
      } else {
         throw response.statusText;
      }
   } catch (error) {
      throw error;
   }

}

export async function asyncPostRetVal<T = any>(argsPost: ArgsPost<T>): Promise<T> {
   try {

      let data: any = await asyncPost(argsPost);

      if (data) {
         let retVal: RetVal = cast(data, RetVal);
         if (retVal.hasError()) {
            throw retVal.err;
         } else {
            return retVal.value;
         }
      } else {
         throw data;
      }
   } catch (error) {
      throw error;
   }
}