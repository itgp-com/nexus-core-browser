import {CrudOptions, DataManager, DataOptions, Query} from "@syncfusion/ej2-data";
import {DataResult} from "@syncfusion/ej2-data/src/adaptors";
import {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import {ExecuteQueryAlwaysEvent} from "./NexusDataManager";

export interface NexusCommEvt {
    type: "ej2Adaptor"|"axios"|"ej2DataManager";
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

export interface HttpRequestEvtDataManager extends NexusCommEvt{
    query?: Query;
    done?: Function;
    fail?: Function;
    always?: Function;
} // HttpRequestEvtDataManager


export interface HttpResponseEvt extends NexusCommEvt {
}

export interface HttpResponseEvtAxios extends HttpResponseEvt {
    axiosResponse: AxiosResponse;
    config?: AxiosRequestConfig;
    error?: AxiosError|any;
}

export interface HttpResponseEvtAdaptor extends HttpResponseEvt {
    data: DataResult;
    ds?: DataOptions;
    query?: Query;
    xhr?: XMLHttpRequest;
    request?: Object;
    changes?: CrudOptions;
}

export interface HttpResponseEvtDataManager extends HttpResponseEvt{
    evt: ExecuteQueryAlwaysEvent | any;
}