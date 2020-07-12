import {BaseListener}        from "../BaseListener";
import {AfterInitLogicEvent} from "../gui/AfterInitLogicListener";

/**
 * Allows the developer to be informed when all the basic parts of the UI are initialized (but the
 *  first screen has not been initialized yet).
 *
 * @author David Pociu - InsiTech  (created 2020-05-13)
 */
export abstract class UIStartedListener extends BaseListener<any>{

   eventFired(ev: AfterInitLogicEvent): void {
      this.uiStarted();
   }

   /**
    * Informs anyone listening that everything in the UI is not initialized
    */
   abstract uiStarted(): void;
}