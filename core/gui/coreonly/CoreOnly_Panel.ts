import {addWidgetClass}    from "../AbstractWidget";
import {AnyWidgetStandard} from "../AnyWidgetStandard";
import {Args_AnyWidget}    from "../AnyWidget";

/**
 * This class is for the EXCLUSIVE use of other core components.
 *
 * *** Do not use in application development as it can and will be modified without notice ***
 *
 */
export class CoreOnly_Panel extends AnyWidgetStandard {
   protected constructor() {
      super();
   }

   public static async create(args?: Args_AnyWidget): Promise<CoreOnly_Panel> {
      let instance = new CoreOnly_Panel();
      if (!args)
         args = new Args_AnyWidget()
      addWidgetClass(args, 'CoreOnly_Panel');

      await instance.initialize_AnyWidgetStandard(args);
      return instance;
   }
}