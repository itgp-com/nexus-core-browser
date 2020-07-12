import {Args_WgtDropDown, WgtDropDown} from "./WgtDropDown";

export class Args_WgtDropDownSimpleJSONArray<T=any> extends Args_WgtDropDown{
   jsonArray:T[];


   /**
    * The name of the JSON object field to be displayed in the dropdown
    */
   textColumn:string;

   /**
    * The name of the JSON object field to be used as a value
    */
   valueColumn: string;

   enabled ?: boolean;
}
export class WgtDropDownSimpleJSONArray extends WgtDropDown  {
   protected constructor() {
      super();
   }

   static create<T>(args: Args_WgtDropDownSimpleJSONArray){
      let instance = new WgtDropDownSimpleJSONArray()
      instance.initialize_WgtDropDownSimpleJSONArray(args);
      return instance;
   } // create

   initialize_WgtDropDownSimpleJSONArray(args: Args_WgtDropDownSimpleJSONArray){
      if (!args)
         args = new Args_WgtDropDownSimpleJSONArray(); // so defaults are in place

      if (args.jsonArray == null)
         args.jsonArray = [];


      args.ej            = args.ej || {};
      args.ej.dataSource = args.jsonArray;

      args.ej.fields = {
         text: args.textColumn,
         value: args.valueColumn,
      };

      if (args.enabled != null)
         args.ej.enabled = args.enabled;


      this.initialize_WgtDropDown(args);

   } //initialize_WgtDropDownSimple



} // abstract WgtDropDown