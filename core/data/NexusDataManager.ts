import {DataManager, Query} from '@syncfusion/ej2-data';
import {AdaptorOptions, DataOptions} from "@syncfusion/ej2-data/src/manager";
import {isObject} from 'lodash';
import {isN2Grid, N2Grid} from '../gui2/ej2/ext/N2Grid';
import {N2} from '../gui2/N2';
import {nexusMain} from "../NexusMain";
import {ExecuteQueryAlwaysEvent} from './Ej2Comm';
import {isNexusAdaptor, NexusAdaptor} from './NexusAdaptor';
import {HttpRequestEvtDataManager, HttpResponseEvtDataManager} from "./NexusComm";


export interface NexusDataManager_Settings {
    type?: string;
    type_group?: string;
    tablename?: string;
    tablename_is_url?: boolean;
    clone_for_excel_export?: () => NexusDataManager;
    n2?: N2;
    // [key: string] : any; // Index signature to allow additional properties
} // NexusDataManager_Settings


export class NexusDataManager extends DataManager {

    static showDebug: boolean = false;
    readonly isNexusDataManager: boolean = true;

    readonly nexus_settings: NexusDataManager_Settings = {};

    /**
     * Constructor for DataManager class
     */
    constructor(dataSource?: DataOptions | JSON[] | Object[], query?: Query, adaptor?: AdaptorOptions | string) {
        super(dataSource, query, adaptor);
        try {
            if (dataSource && isObject(dataSource) && isNexusAdaptor((dataSource as DataOptions).adaptor)) {
                ((dataSource as DataOptions).adaptor as NexusAdaptor).nexusDataManager = this;
            }
        } catch (e) { console.error(e); }

    } // constructor

    /**
     * Executes the given query with local data source.
     * @param  {Query} query - Defines the query to retrieve data.
     */
    executeLocal(query?: Query): Object[] {
        // Custom logic to execute local query
        if (NexusDataManager.showDebug)
            console.log("NexusDataManager  executeLocal", 'query', query);
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

        if (NexusDataManager.showDebug)
            console.log("NexusDataManager  executeQuery", 'query', query, 'done', done, 'fail', fail, 'always', always);

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
            dm: this,
        };
        try {
            try {
                nexusMain.ui.onHttpRequest(evHttpRequest);

            } catch (e) { console.error(e); }

            try {
                let widget = this.nexus_settings?.n2;
                if (isN2Grid(widget)) {
                    let n2grid = widget as N2Grid;
                    let state = n2grid.state;
                    if (state?.onDMDataManagerExecuteQuery) {
                        state.onDMDataManagerExecuteQuery.call(widget, evHttpRequest);
                    } else if (!(N2Grid.prototype.onDMDataManagerExecuteQuery === n2grid.onDMDataManagerExecuteQuery)) {
                        n2grid.onDMDataManagerExecuteQuery.call(n2grid, evHttpRequest);
                    }

                } // if ( isN2Grid(widget))
            } catch (e) { console.error(e); }

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
                dm: this,
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
        if (NexusDataManager.showDebug)
            console.log("NexusDataManager  insert", 'data', data, 'tableName', tableName, 'query', query, 'position', position);
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
        if (NexusDataManager.showDebug)
            console.log("NexusDataManager  remove", 'keyField', keyField, 'value', value, 'tableName', tableName, 'query', query);
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
        if (NexusDataManager.showDebug)
            console.log("NexusDataManager  saveChanges", 'changes', changes, 'key', key, 'tableName', tableName, 'query', query, 'original', original);
        return super.saveChanges(changes, key, tableName, query, original);
    }

    /**
     * Overrides DataManager's default query with given query.
     * @param  {Query} query - Defines the new default query.
     */
    setDefaultQuery(query: Query): DataManager {
        // Custom logic to set default query
        if (NexusDataManager.showDebug)
            console.log("NexusDataManager  setDefaultQuery", 'query', query);
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
        if (NexusDataManager.showDebug)
            console.log("NexusDataManager  update", 'keyField', keyField, 'value', value, 'tableName', tableName, 'query', query, 'original', original);
        return super.update(keyField, value, tableName, query, original);
    }
} // NexusDataManager


export function isNexusDataManager(obj: any): obj is NexusDataManager {
    return obj && obj.isNexusDataManager == true;
} // isNexusDataManager