import {ScreenAttributes} from "./ScreenAttributes";
import {getAtWindowPath}  from "../../CoreUtils";
import {ScreenRegistry}   from "./ScreenRegistry";

export function screen_registration_root(): string[] {
   return ['nexus', 'sec', 'screenRegistry']
}

export function getScreenRegistry(): ScreenRegistry {
   return getAtWindowPath(...screen_registration_root());
}

export async function getScreenRegistrationByUUID(ui_uuid: string): Promise<ScreenAttributes> {
   let reg: ScreenAttributes = null;
   if (ui_uuid) {
      let screenRegistry:ScreenRegistry = getScreenRegistry();
      if (screenRegistry){
         await screenRegistry.processRegisteredScreens(); //make sure screens are processed first
         reg = screenRegistry?.uuidMap?.get(ui_uuid);
      }
   } // if ui_uuid
   return reg;
}

export async function getScreenRegistrationByName(className: string): Promise<ScreenAttributes> {
   let reg: ScreenAttributes = null;
   if (className) {
      let screenRegistry:ScreenRegistry = getScreenRegistry();
      if (screenRegistry){
         await screenRegistry.processRegisteredScreens(); //make sure screens are processed first
         reg = screenRegistry?.classNameMap?.get(className);
      }
   } // if className
   return reg;
}

