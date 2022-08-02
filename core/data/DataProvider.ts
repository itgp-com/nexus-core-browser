import * as _           from "lodash";
import {
   classArgArrayVal,
   ClassArgInstanceOrArray,
   classArgInstanceOrArrayVal, classArgInstanceVal,
   isA, noArgsFunction, voidFunction,
} from "../BaseUtils";
import {AbstractWidget} from "../gui/AbstractWidget";

export type DataProviderFilterOptionalArgs = (any | noArgsFunction);
export type DataProviderFilter<T> = (provider: IDataProvider, optionalArgs: DataProviderFilterOptionalArgs) => T;


export type Cls<T> = { new(args: any): T };

export class ValueInstance<T> {
   private _class: Cls<T>;
   private _instance: ClassArgInstanceOrArray<T>; // values and functions that yield values allowed here
   private _trackChanges: boolean;
   private _previousInstance: (T | T[]); // only values allowed here

   constructor(classArg: Cls<T>, instanceArg: ClassArgInstanceOrArray<T>, trackChanges: boolean = false) {
      this._instance    = instanceArg; // directly write the value first (no setter)
      this.class        = classArg;
      this.trackChanges = trackChanges;
      this.instance     = instanceArg; // set this again so that if trackChange is on, previousInstance can be same as existing instance
   }

   get instance(): ClassArgInstanceOrArray<T> {
      return this._instance;
   }

   set instance(value: ClassArgInstanceOrArray<T>) {
      if (this.trackChanges) {
         try {
            let actualInstanceValue = classArgInstanceOrArrayVal(this.instance);
            this.previousInstance   = _.cloneDeep(actualInstanceValue);
         } catch (ex) {
            console.log(ex);
         }
      }
      this._instance = value;
   }

   get trackChanges(): boolean {
      return this._trackChanges;
   }

   set trackChanges(value: boolean) {
      this._trackChanges = value;
   }

   get previousInstance(): T[] | T {
      return this._previousInstance;
   }

   set previousInstance(value: T[] | T) {
      this._previousInstance = value;
   }

   get class(): Cls<T> {
      return this._class;
   }

   set class(value: Cls<T>) {
      this._class = value;
   }

};

export class DataByClass<T> {
   class: Cls<T>;
   instance: ClassArgInstanceOrArray<T>
}

export function isDataByClass(arg: DataProviderValue<any>): arg is DataByClass<any> {
   if (!arg)
      return false;
   let maybe: DataByClass<any> = (arg as DataByClass<any>);
   return (maybe.class != undefined && maybe.instance != undefined);
}

export class DataByStringId<T> {
   key: string;
   instance: ClassArgInstanceOrArray<T>
}

export function isDataByStringId(arg: DataProviderValue<any>): arg is DataByStringId<any> {
   if (!arg)
      return false;
   let maybe: DataByStringId<any> = (arg as DataByStringId<any>);
   return (maybe.key != undefined && maybe.instance != undefined);
}

export  type DataProviderValue<T> = (DataByClass<T> | DataByStringId<T>);

export interface IDataProvider<T = any> {
   dataProviderByClass<T>(cls: Cls<any>): IDataProviderSimple<T>;

   dataProviderByName<T>(id: string): IDataProviderSimple<T>;

   valueByClass(cls: Cls<any>): ClassArgInstanceOrArray<T>;

   valueByName(id: string): ClassArgInstanceOrArray<T>;

}

export interface IDataProviderSimple<T = any> extends IDataProvider<T> {
   dataValue: ClassArgInstanceOrArray<T>;
   trackChanges: boolean;

   changeListeners: DataProviderChangeListener<ClassArgInstanceOrArray<T>> [];

   addChangeListener(listener: DataProviderChangeListener<ClassArgInstanceOrArray<T>>): void;

   removeChangeListener(listener: DataProviderChangeListener<ClassArgInstanceOrArray<T>>): void;

   fireChange(evt: DataProviderChangeEvent<ClassArgInstanceOrArray<T>>): void;

}

export enum DataProviderType {
   DataByClass,
   DataByStringId
}

