import {CSS_FLEX_ROW_DIRECTION} from "../../gui2/scss/core";
import {addWidgetClass}         from "../AbstractWidget";
import {Args_AnyWidget}         from "../AnyWidget";
import {AnyWidgetStandard}      from "../AnyWidgetStandard";


/**
 * This class is for the EXCLUSIVE use of other core components.
 *
 * *** Do not use in application development as it can and will be modified without notice ***
 *
 */
export class Args_CoreOnly_RowFlex extends Args_AnyWidget {
}
export class CoreOnly_RowFlex extends AnyWidgetStandard {
   static async create(args ?: Args_CoreOnly_RowFlex): Promise<CoreOnly_RowFlex> {
      let instance = new CoreOnly_RowFlex();
      await instance.initialize_CoreOnly_RowFlex(args);
      return instance;
   }

   protected async initialize_CoreOnly_RowFlex(args: Args_CoreOnly_RowFlex){
      if (!args)
         args = new Args_CoreOnly_RowFlex();
      addWidgetClass(args, ['CoreOnly_RowFlex', CSS_FLEX_ROW_DIRECTION]);
      await super.initialize_AnyWidgetStandard(args);
   }
}