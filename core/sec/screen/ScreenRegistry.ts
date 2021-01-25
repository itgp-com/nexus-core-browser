import {ScreenAttributes} from "./ScreenAttributes";
import {setAtWindowPath}  from "../../CoreUtils";
import {getScreenRegistry, screen_registration_root} from "./ScreenRegistryUtils";

// noinspection JSUnusedGlobalSymbols,TypeScriptAbstractClassConstructorCanBeMadeProtected
export abstract class ScreenRegistry {

   private readonly _uuidMap: Map<string, ScreenAttributes>;
   private readonly _classNameMap: Map<string, ScreenAttributes>;

   private _screenNames: string[];
   private _screens:ScreenAttributes[];

   private _processed: boolean = false;


   constructor() {
      this._uuidMap      = new Map<string, ScreenAttributes>();
      this._classNameMap = new Map<string, ScreenAttributes>();
      this._screenNames = [];
      this._screens = [];

      setAtWindowPath(screen_registration_root(), this); // register this object as the new registry
   } // constructor


   async abstract registerScreens(): Promise<ScreenAttributes[]>;


   get uuidMap(): Map<string, ScreenAttributes> {
      return this._uuidMap;
   }

   get classNameMap(): Map<string, ScreenAttributes> {
      return this._classNameMap;
   }


   get processed(): boolean {
      return this._processed;
   }

   set processed(value: boolean) {
      this._processed = value;
   }

   /**
    * Return the screen entries sorted by className
    */
   async screenList(): Promise<ScreenAttributes[]> {
      await this.processRegisteredScreens();
      return this._screens;
   } // getScreens

   async screenNames(): Promise<string[]> {
      await this.processRegisteredScreens();
      return this._screenNames;
   }


   async processRegisteredScreens() {
      if (this._processed)
         return;

      let names:string[] = [];

      let potentialScreens: ScreenAttributes[] = await this.registerScreens();
      for (let potentialScreen of potentialScreens) {
         this.add(potentialScreen);

         if (potentialScreen?.class_name)
            names.push(potentialScreen.class_name)
      }

      this._screenNames = names.sort();

      this._screens = []
      for (const className of this._screenNames) {
         this._screens.push(this._classNameMap.get(className))
      }

      this.processed = true;
   } // processRegisteredScreens


   protected add(registration: ScreenAttributes) {
      if (registration) {

         let screenRegistry: ScreenRegistry = getScreenRegistry();

         if (registration.ui_uuid) {
            let screenMap: Map<string, ScreenAttributes> = screenRegistry._uuidMap
            screenMap.set(registration.ui_uuid, registration);
         }

         if (registration.class_name) {
            let classNameMap: Map<string, ScreenAttributes> = screenRegistry._classNameMap
            classNameMap.set(registration.class_name, registration);
         }
      } // if registration
   } // add


}