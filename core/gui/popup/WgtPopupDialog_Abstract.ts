/**
 * Parameters for an WgtPopupDialog_Abstract
 */
import {AnyScreen} from "../AnyScreen";

export class Args_WgtPopupDialog_Abstract<SCREEN_TYPE extends AnyScreen> {

   /**
    * Function used to instantiate the base screen used to render to popup dialog.
    */
   initScreenFunction : ()=>(SCREEN_TYPE | Promise<SCREEN_TYPE>);

}

/**
 * Abstract base for popups
 */
export abstract class WgtPopupDialog_Abstract< SCREEN_TYPE extends AnyScreen, INIT_ARGS extends Args_WgtPopupDialog_Abstract<SCREEN_TYPE>,> {

   initArgs:INIT_ARGS;


   /**
    * Implement this method to offer a default screen to be used in the popup dialog
    */
   abstract default_initScreenFunction() :(AnyScreen | Promise<AnyScreen>);


   /**
    * Function used to initialize the screen. One option is to use the corresponding
    */
   async initScreenFunction() :Promise<AnyScreen>{
      let screen:AnyScreen = null;

      // First try any method provided by the initialization arguments
      if (this.initArgs?.initScreenFunction) {
         try {
            screen = await this.initArgs.initScreenFunction();
         } catch (e) {
            console.error(e);
         }
      }

      if (!screen) {
         // if no screen provided by initialization, go with the default implementation
         try {
            screen = await this.default_initScreenFunction();
         } catch (e) {
            console.error(e);
         }
      }

      return screen;
   }


} // WgtPopupDialog_Abstract