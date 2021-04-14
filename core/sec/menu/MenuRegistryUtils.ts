import {getAtWindowPath} from "../../CoreUtils";
import {MenuRegistry}    from "./MenuRegistry";
import {Menu_Menu}       from "./Menu_Menu";

export function menu_registration_root(): string[] {
   return ['nexus', 'sec', 'menuRegistry']
}

export function getMenuRegistry(): MenuRegistry {
   return getAtWindowPath(...menu_registration_root());
}

export async function getMenu(menu_id:string){
   let menu: Menu_Menu = null;
   if ( menu_id){
      let menuRegistry:MenuRegistry = getMenuRegistry();
      if (menuRegistry){
            await menuRegistry.processRegisteredMenus(); // make sure menus are processed first
            menu = menuRegistry.menuMap.get(menu_id);
      } // if menuRegistry
   } // if menu_id
   return menu;
}