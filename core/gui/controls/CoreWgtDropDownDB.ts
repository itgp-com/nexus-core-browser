import {Args_WgtDropDownDB, AbstractWgtDropDownDB} from "./AbstractWgtDropDownDB";

/**
 * This class is for the exclusive use of the core widgets. Do not use or extend
 */
export class CoreWgtDropDownDB<ARG_CLASS extends Args_WgtDropDownDB = Args_WgtDropDownDB> extends AbstractWgtDropDownDB<ARG_CLASS> {


   private constructor() {
      super();
   }

   static create(args: Args_WgtDropDownDB):CoreWgtDropDownDB {
      let instance = new CoreWgtDropDownDB()
      instance.initialize_WgtDropDownDB(args);
      return instance;
   } // create

   initialize_WgtDropDownDB(args: ARG_CLASS) {
      super.initialize_AbstractWgtDropDownDB(args);
   }

}