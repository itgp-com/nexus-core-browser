import {Menu_Menu}                               from "./Menu_Menu";
import {getMenuRegistry, menu_registration_root} from "../menu/MenuRegistryUtils";
import {setAtWindowPath}                         from "../../CoreUtils";


export abstract class MenuRegistry {
   private readonly _menuMap:Map<string, Menu_Menu> ;
   private _menuPks: string[];
   private _menus:Menu_Menu[];
   
   private _processed: boolean = false;

   constructor() {
      this._menuMap = new Map<string, Menu_Menu>();
      this._menuPks = []
      this._menus = [];

      setAtWindowPath(menu_registration_root(), this); // register this object as the new menu registry
   }



   abstract registerMenus(): Promise<Menu_Menu[]>;



   get menuMap(): Map<string, Menu_Menu> {
      return this._menuMap;
   }


   get processed(): boolean {
      return this._processed;
   }

   set processed(value: boolean) {
      this._processed = value;
   }


   get menuPks(): string[] {
      return this._menuPks;
   }

   get menus(): Menu_Menu[] {
      return this._menus;
   }

   async processRegisteredMenus() {
      if (this._processed)
         return;

      let menus: Menu_Menu[] = await this.registerMenus();
      for (let potentialMenu of menus) {
         this.add(potentialMenu);
      }

      this._menus = []
      for (const pk of this._menuPks) {
         this._menus.push(this.menuMap.get(pk))
      }

      this.processed = true;
   } // processRegisteredMenus



   protected add(menu: Menu_Menu) {
      if (menu) {

         let menuRegistry: MenuRegistry = getMenuRegistry();

         if (menu.pk) {
            let menuMap: Map<string, Menu_Menu> = menuRegistry._menuMap
            menuMap.set(menu.pk, menu);

            this.menuPks.push(menu.pk)
            this._menuPks = this._menuPks.sort();

            this.menus.push(this.menuMap.get(menu.pk))
         }



      } // if registration
   } // add

} // main
