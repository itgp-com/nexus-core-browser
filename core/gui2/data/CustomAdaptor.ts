import {CrudOptions, DataManager, DataOptions, Query, UrlAdaptor} from '@syncfusion/ej2-data';
import {DataResult, PvtOptions, Requests}                         from "@syncfusion/ej2-data/src/adaptors";
import {ParamOption, Predicate, QueryOptions}                     from "@syncfusion/ej2-data/src/query";
import {Aggregates, Group}                                        from "@syncfusion/ej2-data/src/util";

class CustomAdaptor extends UrlAdaptor {

   /**
    * Constructor for Adaptor class
    * @param  {DataOptions} ds?
    * @hidden
    * @returns aggregates
    */
   constructor(ds?: DataOptions) {
      super(ds);
   }

   //------------ start Adaptor -------------

   // /**
   //  * Returns the data from the query processing.
   //  * @param  {Object} data
   //  * @param  {DataOptions} ds?
   //  * @param  {Query} query?
   //  * @param  {XMLHttpRequest} xhr?
   //  * @returns Object
   //  */
   // processResponse(data: Object, ds?: DataOptions, query?: Query, xhr?: XMLHttpRequest): Object{
   //    console.log("processResponse");
   //    return super.processResponse(data, ds, query, xhr);
   // }
   // ----------- end Adaptor ---------------

   // ------------ start UrlAdaptor ---------


   /**
    * Process the query to generate request body.
    * @param  {DataManager} dm
    * @param  {Query} query
    * @param  {Object[]} hierarchyFilters?
    * @returns p
    */
   processQuery(dm: DataManager, query: Query, hierarchyFilters?: Object[]): Object {
      console.log("processQuery");
      return super.processQuery(dm, query, hierarchyFilters);
   }

   /**
    * Convert the object from processQuery to string which can be added query string.
    * @param  {Object} req
    * @param  {Query} query
    * @param  {DataManager} dm
    */
   convertToQueryString(request: Object, query: Query, dm: DataManager): string {
      console.log("convertToQueryString");
      return super.convertToQueryString(request, query, dm);
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
      console.log("Processing custom response");
      return super.processResponse(data, ds, query, xhr, request, changes);
   }

   /**
    * Add the group query to the adaptor`s option.
    * @param  {Object[]} e
    * @returns void
    */
   onGroup(e: QueryOptions[]): QueryOptions[] {
      console.log("onGroup");
      return super.onGroup(e);
   }

   /**
    * Add the aggregate query to the adaptor`s option.
    * @param  {Aggregates[]} e
    * @returns void
    */
   onAggregates(e: Aggregates[]): void {
      console.log("onAggregates");
      super.onAggregates(e);
   }

   /**
    * Prepare the request body based on the newly added, removed and updated records.
    * The result is used by the batch request.
    * @param  {DataManager} dm
    * @param  {CrudOptions} changes
    * @param  {Object} e
    */
   batchRequest(dm: DataManager, changes: CrudOptions, e: Object, query: Query, original?: Object): Object {
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
      console.log("beforeSend");
      super.beforeSend(dm, request);
   }

   /**
    * Prepare and returns request body which is used to insert a new record in the table.
    * @param  {DataManager} dm
    * @param  {Object} data
    * @param  {string} tableName
    */
   insert(dm: DataManager, data: Object, tableName: string, query: Query): Object {
      console.log("insert");
      return super.insert(dm, data, tableName, query);
   }

   /**
    * Prepare and return request body which is used to remove record from the table.
    * @param  {DataManager} dm
    * @param  {string} keyField
    * @param  {number|string} value
    * @param  {string} tableName
    */
   remove(dm: DataManager, keyField: string, value: number | string, tableName: string, query: Query): Object {
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
      console.log("update");
      return super.update(dm, keyField, value, tableName, query);
   }

   /**
    * To generate the predicate based on the filtered query.
    * @param  {Object[]|string[]|number[]} data
    * @param  {Query} query
    * @hidden
    */
   getFiltersFrom(data: Object[] | string[] | number[], query: Query): Predicate {
      console.log("getFiltersFrom");
      return super.getFiltersFrom(data, query);
   }

   addParams(options: {
      dm: DataManager;
      query: Query;
      params: ParamOption[];
      reqParams: {
         [key: string]: Object;
      };
   }): void {
      console.log("addParams");
      super.addParams(options);
   }

   protected formRemoteGroupedData(data: Group[], level: number, childLevel: number): Group[] {
      console.log("formRemoteGroupedData");
      return super.formRemoteGroupedData(data, level, childLevel);
   }

   protected getAggregateResult(pvt: PvtOptions, data: DataResult, args: DataResult, groupDs?: Object[], query?: Query): DataResult {
      console.log("getAggregateResult");
      return super.getAggregateResult(pvt, data, args, groupDs, query);
   }

   protected getQueryRequest(query: Query): Requests {
      console.log("getQueryRequest");
      return super.getQueryRequest(query);
   }

   // ------------ end UrlAdaptor -----------

}