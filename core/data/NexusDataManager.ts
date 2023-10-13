import {DataManager, Query} from '@syncfusion/ej2-data';
import {AdaptorOptions, DataOptions} from "@syncfusion/ej2-data/src/manager";
import {nexusMain} from "../NexusMain";
import {HttpRequestEvtDataManager, HttpResponseEvtDataManager} from "./NexusComm";


interface ExecuteQueryCommon {
    query?: Query;
}

export interface ExecuteQueryFailEvent extends ExecuteQueryCommon {
    error?: XMLHttpRequest;
}

export interface ExecuteQueryDoneEvent extends ExecuteQueryCommon {
    actual: any;
    aggregates?: any;
    count: number;
    request?: string;
    result?: any | any[];
    virtualSelectRecords?: any;
    xhr: XMLHttpRequest;
}

export interface ExecuteQueryAlwaysEvent extends ExecuteQueryDoneEvent, ExecuteQueryFailEvent {
}


export class NexusDataManager extends DataManager {

    static DEBUG_ON: boolean = false;

    /**
     * Constructor for DataManager class
     */
    constructor(dataSource?: DataOptions | JSON[] | Object[], query?: Query, adaptor?: AdaptorOptions | string) {
        super(dataSource, query, adaptor);
    }

    /**
     * Executes the given query with local data source.
     * @param  {Query} query - Defines the query to retrieve data.
     */
    executeLocal(query?: Query): Object[] {
        // Custom logic to execute local query
        if (NexusDataManager.DEBUG_ON)
            console.log("executeLocal");
        return super.executeLocal(query);
    }

    /**
     * Executes the given query with either local or remote data source.
     * It will be executed as asynchronously and returns Promise object which will be resolved or rejected after action completed.
     * @param  {Query|Function} query - Defines the query to retrieve data.
     * @param  {Function} done - Defines the callback function and triggers when the Promise is resolved.
     * @param  {Function} fail - Defines the callback function and triggers when the Promise is rejected.
     * @param  {Function} always - Defines the callback function and triggers when the Promise is resolved or rejected.
     */
    executeQuery(query: Query | Function, done?: Function, fail?: Function, always?: Function): Promise<Response> {

        if (NexusDataManager.DEBUG_ON)
            console.log("executeQuery");

        let realQuery: Query;
        let realDoneFunction;
        let realFailFunction;
        let realAlwaysFunction;

        if (typeof query === 'function') {
            realQuery = null;
            realDoneFunction = query;
            realFailFunction = done;
            realAlwaysFunction = fail;
        } else {
            realQuery = query as Query;
            realDoneFunction = done;
            realFailFunction = fail;
            realAlwaysFunction = always;
        }


        let evHttpRequest: HttpRequestEvtDataManager = {
            type: "ej2DataManager",
            query: realQuery,
            done: realDoneFunction,
            fail: realFailFunction,
            always: realAlwaysFunction,
        };
        try {
            nexusMain.ui.onHttpRequest(evHttpRequest);

            // override the query, done, fail, always functions in case they were changed
            realQuery = evHttpRequest.query;
            realDoneFunction = evHttpRequest.done;
            realFailFunction = evHttpRequest.fail;
            realAlwaysFunction = evHttpRequest.always;
        } catch (e) {
            console.error(e);
        }


        let fnAlwaysParent = realAlwaysFunction;
        let fnAlways: Function = (evt ?: ExecuteQueryAlwaysEvent | any) => {
            nexusMain.ui.onHttpResponse({
                type: "ej2DataManager",
                evt: evt,
            } as HttpResponseEvtDataManager)

            if (fnAlwaysParent)
                fnAlwaysParent(evt);
        } // fnAlways

        return super.executeQuery(realQuery, realDoneFunction, realFailFunction, fnAlways);
    }

    /**
     * Inserts new record in the given table.
     * @param  {Object} data - Defines the data to insert.
     * @param  {string|Query} tableName - Defines the table name.
     * @param  {Query} query - Sets default query for the DataManager.
     * @param  {number} position - not documented by Syncfusion as of Jan 2023
     */
    insert(data: Object, tableName?: string | Query, query?: Query, position?: number): Object | Promise<Object> {
        // Custom logic to insert data
        if (NexusDataManager.DEBUG_ON)
            console.log("insert");
        return super.insert(data, tableName, query, position);
    }

    /**
     * Removes data from the table with the given key.
     * @param  {string} keyField - Defines the column field.
     * @param  {Object} value - Defines the value to find the data in the specified column.
     * @param  {string|Query} tableName - Defines the table name
     * @param  {Query} query - Sets default query for the DataManager.
     */
    remove(keyField: string, value: Object, tableName?: string | Query, query?: Query): Object | Promise<Object> {
        // Custom logic to remove data
        if (NexusDataManager.DEBUG_ON)
            console.log("remove");
        return super.remove(keyField, value, tableName, query);
    }

    /**
     * Save bulk changes to the given table name.
     * User can add a new record, edit an existing record, and delete a record at the same time.
     * If the datasource from remote, then updated in a single post.
     * @param  {Object} changes - Defines the CrudOptions.
     * @param  {string} key - Defines the column field.
     * @param  {string|Query} tableName - Defines the table name.
     * @param  {Query} query - Sets default query for the DataManager.
     * @param {Object} original - not documented by Syncfusion
     */
    saveChanges(changes: Object, key?: string, tableName?: string | Query, query?: Query, original?: Object): Promise<Object> | Object {
        // Custom logic to save changes
        if (NexusDataManager.DEBUG_ON)
            console.log("saveChanges");
        return super.saveChanges(changes, key, tableName, query, original);
    }

    /**
     * Overrides DataManager's default query with given query.
     * @param  {Query} query - Defines the new default query.
     */
    setDefaultQuery(query: Query): DataManager {
        // Custom logic to set default query
        if (NexusDataManager.DEBUG_ON)
            console.log("setDefaultQuery");
        return super.setDefaultQuery(query);
    }

    /**
     * Updates existing record in the given table.
     * @param  {string} keyField - Defines the column field.
     * @param  {Object} value - Defines the value to find the data in the specified column.
     * @param  {string|Query} tableName - Defines the table name
     * @param  {Query} query - Sets default query for the DataManager.
     * @param  {Object} original - not documented by Syncfusion as of Jan 2023
     */
    update(keyField: string, value: Object, tableName?: string | Query, query?: Query, original?: Object): Object | Promise<Object> {
        // Custom logic to update data
        if (NexusDataManager.DEBUG_ON)
            console.log("update");
        return super.update(keyField, value, tableName, query, original);
    }
}