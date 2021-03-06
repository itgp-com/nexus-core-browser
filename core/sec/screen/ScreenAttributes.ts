/**
 * Global screen registration record for all screens that need central registration (in order to be included in a menu, or security for example)
 *
 */
import {AnyScreen}            from "../../gui/AnyScreen";
import {StringArg}            from "../../CoreUtils";
import {Args_DialogWindow}    from "../../ej2/DialogWindow";
import {AbstractDialogWindow} from "../../ej2/AbstractDialogWindow";

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
   create_function: (param ?: any) => AnyScreen | Promise<AnyScreen>;

   /**
    * The dialog header in which the actual screen is being displayed. This is the top band of the Dialog, not the screen title
    * The function receives the freshly instantiated screen result of create_function as a parameter
    */
   header ?:  (screenInstance: AnyScreen) => string | Promise<string>;

   //----------------------- extra optional arguments (from Args_DialogWindow) that might be relevant if opened in DialogWindow

   width?: string | number | undefined;
   height?: string | number | undefined;
   enableResize?: boolean;
   htmlClassesPrefix ?: string;
   htmlClass ?: string;
   htmlClassesSuffix?: string;
   htmlStyle?: string;

   onBeforeOpen?(instance: AbstractDialogWindow): void;

   onAfterOpen?(instance: AbstractDialogWindow): void;

   /**
    *
    * @param instance
    * return true if close should continue, false otherwise
    */
   onBeforeClose?(instance: AbstractDialogWindow): boolean;

   onAfterClose?(instance: AbstractDialogWindow): void;
}