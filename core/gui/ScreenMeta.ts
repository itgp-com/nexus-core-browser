import * as _               from "lodash";
import {MetaTableData_Base} from "./MetaTableData_Base";
import {MetaTableData}      from "../ej2/MetaTableData";

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