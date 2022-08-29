import {IArgs_HtmlTag_Utils}       from "../../BaseUtils";
import {getErrorHandler}           from "../../CoreErrorHandling";
import {AnyWidget, Args_AnyWidget} from "../AnyWidget";


export class Args_AbstractHTML {
   htmlContent: string | Promise<string>
   logicImplementation ?: () => Promise<void>;
   refreshImplementation ?: () => Promise<void>;
   clearImplementation ?: () => Promise<void>;
   destroyImplementation ?: () => Promise<void>;
}

export abstract class AbstractHTML extends AnyWidget {
   htmlArgs: Args_AbstractHTML;

   protected constructor() {
      super();
   }

   protected async initialize_AbstractHTML(htmlArgs: Args_AbstractHTML) {
      this.htmlArgs               = htmlArgs;
      let anyArgs: Args_AnyWidget = {
         children: [],
         title:    null,
      };
      anyArgs                     = IArgs_HtmlTag_Utils.init(anyArgs);
      this.descriptor             = anyArgs;
      await this.initialize_AnyWidget(anyArgs);
   }

   async localContentBegin(): Promise<string> {
      return (this.htmlArgs.htmlContent ? this.htmlArgs.htmlContent : '');
   }

   async localContentEnd(): Promise<string> {
      return '';
   }

   async localLogicImplementation() {
      if (this.htmlArgs.logicImplementation) {
         try {
            await this.htmlArgs.logicImplementation();
         } catch (ex) {
            getErrorHandler().displayExceptionToUser(ex);
         }
      }
      await super.localLogicImplementation();
   }

   async localRefreshImplementation() {
      if (this.htmlArgs.refreshImplementation) {
         try {
            await this.htmlArgs.refreshImplementation();
         } catch (ex) {
            getErrorHandler().displayExceptionToUser(ex);
         }
      }
      await super.localRefreshImplementation();
   }

   async localClearImplementation() {
      if (this.htmlArgs.clearImplementation) {
         try {
            await this.htmlArgs.clearImplementation();
         } catch (ex) {
            getErrorHandler().displayExceptionToUser(ex);
         }
      }
      await super.localClearImplementation();
   }

   async localDestroyImplementation() {
      if (this.htmlArgs.destroyImplementation) {
         try {
            await this.htmlArgs.destroyImplementation();
         } catch (ex) {
            getErrorHandler().displayExceptionToUser(ex);
         }
      }
      await super.localDestroyImplementation();
   }

} // main class