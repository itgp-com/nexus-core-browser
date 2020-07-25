import {Args_WgtDropDown, WgtDropDown} from "./WgtDropDown";

export class Args_WgtDropDownSimple extends Args_WgtDropDown{
   simpleData:string[];
}
export class WgtDropDownSimple extends WgtDropDown  {
   protected constructor() {
      super();
   }

   static create<T>(args: Args_WgtDropDownSimple){
      let instance = new WgtDropDownSimple();
      instance.initialize_WgtDropDownSimple(args);
      return instance;
   } // create

   initialize_WgtDropDownSimple(args: Args_WgtDropDownSimple){
      if (!args)
            args = new Args_WgtDropDownSimple(); // so defaults are in place

      this.initialize_WgtDropDown(args);

   } //initialize_WgtDropDownSimple



} // abstract WgtDropDown