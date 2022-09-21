import {ScreenRegistry} from "./gui/ScreenRegistry";
import {MenuRegistry}   from "./gui/MenuRegistry";

export abstract class NexusUI {

   private _screenRegistry:ScreenRegistry
   private _menuRegistry:MenuRegistry
   // private _permanentHttpHeaders:Map<string,string> = new Map<string,string>();

   private _mainUITagID: string = '_nexus_moduleContainer';
   private _lastUITagID:string  = 'app__l_a_s_t__';

   /**
    * First method to be called to initialize any initial settings before calling {@link createNewScreenRegistry}
    */
   abstract init():Promise<void>;

   /**
    * Return the ScreenRegistry that will be used throughout the life of the application.
    *
    * Called after {@link init} but before {@link initUI}
    *
    */
   abstract createNewScreenRegistry():Promise<ScreenRegistry>;


   /**
    * Return the MenuRegistry that will be used throughout the life of the application.
    *
    * Called after {@link init} but before {@link initUI}
    *
    */
   abstract createNewMenuRegistry():Promise<MenuRegistry>;



   /**
    * Called after {@link createNewScreenRegistry} to finish initializing the UI after the first init() call and the relevant screens have been registered
    */
   abstract initUI():Promise<void>;

   /**
    * Called after {@link initUI} in order to process any URL parameters passed in after the root application URL
    *
    * @param initialParamsAsString  initial parameters (free range - depends on specific app)
    */
   abstract processURLParameters(initialParamsAsString:string):Promise<void>;


   get mainUITagID(): string {
      return this._mainUITagID;
   }

   set mainUITagID(value: string) {
      this._mainUITagID = value;
   }


   get lastUITagID(): string {
      return this._lastUITagID;
   }

   set lastUITagID(value: string) {
      this._lastUITagID = value;
   }

   get screenRegistry(): ScreenRegistry {
      return this._screenRegistry;
   }


   /**
    * !!! Please only use this method if you're sure you know what you are doing.!!!
    * You will be replacing the ScreenRegistry created by calling {@link createNewScreenRegistry} with
    * your own instance, with all the consequences that may entail
    * @param value
    */
   set screenRegistry(value: ScreenRegistry) {
      this._screenRegistry = value;
   }


   get menuRegistry(): MenuRegistry {
      return this._menuRegistry;
   }

   set menuRegistry(value: MenuRegistry) {
      this._menuRegistry = value;
   }



} // abstract NexusUI