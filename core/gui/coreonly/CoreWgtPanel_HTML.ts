//How to dynamically create CSS class in JavaScript and apply?
// https://stackoverflow.com/questions/1720320/how-to-dynamically-create-css-class-in-javascript-and-apply


import {AbstractHTML, Args_AbstractHTML} from "../controls/AbstractHTML";

/**
 * This class is for the EXCLUSIVE use of other core components.
 *
 * *** Do not use in application development as it can and will be modified without notice ***
 *
 */
export class CoreWgtPanel_HTML extends AbstractHTML {
   protected constructor() {
      super();
   }

   static async create(args?: Args_AbstractHTML): Promise<CoreWgtPanel_HTML> {
      let instance = new CoreWgtPanel_HTML();
      await instance.initialize_AbstractHTML(args);
      return instance;
   }
}