import {Aggregates, CrudOptions, DataManager, DataOptions, DataResult, ParamOption, Predicate, PvtOptions, Query, QueryOptions, Requests, UrlAdaptor} from "@syncfusion/ej2-data";
import {Group}                                                                                                                                        from "@syncfusion/ej2-data/src/util";


/**
 *
 */
export interface URLAdaptorCoreResponse<T = void> {
   stopProcessingDownstreamListeners: boolean;
   // value:T;
}

export interface UrlAdaptorCoreCancellable<T = void> extends URLAdaptorCoreResponse<T> {
   cancel: boolean;
}

//---------  Listener exception ---------------
export class EvtUrlAdaptorException {

   exceptionCode ?: string;
   exception: any;

   className  ?: string;

   userMessage?: string;
   other ?: any;

}

export class EvtUrlAdaptorListenerExceptionRetVal {

   /**
    * if <code>true</code> then it's the equivalent of the original listener having returned {@link UrlAdaptorListenerRetVal.stopProcessingDownstreamListeners} = <code>true</code>
    *
    * If any of the {@link UrlAdaptorListenerExceptionHandler}s sets this to true, it will be true
    *
    */
   stopProcessingDownstreamListeners: boolean;
}

export interface UrlAdaptorListenerExceptionHandler {
   listenerException(evt: EvtUrlAdaptorException): EvtUrlAdaptorListenerExceptionRetVal
}

//-------------- Adaptor Methods ----------------------

export class EvtBeforeSendListener {
   dm: DataManager;
   request: XMLHttpRequest;
   adaptor: UrlAdaptorCore;
}


export interface BeforeSendListener {
   beforeSend(evt:EvtBeforeSendListener): URLAdaptorCoreResponse;
}

export class UrlAdaptorCore extends UrlAdaptor {

   public static readonly EXCEPTION_CODE_handleException = 'handleException';
   public static readonly EXCEPTION_CODE_beforeSend      = 'beforeSend';

   // constructor(ds?:DataOptions) {
   //    super();
   // }


   /**
    * List of exception handlers in case any of the listeners trigger an exception
    */
   readonly urlAdaptorListenerExceptionHandlers: UrlAdaptorListenerExceptionHandler[] = []

   /**
    * List of listeners that will be triggered in the {@link beforeSend} method.
    *
    * List is completely open to the developer to edit and organize order of.
    */
   readonly beforeSendListeners: BeforeSendListener[] = []

   /**
    * Process the query to generate request body.
    * @param  {DataManager} dm
    * @param  {Query} query
    * @param  {Object[]} hierarchyFilters?
    * @returns p
    */

   /**
    * Convert the object from processQuery to string which can be added query string.
    * @param  {Query} query
    * @param  {DataManager} dm
    * @param hierarchyFilters
    */
   processQuery(dm: DataManager, query: Query, hierarchyFilters?: Object[]): Object {
      return super.processQuery(dm, query, hierarchyFilters);
   }

   /**
    * Convert the object from processQuery to string which can be added query string.
    * @param  {Object} req
    * @param  {Query} query
    * @param  {DataManager} dm
    */
   convertToQueryString(request: Object, query: Query, dm: DataManager): string {
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
      return super.processResponse(data, ds, query, xhr, request, changes);
   }

   protected formRemoteGroupedData(data: Group[], level: number, childLevel: number): Group[]{
      return super.formRemoteGroupedData(data, level, childLevel);
   }

   /**
    * Add the group query to the adaptor`s option.
    * @param  {Object[]} e
    * @returns void
    */
   onGroup(e: QueryOptions[]): QueryOptions[] {
      return super.onGroup(e);
   }


   /**
    * Add the aggregate query to the adaptor`s option.
    * @param  {Aggregates[]} e
    * @returns void
    */
   onAggregates(e: Aggregates[]) {
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
      return super.batchRequest(dm, changes, e, query, original);
   }


   /**
    * Method will trigger before send the request to server side.
    * Used to set the custom header or modify the request options.
    * @param  {DataManager} dm
    * @param  {XMLHttpRequest} request
    * @returns void
    */
   beforeSend(dm: DataManager, request: XMLHttpRequest) {
      let thisX = this;
      if (this.beforeSendListeners.length) {
         let done: boolean = false;
         for (let beforeSendListeners of this.beforeSendListeners) {
            try {
               let val: URLAdaptorCoreResponse = beforeSendListeners.beforeSend({dm:dm, request:request, adaptor:thisX});
               done                              = val.stopProcessingDownstreamListeners;

            } catch (e) {
               let val = this.handleException({
                                                 exception:     e,
                                                 exceptionCode: UrlAdaptorCore.EXCEPTION_CODE_beforeSend,
                                                 className:     this.constructor.name,
                                              });
               done    = val.stopProcessingDownstreamListeners;

            } // catch

            if (done)
               break; // exit the for loop and don't process subsequent listeners

         } // for
      } // if (this.beforeSendListeners)
   }


   /**
    * Prepare and returns request body which is used to insert a new record in the table.
    * @param  {DataManager} dm
    * @param  {Object} data
    * @param  {string} tableName
    */
   insert(dm: DataManager, data: Object, tableName: string, query: Query): Object {
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
      return super.update(dm, keyField, value, tableName, query);
   }

   /**
    * To generate the predicate based on the filtered query.
    * @param  {Object[]|string[]|number[]} data
    * @param  {Query} query
    * @hidden
    */
   getFiltersFrom(data: Object[] | string[] | number[], query: Query): Predicate {
      return super.getFiltersFrom(data, query);
   }

   protected getAggregateResult(pvt: PvtOptions, data: DataResult, args: DataResult, groupDs?: Object[], query?: Query): DataResult {
      return super.getAggregateResult(pvt, data, args, groupDs, query);
   }

   protected getQueryRequest(query: Query): Requests {
      return super.getQueryRequest(query);
   }

   addParams(options: { dm: DataManager; query: Query; params: ParamOption[]; reqParams: { [p: string]: Object } }) {
      super.addParams(options);
   }


   //-------------------- Additional methods that UrlAdaptor does not have ----------------

   protected handleException(exceptionEvent: EvtUrlAdaptorException): EvtUrlAdaptorListenerExceptionRetVal {
      let retVal: EvtUrlAdaptorListenerExceptionRetVal = new EvtUrlAdaptorListenerExceptionRetVal();

      if (this.urlAdaptorListenerExceptionHandlers.length) {
         let done: boolean = false;
         for (const urlAdaptorListenerExceptionListener of this.urlAdaptorListenerExceptionHandlers) {
            try {
               let val = urlAdaptorListenerExceptionListener.listenerException(exceptionEvent)
               if (val?.stopProcessingDownstreamListeners)
                  retVal.stopProcessingDownstreamListeners = true;
            } catch (e) {
               // recursive call
               let val = this.handleException({
                                                 exception:     e,
                                                 exceptionCode: UrlAdaptorCore.EXCEPTION_CODE_handleException,
                                                 className:     this.constructor.name,
                                              });

               if (val?.stopProcessingDownstreamListeners)
                  done = true;
            }
            if (done)
               break; // exit the for loop
         } // for exception listeners
      } //if  list not empty
      return retVal;
   } // handleException method


} // main class