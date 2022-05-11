import {getModules, ModuleInfo, ModuleInit} from "./ModuleRegistry";
import {getErrorHandler}                    from "./CoreErrorHandling";
import {nexusMain}                           from "./NexusMain";
import {AbstractWidget, Args_onInstantiated} from "./gui/AbstractWidget";
import {ScreenAttributes}                    from "./sec/screen/ScreenAttributes";
import {getRandomString}                    from "./CoreUtils";




export const STORAGE_CURRENT_MODULE_ID: string = 'currentModule';

export let lastOpenModule_modId: string      = null;
export let lastOpenModule_initialParams: any = null;

// local instance of current screen
let lastScreenInstance: AbstractWidget     = null;
let lastScreenAttributes: ScreenAttributes = null;

class LastScreenInfo {
   screenInstance: AbstractWidget     = null;
   screenAttributes: ScreenAttributes = null;
}

let lastScreenInfo: LastScreenInfo = null;


export async function openModule(args: { modID: string, initialParams?: any }) {


   let nextModuleInfo: ModuleInfo = getModules().get(args.modID);
   if (!nextModuleInfo) {
      getErrorHandler().displayErrorMessageToUser(`Module ID ${args.modID} is not in the list of modules. Add it first using the ModuleRegistry.addModule(module) function!!`)
      return;
   }

   if (nextModuleInfo.allowOpenPrivilege) {
      if (!await nextModuleInfo.allowOpenPrivilege()) {
         getErrorHandler().displayErrorMessageToUser('You do not have enough privileges to open this screen.')
         return;  // no changes
      }
   }


   await destroyModule(nextModuleInfo);

   sessionStorage.setItem(STORAGE_CURRENT_MODULE_ID, args.modID); // log current module ID

   if (nextModuleInfo.moduleInitFunction) {
      let f: Function = nextModuleInfo.moduleInitFunction;

      let moduleInit = new ModuleInit({
                                         currentDocument:      document,
                                         currentWindow:        window,
                                         moduleContainerTagID: nexusMain.ui.mainUITagID,
                                         initialParams:        args.initialParams
                                      });

      lastOpenModule_modId         = args.modID;
      lastOpenModule_initialParams = args.initialParams;

      await f(moduleInit);
   }
} // openModule

async function destroyModule(nextModuleInfo?: ModuleInfo) {
   let previousModuleId = sessionStorage.getItem(STORAGE_CURRENT_MODULE_ID);

   if (!previousModuleId)
      return;

   let currentModuleInfo: ModuleInfo = getModules().get(previousModuleId);
   if (currentModuleInfo) {
      if (currentModuleInfo.moduleExitFunction) {

         try {
            // inform previous module that it's exiting
            await currentModuleInfo.moduleExitFunction(
               currentModuleInfo,
               nextModuleInfo,
               null
            )
         } catch (ex) {
            console.error(ex);
            getErrorHandler().displayExceptionToUser(ex)
         }
      }
      sessionStorage.setItem(STORAGE_CURRENT_MODULE_ID, null); // clear the previous module id
   }
} // destroyModule


async function destroyScreenInContainer() {
   if (!lastScreenInfo)
      return;

   let sa     = lastScreenInfo.screenAttributes;
   let screen = lastScreenInfo.screenInstance;

   try {
      if (!sa) {
         if (screen)
            await screen.destroy();
      } else {
         // sa exists
         if (sa.destroy_function) {
            // run the custom destroy function
            await sa.destroy_function(screen);
         } else {
            // just run scren destroy
            await screen.destroy();
         }
      }

   } catch (ex) {
      console.error(ex);
      getErrorHandler().displayExceptionToUser(ex)
   }

   lastScreenInfo = null; // eliminate the last screen info

} // destroyScreen

export class Args_OpenScreen {
   sa: ScreenAttributes;
   initialParam ?: (any | Promise<any>);
   container ?: HTMLElement;
   onInstantiated ?: (args:Args_onInstantiated)=>void;
}


export async function openScreenInContainer(args: Args_OpenScreen) {
   if (!args)
      return;

   try {
      let container: HTMLElement = args.container;
      if (!container) {

         if (!nexusMain.ui.mainUITagID) {
            // In extremis, create a div
            let id                      = getRandomString('div');
            let divElem: HTMLDivElement = document.createElement('div');
            divElem.id                  = id;
            nexusMain.ui.mainUITagID    = id;
         }

         container = document.getElementById(nexusMain.ui.mainUITagID);
      }

      if (!container) {
         let error = 'There is no HTML container tag into which to paint the component!';
         console.error(error);
         getErrorHandler().displayErrorMessageToUser(error)
         return;
      }

      let screen = await args.sa.create_function(args.initialParam);

      // At this point (new screen created) we're ready to destroy any old module/screen
      await destroyModule();
      await destroyScreenInContainer();

      await screen.initContentAndLogic(container, args.onInstantiated);

      lastScreenInfo = {
         screenAttributes: args.sa,
         screenInstance:   screen
      }


   } catch (ex) {
      console.error(ex);
      getErrorHandler().displayExceptionToUser(ex)
   }
}


