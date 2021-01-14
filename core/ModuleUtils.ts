import {getModules, ModuleInfo, ModuleInit} from "./ModuleRegistry";
import {getErrorHandler}                    from "./CoreErrorHandling";
import {nexusMain}                          from "./NexusMain";

export const STORAGE_CURRENT_MODULE_ID: string = 'currentModule';

export async function openModule(args: { modID: string, initialParams?: any }) {


   let moduleInfo = getModules().get(args.modID);
   if (!moduleInfo) {
      getErrorHandler().displayErrorMessageToUser(`Module ID ${args.modID} is not in the list of modules. Add it first using the ModuleRegistry.addModule(module) function!!`)
      return;
   }

   if (moduleInfo.allowOpenPrivilege){
      if (! await moduleInfo.allowOpenPrivilege()){
         getErrorHandler().displayErrorMessageToUser('You do not have enough privileges to open this screen.')
         return;  // no changes
      }
   }

   let currentModuleId = sessionStorage.getItem(STORAGE_CURRENT_MODULE_ID);
   if (currentModuleId) {
      let currentModuleInfo: ModuleInfo = getModules().get(currentModuleId);
      if (currentModuleInfo) {
         if (currentModuleInfo.moduleExitFunction) {

            // inform previous module that it's exiting
            await currentModuleInfo.moduleExitFunction(
               currentModuleInfo,
               moduleInfo,
               null
            )
         }
      }
   }
   sessionStorage.setItem(STORAGE_CURRENT_MODULE_ID, args.modID); // log current module ID

   if (moduleInfo.moduleInitFunction) {
      let f: Function = moduleInfo.moduleInitFunction;

      let moduleInit = new ModuleInit({
                                         currentDocument:      document,
                                         currentWindow:        window,
                                         moduleContainerTagID: nexusMain.ui.mainUITagID,
                                         initialParams:        args.initialParams
                                      });

      this.lastOpenModule_modId         = args.modID;
      this.lastOpenModule_initialParams = args.initialParams;

      await f(moduleInit);
   }
} // openModule


