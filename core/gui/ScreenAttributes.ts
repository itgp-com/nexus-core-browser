/**
 * Global screen registration record for all screens that need central registration (in order to be included in a menu, or security for example)
 *
 */
import {AnyScreen}      from "./AnyScreen";
import {AbstractWidget} from "./AbstractWidget";

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
   description ?: string | string[];

   /**
    * a function that can be called with an optional parameter to create an instance of the screen
    */
   create_function: (param ?: any) => AnyScreen | Promise<AnyScreen> | AbstractWidget | Promise<AbstractWidget>;

   /**
    * Optional function that if it exists, will be called instead of screen.destroy().
    * The original screen.destroy() should usually be called inside the implementation of this function
    */
   destroy_function ?: (screen: (AbstractWidget | Promise<AbstractWidget>)) => (void | Promise<void>);

   /**
    * The dialog header in which the actual screen is being displayed. This is the topContainer band of the Dialog, not the screen title
    * The function receives the freshly instantiated screen result of create_function as a parameter
    */
   header ?: (screenInstance: AnyScreen) => string | Promise<string>;

   //----------------------- extra optional arguments (from Args_DialogWindow) that might be relevant if opened in DialogWindow

   width?: string | number | undefined;
   height?: string | number | undefined;
   enableResize?: boolean;
   htmlClassesPrefix ?: string;
   htmlClass ?: string;
   htmlClassesSuffix?: string;
   htmlStyle?: string;

   /**
    *
    * @param instance actually instance of AbstractDialogWindow, but cannot list as such because of circular references
    */
   onBeforeOpen?(instance: any): void;

   /**
    *
    * @param instance actually instance of AbstractDialogWindow, but cannot list as such because of circular references
    */
   onAfterOpen?(instance: any): void;

   /**
    *
    * @param instance actually instance of AbstractDialogWindow, but cannot list as such because of circular references
    * return true if close should continue, false otherwise
    */
   onBeforeClose?(instance: any): boolean;

   /**
    *
    * @param instance actually instance of AbstractDialogWindow, but cannot list as such because of circular references
    */
   onAfterClose?(instance: any): void;
}