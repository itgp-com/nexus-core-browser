import {Menu_Menu}                               from "./Menu_Menu";
import {getMenuRegistry, menu_registration_root} from "./MenuRegistryUtils";
import {setAtWindowPath}                         from "../../CoreUtils";


export abstract class MenuRegistry {
   private readonly _menuMap: Map<string, Menu_Menu>;
   private _menuIdList: string[];
   private _menus: Menu_Menu[];

   private _processed: boolean = false;

   protected constructor() {
      this._menuMap    = new Map<string, Menu_Menu>();
      this._menuIdList = []
      this._menus      = [];

      setAtWindowPath(menu_registration_root(), this); // register this object as the new menu registry
   }


   abstract registerMenus(): Promise<Menu_Menu[]>;


   get menuMap(): Map<string, Menu_Menu> {
      return this._menuMap;
   }


   /**
    * True if the processRegisteredMenu() has been run successfully
    */
   get processed(): boolean {
      return this._processed;
   }

   set processed(value: boolean) {
      this._processed = value;
   }


   get menuIdList(): string[] {
      return this._menuIdList;
   }

   get menus(): Menu_Menu[] {
      return this._menus;
   }

   /**
    * Loads the initial system menus and sets the processed flag to true when done
    */
   async processRegisteredMenus() {
      if (this._processed)
         return;

      let menus: Menu_Menu[] = await this.registerMenus();
      for (let potentialMenu of menus) {
         this.add(potentialMenu);
      }

      this._menus = []
      for (const menu_id of this._menuIdList) {
         this._menus.push(this.menuMap.get(menu_id))
      }

      this.processed = true;
   } // processRegisteredMenus


   /**
    *
    * @param menu
    * @returns true if successful, false otherwise
    */
   add(menu: Menu_Menu): boolean {
      if (menu) {

         let menuRegistry: MenuRegistry = getMenuRegistry();

         if (menu.id) {
            let menuMap: Map<string, Menu_Menu> = menuRegistry._menuMap
            menuMap.set(menu.id, menu);

            this.menuIdList.push(menu.id)
            this._menuIdList = this._menuIdList.sort();

            this.menus.push(this.menuMap.get(menu.id))
            return true;
         }
      } // if registration
      return false;
   } // add

   remove(menu_id: string): boolean {
      if (menu_id) {
         let menuRegistry: MenuRegistry = getMenuRegistry();
         if (menu_id) {
            let menuMap: Map<string, Menu_Menu> = menuRegistry._menuMap
            let menu: Menu_Menu                 = menuMap.get(menu_id);
            if (menu) {
               let success = menuMap.delete(menu_id);
               if (success) {

                  let index: number = -1;

                  do {
                     index = this.menuIdList.indexOf(menu_id, 0);
                     if (index >= 0)
                        this.menuIdList.splice(index, 1); // delete just that index
                  } while (index >= 0)

                  do {
                     index = this.menus.indexOf(menu, 0)
                     if (index >= 0)
                        this.menus.splice(index, 0); // delete the menu
                  } while (index >= 0)

                  return true;
               }
            }
         }
      }
      return false;
   } //remove

} // main
