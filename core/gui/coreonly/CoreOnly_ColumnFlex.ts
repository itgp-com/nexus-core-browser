/**
 * This class is for the EXCLUSIVE use of other core components.
 *
 * *** Do not use in application development as it can and will be modified without notice ***
 *
 */
import {AnyWidgetStandard}      from "../AnyWidgetStandard";
import {Args_AnyWidget}         from "../AnyWidget";
import {IArgs_HtmlTag_Utils}    from "../../BaseUtils";
import {CSS_FLEX_COL_DIRECTION} from "../../CoreCSS";
import {addWidgetClass}         from "../AbstractWidget";


export class CoreOnly_ColumnFlex extends AnyWidgetStandard {
   static async create(args ?: Args_AnyWidget): Promise<CoreOnly_ColumnFlex> {
      let instance = new CoreOnly_ColumnFlex();
      await instance.initialize_CoreOnly_ColumnFlex(args);
      return instance;
   }

   async initialize_CoreOnly_ColumnFlex(args: Args_AnyWidget) {
      args = IArgs_HtmlTag_Utils.init(args);
      addWidgetClass(args, CSS_FLEX_COL_DIRECTION);
      await this.initialize_AnyWidgetStandard(args);
      ;
   }
}