export class DataProviderChangeEvent<T> {
   /**
    * The atomic DataProvider that triggered the event change.
    * Will be automatically filled by fireEvent
    */
   dataProvider ?: DataProvider; // filed in by fireEvent method

   /**
    * Filled in by the firedEvent method itself if empty
    * Since the return value is of type ClassArgInstanceOrArray<T>, the return value
    * could be T, T[], but could also be a function. Either ()=>T or ()=>T[]
    *
    * To ensure you have an actual value please call one of the following {@link CoreUtils}
    * {@link ClassArgInstanceOrArray}
    * {@link classArgInstanceVal}
    * {@link classArgArrayVal}
    *
    *
    *
    */
   dataProviderValue  ?: ClassArgInstanceOrArray<T>;  // filled in by the firedEvent method

   /**
    * The name of the property being changed (if available)
    * It is optional
    */
   propertyName ?: string;

   /**
    * The new value being set
    */
   value: any;

   /**
    * The previous value if available (undefined if not set, null or value if set)
    */
   previousValue ?: any;

   error?: boolean; // is there an error after the update ?
   errorTxt?: string; // if there's an error this is the error message
   extras?: Map<string, any>;

   /**
    * If in the course of processing the change failed for any reason, the developer should
    * set the error flag to true, and call this function in order to inform the process that
    * fired the change event that the change has failed.
    *
    * That process that created the event can then take the appropriate steps to undo any actions
    * that would have happened if the change was successful
    *
    * When the changeFailed method finishes, it should trigger the optional  changeFailedFinished function
    * so that further action can now be taken by the class that triggered the changeFailed (in case changeFailed does asynchronous processing)
    */
   changeFailed ?: (changeFailedFinished ?: ()=>void )=>void;

   /**
    * This function is automatically called if no errors were detected during the firing of the event
    */
   changeSuccessful ?: voidFunction;
}

export interface DataProviderChangeListener<T> {
   dataProviderChanged(evt: DataProviderChangeEvent<T>): Promise<void>;
}


export class Args_DataProvider<T> {
   value: DataProviderValue<T>;
   children ?: AbstractWidget[];
   trackChanges ?: boolean           = false;
   /**
    * By default, the Data Provider will issue a refresh to any children when a {@link fireChange} is triggered.
    * Set this property to null to disable that
    */
   disableRefreshOnChange ?: boolean = false;
}

export class DataProvider<T = any> extends AbstractWidget implements IDataProviderSimple<T> {
   /**
    * This is what identifies a DataProvider (since interfaces cannot be queried for instanceof in Typescript )
    */


   private _type: DataProviderType;
   private _value: ValueInstance<T>;
   private _dataId: string;

   private _changeListeners: DataProviderChangeListener<ClassArgInstanceOrArray<T>>[] = [];
   private _trackChanges: boolean                                                     = false;
   private _argsDataProvider: Args_DataProvider<T>;

   private constructor(argsDataProvider: Args_DataProvider<T>) {
      super();


   }

   //----------------- static constructor(s)---------------------
   static create<T>(argsDataProvider: Args_DataProvider<T>): DataProvider<T> {
      let instance: DataProvider<T> = new DataProvider<T>(argsDataProvider);
      instance._argsDataProvider    = argsDataProvider;

      // noinspection DuplicatedCode
      if (argsDataProvider) {
         let dpVal = argsDataProvider.value;

         if (isDataByClass(dpVal)) {
            instance._type = DataProviderType.DataByClass;

            // if (dpVal as DataByClass<T>) {
            let classArgs: DataByClass<T> = <DataByClass<T>>dpVal; // for clarity only - Typescript should know that dpVal is DataByClass
            instance._value               = new ValueInstance<T>(classArgs.class, classArgs.instance, argsDataProvider.trackChanges);
            instance._dataId              = classArgs.class.name; // store the class name
         } else if (dpVal as DataByStringId<T>) {
            instance._type = DataProviderType.DataByStringId;

            let idArgs: DataByStringId<T> = <DataByStringId<T>>dpVal;
            instance._dataId              = idArgs.key;
            instance._value               = new ValueInstance<T>(idArgs.instance.constructor.prototype, idArgs.instance, argsDataProvider.trackChanges);
         } else {
            throw "ProviderStorage has not implemented data type handling for: " + JSON.stringify(dpVal);
         }


         if (argsDataProvider.children) {
            instance.children = argsDataProvider.children; // this is a function call not a straight assignment to a variable
         }

      }

      return instance;
   }


