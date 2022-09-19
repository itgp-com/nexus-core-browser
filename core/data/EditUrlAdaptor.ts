import {DataManager, Query, UrlAdaptor} from "@syncfusion/ej2-data";
import {getErrorHandler}                from "../CoreErrorHandling";
import {cast}                           from "../BaseUtils";


export class EditUrlAdaptor extends UrlAdaptor {

   private _insertListeners: AdaptorInsertListener[] = [];
   private _jsonListeners: AdaptorJsonListener[]     = [];

   private _updateListeners: AdaptorUpdateListener[] = [];


   insert(dm: DataManager, data: Object, tableName: string, query: Query): Object {
      try {
         if (this.insertListeners) {

            let evt: AdaptorInsertEvent = {
               dm:        dm,
               data:      data,
               tableName: tableName,
               query:     query
            };

            this.insertListeners.forEach(listener => {
               listener(evt);
            });
         }

      } catch (ex) {
         getErrorHandler().displayExceptionToUser(ex);
      }

      let obj = super.insert(dm, data, tableName, query);
      if (!this.jsonListeners)
         return obj; // don't bother if there are no further listeners


      let resultObject: ResultObject = cast(obj, ResultObject);

      let dataString: string = resultObject.data;
      let dataNew: any       = JSON.parse(dataString);

      try {
         if (this.jsonListeners) {

            let evt: AdaptorJsonEvent = {
               action : JsonEventActions.insert,
               data:    dataNew,
            };

            this.jsonListeners.forEach(listener => {
               listener(evt);
            });
         }

      } catch (ex) {
         getErrorHandler().displayExceptionToUser(ex);
      }

      resultObject.data = JSON.stringify(dataNew);
      return resultObject;
   }

   addInsertListener<T>(listener: AdaptorInsertListener<T>) {
      if (listener)
         this.insertListeners.push(listener);
   } // add

   addJsonListener(listener: AdaptorJsonListener) {
      if (listener)
         this.jsonListeners.push(listener);

   } // add


   get insertListeners(): AdaptorInsertListener[] {
      return this._insertListeners;
   }

   set insertListeners(value: AdaptorInsertListener[]) {
      this._insertListeners = value;
   }


   get jsonListeners(): AdaptorJsonListener[] {
      return this._jsonListeners;
   }

   set jsonListeners(value: AdaptorJsonListener[]) {
      this._jsonListeners = value;
   }


   // -------------------------- Update Listener ---------------------------------


   update(dm: DataManager, keyField: string, value: Object, tableName: string, query: Query): Object {

      let stopEvent = false;
      try {
         if (this.updateListeners) {

            let evt: AdaptorUpdateEvent = {
               dm:        dm,
               keyField:  keyField,
               value:     value,
               tableName: tableName,
               query:     query,
               stopUpdate: false,
            };


            for (let i = 0; i < this.updateListeners.length; i++) {
               let listener = this.updateListeners[i];
               listener(evt);
               if (evt.stopUpdate){
                  stopEvent = true;
                  break;
               }
            } // for

         }

      } catch (ex) {
         getErrorHandler().displayExceptionToUser(ex);
      }


      if ( stopEvent){
         dm.dataSource.offline = true;
      }

      let obj = super.update(dm, keyField, value, tableName, query);

      dm.dataSource.offline = false;

      if (!this.jsonListeners)
         return obj; // don't bother if there are no further listeners


      let resultObject: ResultObject = cast(obj, ResultObject);

      let dataString: string = resultObject.data;
      let dataNew: any       = JSON.parse(dataString);

      try {
         if (this.jsonListeners) {

            let evt: AdaptorJsonEvent = {
               action: JsonEventActions.update,
               data:   dataNew,
            };

            this.jsonListeners.forEach(listener => {
               listener(evt);
            });
         }

      } catch (ex) {
         getErrorHandler().displayExceptionToUser(ex);
      }

      resultObject.data = JSON.stringify(dataNew);
      return resultObject;
   } //update

   addUpdateListener<T>(listener: AdaptorUpdateListener<T>) {
      if (listener)
         this.updateListeners.push(listener);
   } // add

   get updateListeners(): AdaptorUpdateListener[] {
      return this._updateListeners;
   }

   set updateListeners(value: AdaptorUpdateListener[]) {
      this._updateListeners = value;
   }


   // //----------------------------------------------------------------------
   // beforeSend(dm: DataManager, request: XMLHttpRequest): void{
   //    super.beforeSend(dm, request);
   // }

} // class EditUrlAdaptor

//--------------------------- Helper Classes -----------------------

class ResultObject<T = any> {
   type: string; // ex: "POST"
   url: string; // ex: "core/rec/aaaaa/ej2crud"
   data: T;
}


//------------------ Insert Helper Classes and Exports -------------------------
export class AdaptorInsertEvent<T = any> {
   dm: DataManager;
   data: T;
   tableName: string;
   query: Query;
}

export class AdaptorJsonEvent {
   action: JsonEventActions;
   data: any;
}

export enum JsonEventActions  {
   insert="insert",
   update="update"
}

export type AdaptorInsertListener<T = any> = (insertEvent: AdaptorInsertEvent<T>) => void;
export type AdaptorJsonListener = (jsonEvent: AdaptorJsonEvent) => void;


//------------------ Update Helper Classes and Exports -------------------------
export class AdaptorUpdateEvent<T = any> {
   dm: DataManager;
   keyField: string;
   value: T; // Object
   tableName: string;
   query: Query;
   stopUpdate: boolean;
}

export type AdaptorUpdateListener<T = any> = (updateEvent: AdaptorUpdateEvent<T>) => void;