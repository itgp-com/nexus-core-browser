import {AbstractDropDownDB, Args_AbstractDropDownDB} from "../abstract/AbstractDropDownDB";
import {addWidgetClass}                              from "../../AbstractWidget";
import {getErrorHandler}                             from "../../../CoreErrorHandling";


export class Args_WxDropDownDB extends Args_AbstractDropDownDB {
   removeBlankEntry ?: boolean;
   blankEntryName ?: string;
   blankEntryValue ?: any;
}

/**
 * Traditional remote data bound drop down.
 */
export  class WxDropDownDB<ARG_CLASS extends Args_WxDropDownDB = Args_WxDropDownDB>
   extends AbstractDropDownDB<ARG_CLASS> {
   static readonly CLASS_NAME:string = 'WxDropDownDB';

   constructor() {
      super();
   }

   static async create(args: Args_WxDropDownDB):Promise<WxDropDownDB> {
      let instance = new WxDropDownDB()
      await instance._initialize(args);
      return instance;
   } // create

   async _initialize(args: ARG_CLASS) {
      await super._initialize(args);
   }

   /**
    * Allows extending classes to execute code before the super method is called, but after the code in the {@link #_initialize} method has run
    * @param args
    */
   protected async pre_initialize_DropDown(args: ARG_CLASS){
      if (!args)
         args = new Args_WxDropDownDB() as any;
      args.ej = args.ej || {};
      addWidgetClass(args, WxDropDownDB.CLASS_NAME);


      if ( !args.removeBlankEntry){
         let existingDataBound = args.ej.dataBound;
         args.ej.dataBound = (arg, rest) =>  {

            if (existingDataBound){
               try {
                  existingDataBound(arg, rest);
               } catch (error){
                  getErrorHandler().displayExceptionToUser(error);
               }
            }

            let row = {};
            row[args.textColumn] = (args.blankEntryName!= null ? args.blankEntryName : '');
            row[args.valueColumn] = (args.blankEntryValue != null ? args.blankEntryValue : null);

            this.obj.addItem(row, 0); // add as first entry
         }
      }
   }
}