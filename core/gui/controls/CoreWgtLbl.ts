import {IArgs_HtmlTag_Utils}         from "../Args_AnyWidget";
import {AbstractWgtLbl, Args_WgtLbl} from "./AbstractWgtLbl";


/**
 * This component is for the exclusive use of the other Nexus Core components. Do not use in your application.
 *
 */
export class CoreWgtLbl extends AbstractWgtLbl {

   protected constructor() {
      super();
   }

   static create(args: Args_WgtLbl) {
      args                     = <Args_WgtLbl>IArgs_HtmlTag_Utils.init(args);
      let instance: CoreWgtLbl = new CoreWgtLbl();
      instance.initialize_CoreWgtLbl(args);
      return instance;
   }

   initialize_CoreWgtLbl(args: Args_WgtLbl) {
      if (!args)
         throw "There are no args in call to initialize_WgtLbl(args) !";
      this.args = args;

      this.initialize_AbstractWgtLbl(args)
   } // initialize_WgtLbl

}