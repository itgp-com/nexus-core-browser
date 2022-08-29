import {Args_CoreOnly_AbstractButton_Primary, CoreOnly_AbstractButton_Primary} from "./CoreOnly_AbstractButton_Primary";

export class Args_CoreOnly_Button_Primary extends Args_CoreOnly_AbstractButton_Primary {
}

/**
 *
 * Refreshes button label and icon on parent refresh
 */
export class CoreOnly_Button_Primary extends CoreOnly_AbstractButton_Primary {
   protected constructor() {
      super();
   }

   static async create(args?: Args_CoreOnly_Button_Primary): Promise<CoreOnly_Button_Primary> {
      let instance = new CoreOnly_Button_Primary();
      await instance.initialize_AbstractButton_Primary(args);
      return instance;
   }

}