   // -------------------- IDataProvider Interface implementation ---------------------------


   dataProviderByClass<T>(cls: Cls<any>): IDataProviderSimple<T> {
      if (this.dataType && this.dataValue) {
         if (
            (cls === this.dataType || isA(this.dataType, cls)) &&
            this.dataValue
         ) {
            return <IDataProviderSimple<T>>(this as any);
         }

         if (this.dataType && cls === this.dataType && this.dataValue && Array.isArray(this.dataValue)) {
            return <IDataProviderSimple<T>>(this as any);
         }
      } // if ( this.dataType && this.dataValue)
      return null;
   }

   dataProviderByName<T>(id: string): IDataProviderSimple<T> {
      if (id) {
         if (id == this.dataId)
            return <IDataProviderSimple<T>>(this as any);
      }
      return null;
   }


   valueByClass(cls: Cls<any>): ClassArgInstanceOrArray<T> {
      if (this.dataType && this.dataValue) {
         if (
            (cls === this.dataType || isA(this.dataType, cls)) &&
            this.dataValue
         ) {
            return classArgInstanceOrArrayVal<T>(this.dataValue);
         }

         if (this.dataType && cls === this.dataType && this.dataValue && Array.isArray(this.dataValue)) {
            return classArgInstanceOrArrayVal<T>(this.dataValue);
         }
      } // if ( this.dataType && this.dataValue)
      return null;
   }

   valueByName(id: string): ClassArgInstanceOrArray<T> {
      if (id) {
         if (id == this.dataId)
            return classArgInstanceOrArrayVal<T>(this.dataValue);
      }
      return null;
   }


   //-------------------- IDataProviderSimple implementation -----------------------
   /**
    * Returns the class if the Provider received a class type when initialized, or null if
    * the data provider was created using the string id.
    */
   get dataType(): Cls<T> {
      if (this._value)
         return this._value.class;
      else
         return undefined;
   }

   get dataValue(): ClassArgInstanceOrArray<T> {
      if (this._value) {
         return this._value.instance;
      } else {
         return null;
      }
   }

   set dataValue(instance: ClassArgInstanceOrArray<T>) {
      this._value.instance = instance;
   }

   get dataId(): string {
      return this._dataId;
   }


   get trackChanges(): boolean {
      return this._trackChanges;
   }


   // --------------------------------- Start ChangeListeners -----------------------


   get previousValue(): ClassArgInstanceOrArray<T> {
      return this._value.previousInstance;
   }

   // noinspection JSUnusedGlobalSymbols
   get changeListeners(): DataProviderChangeListener<ClassArgInstanceOrArray<T>> [] {
      return this._changeListeners;
   }

   // noinspection JSUnusedGlobalSymbols
   addChangeListener(listener: DataProviderChangeListener<ClassArgInstanceOrArray<T>>) {
      if (listener)
         this._changeListeners.push(listener);
   }

   // noinspection JSUnusedGlobalSymbols
   removeChangeListener(listener: DataProviderChangeListener<ClassArgInstanceOrArray<T>>) {
      if (listener) {
         let n: number = this._changeListeners.length;
         //reverse loop, so that when we remove an item, we don't loose our position and have to do funky math to recover it
         for (let i = n - 1; i >= 0; i--) {
            let internal = this._changeListeners[i];
            if (internal && internal == listener)
               this._changeListeners.splice(i, 1);
         }
      }
   }

