/**
 * Global screen registration record for all screens that need central registration (in order to be included in a menu, or security for example)
 *
 */
import {AnyScreen} from "../../gui/AnyScreen";

export class ScreenAttributes {
   /**
    * (Optional) The unique UI_UUID for the screen
    */
   ui_uuid ?: string;

   /**
    * The name of the class (if obfuscating, this needs to be a legible name
    */
   class_name: string;

   /**
    * Optional. Description to go with the name of the class
    */
   description ?: string|string[];

   /**
    * a function that can be called with an optional parameter to create an instance of the screen
    */
   create_function: (param ?: any) => AnyScreen;

}