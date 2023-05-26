import {CrudOptions, DataManager, DataOptions, Query, UrlAdaptor} from '@syncfusion/ej2-data';
import {DataResult, PvtOptions, Requests} from "@syncfusion/ej2-data/src/adaptors";
import {ParamOption, Predicate, QueryOptions} from "@syncfusion/ej2-data/src/query";
import {Aggregates, Group} from "@syncfusion/ej2-data/src/util";
import {nexusMain} from "../NexusMain";
import {HttpRequestEvtAdaptor, HttpResponseEvtAdaptor} from "./NexusComm";

/**
 * Nexus specific URLAdaptor that allows to intercept the HTTP request and response.
 *
 */
export class NexusAdaptor extends UrlAdaptor {

    static showDebug: boolean;

    /**
     * Constructor for Adaptor class
     * @param  {DataOptions} ds?
     * @hidden
     * @returns aggregates
     */
    constructor(ds?: DataOptions) {
        super(ds);
    }


    addParams(options: {
        dm: DataManager;
        query: Query;
        params: ParamOption[];
        reqParams: { [key: string]: Object; };
    }): void {
        if (NexusAdaptor.showDebug)
            console.log("addParams");

        // super.addParams(options);

        // The code below is copied DIRECTLY from the base class, with the overwriting of parameters allowed (commented out exception for [if (req[tmp.key]) ])
        //----------
        let req = options.reqParams;
        if (options.params.length) {
            req.params = {};
        }
        for (let _i = 0, _a = options.params; _i < _a.length; _i++) {
            let tmp = _a[_i];
            // if (req[tmp.key]) {
            //     throw new Error('Query() - addParams: Custom Param is conflicting other request arguments');
            // }
            req[tmp.key] = tmp.value;
            if (tmp.fn) {
                req[tmp.key] = tmp.fn.call(options.query, tmp.key, options.query, options.dm);
            }
            req.params[tmp.key] = req[tmp.key];
        } // for
        //----------------

    } // addParams

    /**
     * Prepare the request body based on the newly added, removed and updated records.
     * The result is used by the batch request.
     * @param  {DataManager} dm
     * @param  {CrudOptions} changes
     * @param  {Object} e
     */
    batchRequest(dm: DataManager, changes: CrudOptions, e: Object, query: Query, original?: Object): Object {
        if (NexusAdaptor.showDebug)
            console.log("batchRequest");
        return super.batchRequest(dm, changes, e, query, original);
    }

    /**
     * Method will trigger before send the request to server side.
     * Used to set the custom header or modify the request options.
     * @param  {DataManager} dm
     * @param  {XMLHttpRequest} request
     * @returns void
     */
    beforeSend(dm: DataManager, request: XMLHttpRequest): void {
        if (NexusAdaptor.showDebug)
            console.log("beforeSend");

        nexusMain.ui?.onHttpRequest({
            type: "ej2Adaptor",
            xhr: request,
            dm: dm,
            cancel: false,
        } as HttpRequestEvtAdaptor);
        //TODO Handle Cancel once Syncfusion supports it
        super.beforeSend(dm, request);
    }

    /**
     * Convert the object from processQuery to string which can be added query string.
     * @param  {Object} req
     * @param  {Query} query
     * @param  {DataManager} dm
     */
    convertToQueryString(request: Object, query: Query, dm: DataManager): string {
        if (NexusAdaptor.showDebug)
            console.log("convertToQueryString");
        return super.convertToQueryString(request, query, dm);
    }

    protected formRemoteGroupedData(data: Group[], level: number, childLevel: number): Group[] {
        if (NexusAdaptor.showDebug)
            console.log("formRemoteGroupedData");
        return super.formRemoteGroupedData(data, level, childLevel);
    }

    protected getAggregateResult(pvt: PvtOptions, data: DataResult, args: DataResult, groupDs?: Object[], query?: Query): DataResult {
        if (NexusAdaptor.showDebug)
            console.log("getAggregateResult");
        return super.getAggregateResult(pvt, data, args, groupDs, query);
    }

    /**
     * To generate the predicate based on the filtered query.
     * @param  {Object[]|string[]|number[]} data
     * @param  {Query} query
     * @hidden
     */
    getFiltersFrom(data: Object[] | string[] | number[], query: Query): Predicate {
        if (NexusAdaptor.showDebug)
            console.log("getFiltersFrom");
        return super.getFiltersFrom(data, query);
    }

    protected getQueryRequest(query: Query): Requests {
        if (NexusAdaptor.showDebug)
            console.log("getQueryRequest");
        return super.getQueryRequest(query);
    }

    /**
     * Prepare and returns request body which is used to insert a new record in the table.
     * @param  {DataManager} dm
     * @param  {Object} data
     * @param  {string} tableName
     */
    insert(dm: DataManager, data: Object, tableName: string, query: Query): Object {
        if (NexusAdaptor.showDebug)
            console.log("insert");
        return super.insert(dm, data, tableName, query);
    }

    /**
     * Add the aggregate query to the adaptor`s option.
     * @param  {Aggregates[]} e
     * @returns void
     */
    onAggregates(e: Aggregates[]): void {
        if (NexusAdaptor.showDebug)
            console.log("onAggregates");
        super.onAggregates(e);
    }

    /**
     * Add the group query to the adaptor`s option.
     * @param  {Object[]} e
     * @returns void
     */
    onGroup(e: QueryOptions[]): QueryOptions[] {
        if (NexusAdaptor.showDebug)
            console.log("onGroup");
        return super.onGroup(e);
    }

    /**
     * Process the query to generate request body.
     * @param  {DataManager} dm
     * @param  {Query} query
     * @param  {Object[]} hierarchyFilters?
     * @returns p
     */
    processQuery(dm: DataManager, query: Query, hierarchyFilters?: Object[]): Object {
        if (NexusAdaptor.showDebug)
            console.log("processQuery");
        return super.processQuery(dm, query, hierarchyFilters);
    }

    /**
     * Return the data from the data manager processing.
     * @param  {DataResult} data
     * @param  {DataOptions} ds?
     * @param  {Query} query?
     * @param  {XMLHttpRequest} xhr?
     * @param  {Object} request?
     * @param  {CrudOptions} changes?
     */
    processResponse(data: DataResult, ds?: DataOptions, query?: Query, xhr?: XMLHttpRequest, request?: Object, changes?: CrudOptions): DataResult {
        if (NexusAdaptor.showDebug)
            console.log("processResponse");

        try {
            nexusMain.ui?.onHttpResponse({
                type: "ej2Adaptor",
                data: data,
                ds: ds,
                query: query,
                xhr: xhr,
                request: request,
                changes: changes
            } as HttpResponseEvtAdaptor);
        } catch (e) {
            console.error(e);
        }

        return super.processResponse(data, ds, query, xhr, request, changes);
    }

    /**
     * Prepare and return request body which is used to remove record from the table.
     * @param  {DataManager} dm
     * @param  {string} keyField
     * @param  {number|string} value
     * @param  {string} tableName
     */
    remove(dm: DataManager, keyField: string, value: number | string, tableName: string, query: Query): Object {
        if (NexusAdaptor.showDebug)
            console.log("remove");
        return super.remove(dm, keyField, value, tableName, query);
    }

    /**
     * Prepare and return request body which is used to update record.
     * @param  {DataManager} dm
     * @param  {string} keyField
     * @param  {Object} value
     * @param  {string} tableName
     */
    update(dm: DataManager, keyField: string, value: Object, tableName: string, query: Query): Object {
        if (NexusAdaptor.showDebug)
            console.log("update");
        return super.update(dm, keyField, value, tableName, query);
    }


}