import {Args_WgtDropDownDB, WgtDropDownDB_Abstract} from "./WgtDropDownDB_Abstract";


export class WgtDropDownDB<ARG_CLASS extends Args_WgtDropDownDB = Args_WgtDropDownDB> extends WgtDropDownDB_Abstract<ARG_CLASS> {


   protected constructor() {
      super();
   }

   static create(args: Args_WgtDropDownDB):WgtDropDownDB {
      let instance = new WgtDropDownDB()
      instance.initialize_WgtDropDownDB(args);
      return instance;
   } // create

   initialize_WgtDropDownDB(args: ARG_CLASS) {
      super.initialize_WgtDropDownDB_Abstract(args);
   }

}