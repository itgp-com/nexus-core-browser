import {AbstractWidget}                                                                 from "..";
import {Cls, DataProvider, DataProviderChangeEvent, IDataProvider, IDataProviderSimple} from "./DataProvider";
import {ClassArgInstanceOrArray, classArgInstanceOrArrayVal}                            from "../BaseUtils";


export class Args_DataProviderFacade {
   provider: IDataProvider;
   children ?: AbstractWidget[]
}

export class DataProviderFacade<T = any> extends AbstractWidget implements IDataProvider<T> {

   private _content: IDataProvider;
   private dataProviderFacadeArgs: Args_DataProviderFacade;

   protected constructor() {
      super();
   }

   static create(args: Args_DataProviderFacade): DataProviderFacade {
      let providerFacade: DataProviderFacade = new DataProviderFacade();

      providerFacade.dataProviderFacadeArgs = args;
      providerFacade.content                = args.provider;
      if (providerFacade.content && providerFacade.content instanceof DataProvider){
         providerFacade.content.addChangeListener(providerFacade);
      }
      if (args.children) {
         providerFacade.children = args.children; // this is a function call not a straight assignment to a variable
      }

      return providerFacade;
   } // create




   async localClearImplementation(): Promise<void> {
      if (this.content) {
         if ((this.content as any).localClearImplementation) {
            await (this.content as any).localClearImplementation();
         }
      }
   }

   async localDestroyImplementation(): Promise<void> {
      if (this.content) {
         if ((this.content as any).localDestroyImplementation) {
            await (this.content as any).localDestroyImplementation();
         }
      }
   }

   async localLogicImplementation(): Promise<void> {
      // there is no logic for a facade - it's not a visual object
   }

   async localRefreshImplementation(): Promise<void> {
      // there is not refresh for a non-visual component
   }


   //------------------- implement DataProviderChangeListener ----------------------
   async dataProviderChanged(evt: DataProviderChangeEvent<T>) {
         await this.refresh();
   } // dataProviderChanged


   //------------------- class get methods ------------------

   dataProviderByClass<T>(cls: Cls<any>): IDataProviderSimple<T> {
      if ( !this.content)
         return null;
      return this.content.dataProviderByClass<T>(cls);
   }

   dataProviderByName<T>(id: string): IDataProviderSimple<T> {
      if ( !this.content)
         return null;
      return this.content.dataProviderByName<T>(id);
   }

   valueByClass<T>(cls: Cls<any>): ClassArgInstanceOrArray<T> {
      let provider = this.content;
      if (provider) {
         let val = provider.valueByClass(cls);
         if (val) {
            val = classArgInstanceOrArrayVal<T>(val);// found it, done.
            return val;
         }
      }
      return undefined;
   }

   valueByName<T>(id: string): ClassArgInstanceOrArray<T> {
      let provider = this.content;
      if (provider) {
         let val = provider.valueByName(id);
         if (val) {
            val = classArgInstanceOrArrayVal<T>(val);// found it, done.
            return val;
         }
      }
      return undefined;
   }

   // get changeListeners(): DataProviderChangeListener<ClassArgInstanceOrArray<T>>[] {
   //    if (this.content)
   //       return this.content.changeListeners;
   //
   //    return [];
   // }
   //
   // get trackChanges(): boolean {
   //    if (this.content)
   //       return this.content.trackChanges;
   //
   //    return false;
   // }
   //
   //
   // addChangeListener(listener: DataProviderChangeListener<ClassArgInstanceOrArray<T>>): void {
   //    if (this.content)
   //       this.content.addChangeListener(listener);
   // }
   //
   // fireChange(evt: DataProviderChangeEvent<ClassArgInstanceOrArray<T>>): void {
   //    if (this.content)
   //       this.content.fireChange(evt);
   // }
   //
   // removeChangeListener(listener: DataProviderChangeListener<ClassArgInstanceOrArray<T>>): void {
   //    if (this.content)
   //       this.content.removeChangeListener(listener);
   // }


   //---------------------- local get/set ----------------


   get content(): IDataProvider<any> {
      return this._content;
   }

   set content(value: IDataProvider<any>) {
      this._content = value;
   }

}