   async fireChange(evt: DataProviderChangeEvent<ClassArgInstanceOrArray<T>>) {
      if (!this._changeListeners)
         return;

      if (!evt.dataProvider)
         evt.dataProvider = this;
      if (!evt.dataProviderValue)
         evt.dataProviderValue = this.dataValue;


      let triggerRefresh: boolean = true;
      if (this.argsDataProvider) {
         if (this.argsDataProvider.disableRefreshOnChange) {
            triggerRefresh = false;
         }
      }

      if (triggerRefresh) {
         try {
            await this.refresh();
         } catch (ex) {
            this.handleError(ex);
         }

      } // if triggerRefresh

      let n: number = this._changeListeners.length;
      for (let i = 0; i < n; i++) {
         let listener = this._changeListeners[i];
         if (listener) {
            try {
               await listener.dataProviderChanged(evt)
            } catch (err) {
               evt.error    = true;
               evt.errorTxt = err.toString();
               if (!evt.extras)
                  evt.extras = new Map();
               evt.extras.set('exception', err);
            }
         } // if listener

         if (evt.error) {
            break; // get out of the loop the moment there's an error
         }
      } // n

      if ( !evt.error){
         if (evt.changeSuccessful){
            try{
               evt.changeSuccessful();
            } catch(ex3){
               this.handleError(ex3);
            }
         }

      }
   }


   // --------------------------------- End  ChangeListeners -----------------------


   // --------------- Empty AbstractWidget methods implementations ------------------

   async localClearImplementation(): Promise<void> {
   }

   async localDestroyImplementation(): Promise<void> {
   }

   async localLogicImplementation(): Promise<void> {
   }

   async localRefreshImplementation(): Promise<void> {
   }

   //----------------------- getter/setter ------------------------


   get type(): DataProviderType {
      return this._type;
   }

   get argsDataProvider(): Args_DataProvider<T> {
      return this._argsDataProvider;
   }

//-------------------------------- static implementation -----------------

   /**
    * Checks if an object is a DataProvider by checking for the presence of a boolean true $DATAPROVIDER$ property
    * @param instance
    */
   static isIDataProvider(instance: any): instance is IDataProvider {
      if (instance) {
         let maybe: IDataProvider = instance as IDataProvider;
         return (
            maybe.valueByClass !== undefined &&
            maybe.valueByName !== undefined
         );
      }
      return false;
   }

   static isIDataProviderSimple(instance: any): instance is IDataProviderSimple {
      if (instance) {
         if (DataProvider.isIDataProvider(instance)) {
            let maybe: IDataProviderSimple = instance as IDataProviderSimple;
            return (
               maybe.dataValue
            );
         }
      }
      return false;
   }

   //------------------------------------- byClass searches -------------------------

   static dataProviderByClass<T>(widget: AbstractWidget, cls: Cls<any>): IDataProviderSimple<T> {

      if (!cls)
         return null;

      if (DataProvider.isIDataProvider(widget)) {
         let provider: IDataProvider = <IDataProvider>(widget as any);
         let correctProvider         = provider.dataProviderByClass<T>(cls);
         if (correctProvider)
            return correctProvider; // done, we found it
      }

      // go to the parent (if any)
      if (widget.parent) {
         return DataProvider.dataProviderByClass<T>(widget.parent, cls);
      }
      return null;
   }

   static byClass<T>(widget: AbstractWidget, cls: Cls<any>): (T | T[] | null) {

      if (!cls)
         return null;

      if (DataProvider.isIDataProvider(widget)) {
         let provider: IDataProvider = <IDataProvider>(widget as any);
         let val                     = provider.valueByClass(cls);
         if (val)
            return val; // done, we found it
      }

      // go to the parent (if any)
      if (widget.parent) {
         return DataProvider.byClass<T>(widget.parent, cls);
      }

      return null;
   }


   static byClassSingle<T>(widget: AbstractWidget, cls: Cls<any>): (T | null) {
      if (!cls)
         return null;
      if (DataProvider.isIDataProvider(widget)) {
         let provider: IDataProvider = <IDataProvider>(widget as any);

         let val = provider.valueByClass(cls);
         if (val)
            return val; // done, we found it

         // if (cls === provider.dataType && provider.dataValue && !Array.isArray(provider.dataValue)) {
         //    return provider.dataValue;
         // }
      }

      // go to the parent (if any)
      if (widget.parent) {
         return DataProvider.byClassSingle(widget.parent, cls);
      }
      return null;
      // }
   } // ofInstance


