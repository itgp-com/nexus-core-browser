import {UrlAdaptor}                                    from "@syncfusion/ej2-data";
import {DataManager, DataOptions}                      from "@syncfusion/ej2-data/src/manager";
import {ParamOption, Predicate, Query, QueryOptions}                  from "@syncfusion/ej2-data/src/query";
import {CrudOptions, DataResult, PvtOptions, RemoteOptions, Requests} from "@syncfusion/ej2-data/src/adaptors";
import {Aggregates}                                                   from "@syncfusion/ej2-data/src/util";

export class UrlAdaptor_FixCount extends UrlAdaptor {
   original: UrlAdaptor;

   /**
    * Constructor for Adaptor class
    * @param  {DataOptions} ds?
    * @hidden
    * @returns aggregates
    */
   constructor(ds?: DataOptions){
      super(ds);
   }

   static create(original:UrlAdaptor){
      let instance = new UrlAdaptor_FixCount();
      instance.original = original;
      return instance;
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
   processResponse(data: DataResult, ds?: DataOptions, query?: Query, xhr?: XMLHttpRequest, request?: Object, changes?: CrudOptions): DataResult{
      let dataResult:DataResult = this.original.processResponse(data, ds, query, xhr, request, changes);
      if ( dataResult && dataResult.count){
         (ds as any).length = dataResult.count;
      }
      return dataResult;
   }


   /**
    * Process the query to generate request body.
    * @param  {DataManager} dm
    * @param  {Query} query
    * @param  {Object[]} hierarchyFilters?
    * @returns p
    */
   processQuery(dm: DataManager, query: Query, hierarchyFilters?: Object[]): Object{
      return this.original.processQuery(dm, query,hierarchyFilters);
   }
   // private getRequestQuery;
   /**
    * Convert the object from processQuery to string which can be added query string.
    * @param  {Object} req
    * @param  {Query} query
    * @param  {DataManager} dm
    */
   convertToQueryString(request: Object, query: Query, dm: DataManager): string{
      return this.original.convertToQueryString(request, query,dm);
   }

   /**
    * Add the group query to the adaptor`s option.
    * @param  {Object[]} e
    * @returns void
    */
   onGroup(e: QueryOptions[]): QueryOptions[]{
      return this.original.onGroup(e);
   }
   /**
    * Add the aggregate query to the adaptor`s option.
    * @param  {Aggregates[]} e
    * @returns void
    */
   onAggregates(e: Aggregates[]): void{
      this.original.onAggregates(e);
   }
   /**
    * Prepare the request body based on the newly added, removed and updated records.
    * The result is used by the batch request.
    * @param  {DataManager} dm
    * @param  {CrudOptions} changes
    * @param  {Object} e
    */
   batchRequest(dm: DataManager, changes: CrudOptions, e: Object, query: Query, original?: Object): Object{
      return this.original.batchRequest(dm, changes, e, query, original);
   }
   /**
    * Method will trigger before send the request to server side.
    * Used to set the custom header or modify the request options.
    * @param  {DataManager} dm
    * @param  {XMLHttpRequest} request
    * @returns void
    */
   beforeSend(dm: DataManager, request: XMLHttpRequest): void{
      return this.original.beforeSend(dm,request);
   }
   /**
    * Prepare and returns request body which is used to insert a new record in the table.
    * @param  {DataManager} dm
    * @param  {Object} data
    * @param  {string} tableName
    */
   insert(dm: DataManager, data: Object, tableName: string, query: Query): Object{
      return this.original.insert(dm, data,tableName, query);
   }
   /**
    * Prepare and return request body which is used to remove record from the table.
    * @param  {DataManager} dm
    * @param  {string} keyField
    * @param  {number|string} value
    * @param  {string} tableName
    */
   remove(dm: DataManager, keyField: string, value: number | string, tableName: string, query: Query): Object{
      return this.original.remove(dm, keyField, value, tableName, query);
   }

   /**
    * Prepare and return request body which is used to update record.
    * @param  {DataManager} dm
    * @param  {string} keyField
    * @param  {Object} value
    * @param  {string} tableName
    */
   update(dm: DataManager, keyField: string, value: Object, tableName: string, query: Query): Object{
      return this.original.update(dm,keyField,value, tableName,query);
   }

   /**
    * To generate the predicate based on the filtered query.
    * @param  {Object[]|string[]|number[]} data
    * @param  {Query} query
    * @hidden
    */
   getFiltersFrom(data: Object[] | string[] | number[], query: Query): Predicate{
      return this.original.getFiltersFrom(data, query);
   }

   protected getAggregateResult(pvt: PvtOptions, data: DataResult, args: DataResult, groupDs?: Object[], query?: Query): DataResult {
      return this.getAggregateResult(pvt, data, args, groupDs, query); //<-- no local variables changed
   }

    protected getQueryRequest(query: Query): Requests{
      return this.getQueryRequest(query);
    }

   addParams(options: {
      dm: DataManager;
      query: Query;
      params: ParamOption[];
      reqParams: {
         [key: string]: Object;
      };
   }): void{
      this.original.addParams(options);
   }


//----------------------- Adaptor ----------------------------
}