import * as utils                                                    from "../AppPathUtils";
import {getErrorHandler}                                             from "../CoreErrorHandling";
import {lastOpenModule_modId, openModule, STORAGE_CURRENT_MODULE_ID} from "../ModuleUtils";
import {NexusUI}                                                     from "../NexusUI";


export abstract class DefaultMainUI extends NexusUI {

   initialModuleToDisplay_modId: string      = null;
   initialModuleToDisplay_initialParams: any = null;


   // ----------------------- Start MainUI abstract method implementation -------------------------------
   /**
    * Gets called right after init() to allow for all the initial URL-based processing to happen
    * One should do their await based calls here at the beginning of the app, and only then
    * instantiate the UI
    */
   async init():Promise<void> {
      sessionStorage.removeItem(STORAGE_CURRENT_MODULE_ID); // clean up any previous keys on startup

      // Pre-load the app path for the whole app
      await utils.asyncGetAppPath();
   } // init

   async initUI():Promise<void> {
      this.openInitialModuleToDisplay();
   } // initUI

   async processURLParameters(initialParamsAsString: string): Promise<void> {
      try {
         // Process the initial parameters
         if (initialParamsAsString.startsWith('{') && initialParamsAsString.endsWith('}')) {
            // it's JSON
            let initParams = JSON.parse(initialParamsAsString);
            if (initParams.mod)
               await openModule({modID: initParams.mod as string, initialParams: initParams});
         }
      } catch (ex) {
         let errorHandler = getErrorHandler();
         errorHandler.displayExceptionToUser(ex);
      }
   } // processURLParameters



   // ----------------------- End MainUI abstract method implementation -------------------------------

   public openInitialModuleToDisplay() {
      let thisX = this;
      setTimeout(
         async () => {
            await thisX._openInitialModuleToDisplay();
         }

         , 500); // do this after everything is painted and loaded
   }

   protected async _openInitialModuleToDisplay() {
      if (lastOpenModule_modId == null) {
         // if no other module has been opened, then initialize the view to this module
         if (this.initialModuleToDisplay_modId != null) {
            // if there's an initial module defined, open it
            await openModule({
                                     modID:         this.initialModuleToDisplay_modId,
                                     initialParams: this.initialModuleToDisplay_initialParams
                                  });
         }
      }
   }




} // main class