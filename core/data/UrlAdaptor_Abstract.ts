import {Aggregates, CrudOptions, DataManager, DataOptions, DataResult, ParamOption, Predicate, PvtOptions, Query, QueryOptions, Requests, UrlAdaptor} from "@syncfusion/ej2-data";


/**
 *
 */
export interface UrlAdaptorListenerRetVal<T = void> {
   stopProcessingSubsequentListeners: boolean;
   // value:T;
}

export interface UrlAdaptorListenerRetValCancellable<T = void> extends UrlAdaptorListenerRetVal<T> {
   cancel: boolean;
}

//---------  Listener exception ---------------
export class UrlAdaptorListenerExceptionEvent {

   exceptionCode ?: string;
   exception: any;

   className  ?: string;

   userMessage?: string;
   other ?: any;

}

export class UrlAdaptorListenerExceptionEventRetVal {

   /**
    * if <code>true</code> then it's the equivalent of the original listener having returned {@link UrlAdaptorListenerRetVal.stopProcessingSubsequentListeners} = <code>true</code>
    *
    * If any of the {@link UrlAdaptorListenerExceptionHandler}s sets this to true, it will be true
    *
    */
   stopProcessingSubsequentListeners: boolean;
}

export interface UrlAdaptorListenerExceptionHandler {
   listenerException(evt: UrlAdaptorListenerExceptionEvent): UrlAdaptorListenerExceptionEventRetVal
}

//-------------- Adaptor Methods ----------------------
export interface BeforeSendListener {
   beforeSend(dm: DataManager, request: Request, adaptor: UrlAdaptor_Abstract): UrlAdaptorListenerRetVal;
}

export class UrlAdaptor_Abstract extends UrlAdaptor {

   public static readonly EXCEPTION_CODE_handleException = 'handleException';
   public static readonly EXCEPTION_CODE_beforeSend      = 'beforeSend';


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

   processQuery(dm: DataManager, query: Query, hierarchyFilters?: Object[]): Object {
      return super.processQuery(dm, query, hierarchyFilters);
   }

   convertToQueryString(request: Object, query: Query, dm: DataManager): string {
      return super.convertToQueryString(request, query, dm);
   }

   processResponse(data: DataResult, ds?: DataOptions, query?: Query, xhr?: Request, request?: Object, changes?: CrudOptions): DataResult {
      return super.processResponse(data, ds, query, xhr, request, changes);
   }

   onGroup(e: QueryOptions[]): QueryOptions[] {
      return super.onGroup(e);
   }

   onAggregates(e: Aggregates[]) {
      super.onAggregates(e);
   }

   batchRequest(dm: DataManager, changes: CrudOptions, e: Object, query: Query, original?: Object): Object {
      return super.batchRequest(dm, changes, e, query, original);
   }

   beforeSend(dm: DataManager, request: Request) {
      let thisX = this;
      if (this.beforeSendListeners.length) {
         let done: boolean = false;
         for (let beforeSendListeners of this.beforeSendListeners) {
            try {
               let val: UrlAdaptorListenerRetVal = beforeSendListeners.beforeSend(dm, request, thisX);
               done                              = val.stopProcessingSubsequentListeners;

            } catch (e) {
               let val = this.handleException({
                                                 exception:     e,
                                                 exceptionCode: UrlAdaptor_Abstract.EXCEPTION_CODE_beforeSend,
                                                 className:     this.constructor.name,
                                              });
               done    = val.stopProcessingSubsequentListeners;

            } // catch

            if (done)
               break; // exit the for loop and don't process subsequent listeners

         } // for
      } // if (this.beforeSendListeners)
   }

   insert(dm: DataManager, data: Object, tableName: string, query: Query): Object {
      return super.insert(dm, data, tableName, query);
   }

   remove(dm: DataManager, keyField: string, value: number | string, tableName: string, query: Query): Object {
      return super.remove(dm, keyField, value, tableName, query);
   }

   update(dm: DataManager, keyField: string, value: Object, tableName: string, query: Query): Object {
      return super.update(dm, keyField, value, tableName, query);
   }

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

   protected handleException(exceptionEvent: UrlAdaptorListenerExceptionEvent): UrlAdaptorListenerExceptionEventRetVal {
      let retVal: UrlAdaptorListenerExceptionEventRetVal = new UrlAdaptorListenerExceptionEventRetVal();

      if (this.urlAdaptorListenerExceptionHandlers.length) {
         let done: boolean = false;
         for (const urlAdaptorListenerExceptionListener of this.urlAdaptorListenerExceptionHandlers) {
            try {
               let val = urlAdaptorListenerExceptionListener.listenerException(exceptionEvent)
               if (val?.stopProcessingSubsequentListeners)
                  retVal.stopProcessingSubsequentListeners = true;
            } catch (e) {
               // recursive call
               let val = this.handleException({
                                                 exception:     e,
                                                 exceptionCode: UrlAdaptor_Abstract.EXCEPTION_CODE_handleException,
                                                 className:     this.constructor.name,
                                              });

               if (val?.stopProcessingSubsequentListeners)
                  done = true;
            }
            if (done)
               break; // exit the for loop
         } // for exception listeners
      } //if  list not empty
      return retVal;
   } // handleException method


} // main class