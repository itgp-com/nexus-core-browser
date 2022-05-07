import {AnyWidget}       from "../AnyWidget";
import {Args_AnyWidget}  from "../Args_AnyWidget";
import {getErrorHandler} from "../../CoreErrorHandling";

export class Args_WgtPanel_HTML {
   htmlContent: string
   logicImplementation ?: () => Promise<void>;
   refreshImplementation ?: () => Promise<void>;
   clearImplementation ?: () => Promise<void>;
   destroyImplementation ?: () => Promise<void>;
}

export class WgtPanel_HTML extends AnyWidget {
   htmlArgs: Args_WgtPanel_HTML;

   protected constructor() {
      super();
   }


   static async create(param:Args_WgtPanel_HTML){
      let instance = new WgtPanel_HTML();
      await instance.initialize_WgtPanel_HTML(param);
      return instance;
   }


   async initialize_WgtPanel_HTML(htmlArgs: Args_WgtPanel_HTML) {
      this.htmlArgs               = htmlArgs;
      let anyArgs: Args_AnyWidget = {
         children: [],
         title:    null,
      };
      this.initialize_AnyWidget(anyArgs);
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