   static byClassArray<T>(widget: AbstractWidget, cls: Cls<any>): (T[] | null) {
      if (!cls)
         return null;
      if (DataProvider.isIDataProvider(widget)) {
         let provider: IDataProvider = <IDataProvider>(widget as any);
         let val                     = provider.valueByClass(cls);
         if (val)
            return val; // done, we found it
         // if (cls === provider.dataType && provider.dataValue && Array.isArray(provider.dataValue)) {
         //    return provider.dataValue;
         // }
      }

      // go to the parent (if any)
      if (widget.parent) {
         return DataProvider.byClassArray(widget.parent, cls);
      }
      return null;
   }


   //-------------------------- byName --------------------------

   static dataProviderByName<T>(widget: AbstractWidget, id: string): IDataProviderSimple<T> {

      if (!id)
         return null;

      if (DataProvider.isIDataProvider(widget)) {
         let provider: IDataProvider = <IDataProvider>(widget as any);
         let correctProvider         = provider.dataProviderByName<T>(id);
         if (correctProvider)
            return correctProvider; // done, we found it
      }

      // go to the parent (if any)
      if (widget.parent) {
         return DataProvider.dataProviderByName<T>(widget.parent, id);
      }

      return null;
   } // dataProviderByName

   static byName<T>(widget: AbstractWidget, id: string): (T | T[] | null) {

      if (!id)
         return null;

      if (DataProvider.isIDataProvider(widget)) {
         let provider: IDataProvider = <IDataProvider>(widget as any);
         let val                     = provider.valueByName(id);
         if (val)
            return val; // done, we found it
      }

      // go to the parent (if any)
      if (widget.parent) {
         return DataProvider.byName<T>(widget.parent, id);
      }

      return null;
   } // named

   static byNameSingle<T>(widget: AbstractWidget, id: string): (T | null) {
      if (!id)
         return null;
      if (DataProvider.isIDataProvider(widget)) {
         let provider: IDataProvider = <IDataProvider>(widget as any);

         let val = provider.valueByName(id);
         if (val)
            return val; // done, we found it

         // if (cls === provider.dataType && provider.dataValue && !Array.isArray(provider.dataValue)) {
         //    return provider.dataValue;
         // }
      }

      // go to the parent (if any)
      if (widget.parent) {
         return DataProvider.byNameSingle(widget.parent, id);
      }
      return null;
      // }
   } // namedInstance

   static byNameArray<T>(widget: AbstractWidget, id: string): (T[] | null) {
      if (!id)
         return null;
      if (DataProvider.isIDataProvider(widget)) {
         let provider: IDataProvider = <IDataProvider>(widget as any);
         let val                     = provider.valueByName(id);
         if (val)
            return val; // done, we found it
         // if (cls === provider.dataType && provider.dataValue && Array.isArray(provider.dataValue)) {
         //    return provider.dataValue;
         // }
      }

      // go to the parent (if any)
      if (widget.parent) {
         return DataProvider.byNameArray(widget.parent, id);
      }
      return null;
   }


   //---------------------------- Get value from DataProvider using filter ---------------------------------

   static byFilter<T>(widget: AbstractWidget, filter: DataProviderFilter<T>, optionalFilterArgs ?: DataProviderFilterOptionalArgs): T {
      if (!filter)
         return null;

      if (DataProvider.isIDataProvider(widget)) {
         let provider: IDataProvider = <IDataProvider>(widget as any);


         let filterResult = filter(provider, optionalFilterArgs);
         if (filterResult)
            return filterResult
      }

      // go to the parent (if any)
      if (widget.parent) {
         return DataProvider.byFilter(widget.parent, filter, optionalFilterArgs);
      }
      return null;
   }

   //-------------------------- Utility methods -----------------------------
   /**
    * Returns the data contents as a single record of type T.
    * IMPORTANT: Please make sure you know that data only has one record of type T, otherwise you will get an exception!
    */
   dataAsSingleRecord():T {
      return classArgInstanceVal(this.dataValue) as T;
   }
} // DataProvider