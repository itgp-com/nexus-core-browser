import {Fetch} from '@syncfusion/ej2-base';
import {CrudOptions, DataManager, DataOptions, Query, UrlAdaptor} from '@syncfusion/ej2-data';
import {DataResult, PvtOptions, Requests} from "@syncfusion/ej2-data/src/adaptors";
import {ParamOption, Predicate, QueryOptions} from "@syncfusion/ej2-data/src/query";
import {Aggregates, Group} from "@syncfusion/ej2-data/src/util";
import {nexusMain} from "../NexusMain";
import {EJBase} from './Ej2Comm';
import {HttpRequestEvtAdaptor, HttpResponseEvtAdaptor} from "./NexusComm";
import {NexusDataManager} from './NexusDataManager';

/**
 * Nexus specific URLAdaptor that allows to intercept the HTTP request and response.
 *
 */
export class NexusAdaptor extends UrlAdaptor {

    static showDebug: boolean;
    readonly isNexusAdaptor: boolean = true;
    nexusDataManager:NexusDataManager;

    /**
     * Constructor for Adaptor class
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
            console.log("NexusAdaptor addParams", 'options', options);

        // super.addParams(options);

        // The code below is copied DIRECTLY from the base class, with the overwriting of parameters allowed (commented out exception for [if (req[tmp.key]) ])
        //----------
        let req = options.reqParams;
        if (options.params.length) {
            req.params = {};
        }
        for (let _i = 0, _a = options.params; _i < _a.length; _i++) {
            let tmp = _a[_i];
            req[tmp.key] = tmp.value;
            if (tmp.fn) {
                req[tmp.key] = tmp.fn.call(options.query, tmp.key, options.query, options.dm);
            }
            (req.params as any)[tmp.key] = req[tmp.key];
        } // for
        //----------------

    } // addParams

    /**
     * Prepare the request body based on the newly added, removed and updated records.
     * The result is used by the batch request.
     */
    batchRequest(dm: DataManager, changes: CrudOptions, e: Object, query: Query, original?: Object): Object {
        if (NexusAdaptor.showDebug)
            console.log("NexusAdaptor batchRequest", 'dm', dm, 'changes', changes, 'e', e, 'query', query, 'original', original);
        return super.batchRequest(dm, changes, e, query, original);
    }

    /**
     * Method will trigger before send the request to server side.
     * Used to set the custom header or modify the request options.
     * @param  {DataManager} dm
     * @param  {XMLHttpRequest} request
     * @returns void
     */
    beforeSend(dm: DataManager, request: Request): void {
        if (NexusAdaptor.showDebug)
            console.log("NexusAdaptor beforeSend" , 'dm', dm, 'request', request);

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
     * @param  {Object} request
     * @param  {Query} query
     * @param  {DataManager} dm
     */
    convertToQueryString(request: Object, query: Query, dm: DataManager): string {
        if (NexusAdaptor.showDebug)
            console.log("NexusAdaptor convertToQueryString", 'request', request, 'query', query, 'dm', dm);
        return super.convertToQueryString(request, query, dm);
    }

    protected formRemoteGroupedData(data: Group[], level: number, childLevel: number): Group[] {
        if (NexusAdaptor.showDebug)
            console.log("NexusAdaptor formRemoteGroupedData", 'data', data, 'level', level, 'childLevel', childLevel);
        return super.formRemoteGroupedData(data, level, childLevel);
    }

    protected getAggregateResult(pvt: PvtOptions, data: DataResult, args: DataResult, groupDs?: Object[], query?: Query): DataResult {
        if (NexusAdaptor.showDebug)
            console.log("NexusAdaptor getAggregateResult", 'pvt', pvt, 'data', data, 'args', args, 'groupDs', groupDs, 'query', query);
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
            console.log("NexusAdaptor getFiltersFrom", 'data', data, 'query', query);
        return super.getFiltersFrom(data, query);
    }

    protected getQueryRequest(query: Query): Requests {
        if (NexusAdaptor.showDebug)
            console.log("NexusAdaptor getQueryRequest", 'query', query);
        return super.getQueryRequest(query);
    }

    /**
     * Prepare and returns request body which is used to insert a new record in the table.
     */
    insert(dm: DataManager, data: Object, tableName: string, query: Query): Object {
        if (NexusAdaptor.showDebug)
            console.log("NexusAdaptor insert", 'dm', dm, 'data', data, 'tableName', tableName, 'query', query);
        return super.insert(dm, data, tableName, query);
    }

    /**
     * Add the aggregate query to the adaptor`s option.
     * @param  {Aggregates[]} ev
     * @returns void
     */
    onAggregates(ev: Aggregates[]): void {
        if (NexusAdaptor.showDebug)
            console.log("NexusAdaptor onAggregates", 'ev', ev);
        super.onAggregates(ev);
    }

    /**
     * Add the group query to the adaptor`s option.
     * @param  {Object[]} ev
     * @returns void
     */
    onGroup(ev: QueryOptions[]): QueryOptions[] {
        if (NexusAdaptor.showDebug)
            console.log("NexusAdaptor onGroup", 'ev', ev);
        return super.onGroup(ev);
    }

    /**
     * Process the query to generate request body.
     *
     * @param {DataManager} dm
     * @param {Query} query
     * @param hierarchyFilters
     * @returns p
     */
    processQuery(dm: DataManager, query: Query, hierarchyFilters?: Object[]): Object {
        if (NexusAdaptor.showDebug)
            console.log("NexusAdaptor processQuery", 'dm', dm, 'query', query, 'hierarchyFilters', hierarchyFilters);
        return super.processQuery(dm, query, hierarchyFilters);
    }

    /**
     * Return the data from the data manager processing.
     */
    processResponse(data: DataResult, ds?: DataOptions, query?: Query, xhr?: Request, request?: Fetch, changes?: CrudOptions): Object{
        if (NexusAdaptor.showDebug)
            console.log("NexusAdaptor processResponse", 'data', data, 'ds', ds, 'query', query, 'xhr', xhr, 'request', request, 'changes', changes);

        // give the onHttpResponse first priority
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

        // Check for Nexus error messages
        if ( data && (data as any)['i_d'] && (data as any)['v_e_r']  ) {
            let retVal = data as EJBase;
            let errMsgLog = retVal.errMsgDisplay
            if ( errMsgLog) {
                console.error(errMsgLog);
                console.error('Full data for the above:', data);
            }

            let errMsgDisplay = retVal.errMsgDisplay;
            if (errMsgDisplay)
                throw data;

        } // if nexus EjBase object

        return super.processResponse(data, ds, query, xhr, request, changes);
    }

    /**
     * Prepare and return request body which is used to remove record from the table.
     */
    remove(dm: DataManager, keyField: string, value: number | string, tableName: string, query: Query): Object {
        if (NexusAdaptor.showDebug)
            console.log("NexusAdaptor remove", 'dm', dm, 'keyField', keyField, 'value', value, 'tableName', tableName, 'query', query);
        return super.remove(dm, keyField, value, tableName, query);
    }

    /**
     * Prepare and return request body which is used to update record.
     */
    update(dm: DataManager, keyField: string, value: Object, tableName: string, query: Query): Object {
        if (NexusAdaptor.showDebug)
            console.log("NexusAdaptor update", 'dm', dm, 'keyField', keyField, 'value', value, 'tableName', tableName, 'query', query);
        return super.update(dm, keyField, value, tableName, query);
    }


} // NexusAdaptor

export function isNexusAdaptor(adaptor: any): adaptor is NexusAdaptor {
    return adaptor && adaptor.isNexusAdaptor === true;
}