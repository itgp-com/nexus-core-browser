import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {RetVal} from "./Core";
import {cast, hget} from "./BaseUtils";
import {createSpinner, hideSpinner, showSpinner} from "@syncfusion/ej2-popups";
import {nexusMain} from "./NexusMain";
import {HttpRequestEvtAxios, HttpResponseEvtAxios} from "./data/NexusComm";

let _globalHttpHeaders: Map<string, string> = new Map<string, string>();

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


/**
 * Allows a custom HTTP method to be used.
 *
 * @param httpMethod custom HTTP method
 * @param url
 * @param data
 * @param config
 */
export async function asyncHttpGeneric<T = any, R = AxiosResponse<T>>(httpMethod: string, url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return commonAxiosRequest(httpMethod, url, data, config);
}

export async function asyncHttpGet<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return commonAxiosRequest("GET", url, undefined, config);
}

export async function asyncHttpDelete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return commonAxiosRequest("DELETE", url, undefined, config);
}

export async function asyncHttpHead<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return commonAxiosRequest("HEAD", url, undefined, config);
}

export async function asyncHttpOptions<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return commonAxiosRequest("OPTIONS", url, undefined, config);
}

export async function asyncHttpPost<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return commonAxiosRequest("POST", url, data, config);
}

export async function asyncHttpPut<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return commonAxiosRequest("PUT", url, data, config);
}

export async function asyncHttpPatch<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return commonAxiosRequest("PATCH", url, data, config);
}

export async function asyncHttpPurge<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return commonAxiosRequest("PURGE", url, data, config);
}

export async function asyncHttpLink<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return commonAxiosRequest("LINK", url, data, config);
}

export async function asyncHttpUnlink<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {
    return commonAxiosRequest("UNLINK", url, data, config);
}


export type HttpOp = 'GET'
    | 'DELETE'
    | 'HEAD'
    | 'OPTIONS'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'PURGE'
    | 'LINK'
    | 'UNLINK';

async function commonAxiosRequest<T = any, R = AxiosResponse<T>>(op: (HttpOp | string), url: string, data?: any, config?: AxiosRequestConfig): Promise<R> {

    if (!op)
        throw(new Error(`Http method cannot be '${op}' !`));


    let localConfig: AxiosRequestConfig = config || {}; // empty object or config passed in
    if (!localConfig.headers)
        localConfig.headers = {}

    applyGlobalHttpHeaders(localConfig.headers);

    try {
        nexusMain.ui?.onHttpRequest({
            type: "axios",
            url: url,
            data: data,
            config: localConfig,
        } as HttpRequestEvtAxios);
    } catch (e) {
        console.error(e);
    }
    let r: Promise<R>;

    switch (op) {
        case("GET"):
            r = axios.get(url, localConfig);
            break;
        case("DELETE"):
            r = axios.delete(url, localConfig);
            break;
        case("HEAD"):
            r = axios.head(url, localConfig);
            break;
        case("OPTIONS"):
            r = axios.options(url, localConfig);
            break;
        case("POST"):
            r = axios.post(url, data, localConfig);
            break;
        case("PUT"):
            r = axios.put(url, data, localConfig);
            break;
        case("PATCH"):
            r = axios.patch(url, data, localConfig);
            break;
        default:
            localConfig.method = op.toString();
            localConfig.url = url;
            if (data)
                localConfig.data = data;
            r = axios.request(localConfig);
    }

    let axiosResponse: R = await r;

    try {
        nexusMain.ui?.onHttpResponse({
            type: "axios",
            axiosResponse: axiosResponse,
            config: localConfig,
        } as HttpResponseEvtAxios);
    } catch (e) {
        console.error(e);
    }

    return r;
} // commonAxiosRequest


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