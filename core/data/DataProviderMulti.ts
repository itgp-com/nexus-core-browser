import {AbstractWidget}                                                           from "../gui/AbstractWidget";
import {Cls, DataProvider, DataProviderValue, IDataProvider, IDataProviderSimple} from "./DataProvider";
import {ClassArgInstanceOrArray, classArgInstanceOrArrayVal}                      from "../CoreUtils";


export class DataProviderMulti_Args {
   providers: IDataProvider[];
   children ?: AbstractWidget[]
}


export class DataProviderMulti extends AbstractWidget implements IDataProvider {
   /**
    * This is what identifies a DataProvider (since interfaces cannot be queried for instanceof in Typescript )
    */
   private _providers: IDataProvider[];
   //
   // parent: AbstractWidget;
   // children: AbstractWidget[];

   protected constructor() {
      super();
   }

   static create(args: DataProviderMulti_Args): DataProviderMulti {
      let dataProviderArray: IDataProvider[] = args.providers;
      let multi: DataProviderMulti           = new DataProviderMulti();

      // if ( dataProviderArray){
      //    multi._providers = dataProviderArray;
      //    let n:number = dataProviderArray.length;
      //    for (let i = 0; i < n; i++) {
      //       let provider:IDataProvider = dataProviderArray[i];
      //
      //    } // for
      // } // if

      if (args.children) {
         multi.children = args.children; // this is a function call not a straight assignment to a variable
      }

      return multi;
   } // create

   async localClearImplementation(): Promise<void> {
      let localProviders: IDataProvider[] = this.providers;
      if (localProviders) {
         let n = localProviders.length;
         for (let i = 0; i < n; i++) {
            let provider = localProviders[i];
            try {
               if (provider && (provider as any).clear) {
                  await (provider as any).clear()
               }
            } catch (ex) {

            }

         } // for

      } // if ( this.providers)
   } // localClearImplementation

   async localDestroyImplementation(): Promise<void> {
      if (this.providers) {
         let n: number = this.providers.length;
         for (let i = 0; i < n; i++) {
            let provider: IDataProvider = this.providers[i];
            if ((provider as any).localDestroyImplementation) {
               await (provider as any).localDestroyImplementation();
            }
         } // for
      } // if
   } // localDestroyImplementation

   _initContent(): string {
      return null;
   }

   async localLogicImplementation(): Promise<void> {
      // there is no logic for a facade - it's not a visual object
   }

   async localRefreshImplementation(): Promise<void> {
      // there is not refresh for a non-visual component
   }


   get providers(): IDataProvider[] {
      return this._providers;
   }


   //---------------- implement IDataProvider ------------------
   dataProviderByClass<T>(cls: Cls<any>): IDataProviderSimple<T> {
      if (cls && this.providers) {
         let n = this.providers.length;
         for (let i = 0; i < n; i++) {
            let provider = this.providers[i];
            if (provider) {
               let val = provider.valueByClass(cls);
               if (val) {
                 if ( DataProvider.isIDataProviderSimple(provider)){
                    return provider
                 } else {
                    return provider.dataProviderByClass(cls);
                 }

               }
            }
         } // for
      }
      return null;
   } // dataProviderByClass

   dataProviderByName<T>( id: string): IDataProviderSimple<T>{
      if (id && this.providers) {
         let n = this.providers.length;
         for (let i = 0; i < n; i++) {
            let provider = this.providers[i];
            if (provider) {
               let val = provider.valueByName(id);
               if (val) {
                  if ( DataProvider.isIDataProviderSimple(provider)){
                     return provider
                  } else {
                     return provider.dataProviderByName(id);
                  }
               }
            }
         } // for
      }
      return null;
   }


   valueByClass<T>(cls: Cls<any>): ClassArgInstanceOrArray<T> {
      if (cls && this.providers) {
         let n = this.providers.length;
         for (let i = 0; i < n; i++) {
            let provider = this.providers[i];
            if (provider) {
               let val = provider.valueByClass(cls);
               if (val) {
                  val = classArgInstanceOrArrayVal<T>(val);// found it, done.
                  return val;
               }
            }
         } // for
      }
      return null;
   }

   valueByName<T>(id: string): ClassArgInstanceOrArray<T> {
      if (id && this.providers) {
         let n = this.providers.length;
         for (let i = 0; i < n; i++) {
            let provider = this.providers[i];
            if (provider) {
               let val = provider.valueByName(id);
               if (val) {
                  val = classArgInstanceOrArrayVal<T>(val);// found it, done.
                  return val;
               }
            }
         } // for
      }
      return null;
   }
} // DataProviderMulti