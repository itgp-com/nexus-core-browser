//How to dynamically create CSS class in JavaScript and apply?
// https://stackoverflow.com/questions/1720320/how-to-dynamically-create-css-class-in-javascript-and-apply


import {AbstractWgtPanel_HTML, Args_WgtPanel_HTML} from "./AbstractWgtPanel_HTML";
/**
 * This component is for the exclusive use of the other Nexus Core components. Do not use in your application.
 *
 */
export class CoreWgtPanel_HTML extends AbstractWgtPanel_HTML {
   protected constructor() {
      super();
   }

   static async create(args?: Args_WgtPanel_HTML): Promise<CoreWgtPanel_HTML> {
      let instance = new CoreWgtPanel_HTML();
      await instance.initialize_AbstractWgtPanel_HTML(args);
      return instance;
   }
}