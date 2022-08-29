import {MetaTableData} from "../data/MetaTableData";

export class ScreenMeta {

   private _tableList: MetaTableData[] = [];
   private _currentClassName:string;

   registerMeta( meta: MetaTableData){
      if (meta)
         this._tableList.push(meta)
   }


   get tableList(): MetaTableData[] {
      return this._tableList;
   }

   get currentClassName(): string {
      return this._currentClassName;
   }

   set currentClassName(value: string) {
      this._currentClassName = value;
   }
}