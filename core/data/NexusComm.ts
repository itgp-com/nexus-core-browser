import {CrudOptions, DataManager, DataOptions, Query} from "@syncfusion/ej2-data";
import {DataResult} from "@syncfusion/ej2-data/src/adaptors";
import {AxiosRequestConfig, AxiosResponse} from "axios";

export interface NexusCommEvt {
    type: "adaptor"|"axios";
}

export interface HttpRequestEvt extends NexusCommEvt {

}

export interface HttpRequestEvtAdaptor extends HttpRequestEvt{
    xhr: XMLHttpRequest; // From URLAdaptor beforeSend
    dm: DataManager // // From URLAdaptor beforeSend

    /**
     * Cancel the HTTP request
     */
    cancel: boolean;
}


export interface HttpRequestEvtAxios extends NexusCommEvt{
    url: string;

    /**
     * POST data (if any)
     */
    data?: any;

    config?: AxiosRequestConfig
}

export interface HttpResponseEvt extends NexusCommEvt {
}

export interface HttpResponseEvtAxios extends HttpResponseEvt {
    axiosResponse: AxiosResponse;
    config?: AxiosRequestConfig;
}

export interface HttpResponseEvtAdaptor extends HttpResponseEvt {
    data: DataResult;
    ds?: DataOptions;
    query?: Query;
    xhr?: XMLHttpRequest;
    request?: Object;
    changes?: CrudOptions;
}