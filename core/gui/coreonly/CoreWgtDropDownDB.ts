import {Args_AbstractDropDownDB, AbstractDropDownDB} from "../ej2/abstract/AbstractDropDownDB";
import {IArgs_HtmlTag_Utils}                         from "../../BaseUtils";

/**
 * This class is for the EXCLUSIVE use of other core components.
 *
 * *** Do not use in application development as it can and will be modified without notice ***
 *
 */
export class CoreWgtDropDownDB<ARG_CLASS extends Args_AbstractDropDownDB = Args_AbstractDropDownDB> extends AbstractDropDownDB<ARG_CLASS> {


   private constructor() {
      super();
   }

   static async create(args: Args_AbstractDropDownDB):Promise<CoreWgtDropDownDB> {
      let instance = new CoreWgtDropDownDB()
      await instance.initialize_WgtDropDownDB(args);
      return instance;
   } // create

   protected async initialize_WgtDropDownDB(args: ARG_CLASS) {
      args          = IArgs_HtmlTag_Utils.init(args)as ARG_CLASS;
      this.initArgs = args;
      await super._initialize(args);
   }

}