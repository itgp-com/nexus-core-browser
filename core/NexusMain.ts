import {NexusUI}           from "./NexusUI";
import {ListenerHandler}   from "./ListenerHandler";
import {UIStartedListener} from "./gui/UIStartedListener";
import {setAppBase}        from "./AppPathUtils";
import {getErrorHandler}   from "./CoreErrorHandling";

export class NexusMain {
   public ui: NexusUI;

   private readonly _UIStartedListeners: ListenerHandler<any, UIStartedListener> = new ListenerHandler<any, UIStartedListener>();

   // noinspection JSUnusedGlobalSymbols
   public async start() {

      try {
         let thisX = nexusMain;

         // First save the base URL of the application for later relative URL processing
         let baseURL = new URL(".", window.location.href);// Startup should always occur in index.html. Therefore that is the appBase
         setAppBase(baseURL);

         let initialParamsAsString: string = decodeURI(window.location.hash.substr(1)); // all the stuff after # but without #

         if (!thisX.ui) {
            window.alert("Error: Please define a menu class in coreUI.webUIStart.mainUI !")
            return;
         }

         //Await all the aync activity to finish
         await thisX.ui.init();

         // Initialize the screen registry
         thisX.ui.screenRegistry = await thisX.ui.createNewScreenRegistry();
         thisX.ui.menuRegistry = await thisX.ui.createNewMenuRegistry();

         await thisX.ui.initUI();

         // Menu system started, process any initial parameters passed in (appended to) the baseURL.
         await thisX.ui?.processURLParameters(initialParamsAsString);



         /**
          * TODO: This is a horrible hack that needs to disappear - allows all the table models to register their UIStartedListeners
          */
         thisX.fireUIStartedListeners();


      } catch (ex) {
         // A catastrophic error has occurred on instantiating the very basic UI for the app
         console.log(ex);
         //window.alert('Startup error: ' + ex);
         getErrorHandler().displayErrorMessageToUser('Initialization failed with the following server message: ' + ex)
      }
   };

   get UIStartedListeners(): ListenerHandler<any, UIStartedListener> {
      return this._UIStartedListeners;
   }

   protected fireUIStartedListeners(){
      let thisX = this;
      setTimeout(() => {
                    //--- 2020-05-13 Dave
                    // fire all the UIStart listeners then delete them - it's a one time deal for the whole app
                    if (thisX.UIStartedListeners) {
                       try {
                          thisX.UIStartedListeners.fire({
                                                          event:            {}, // empty event
                                                          exceptionHandler: event => {
                                                             console.log(event);
                                                          }
                                                       });

                       } catch (t) {
                          console.log(t);
                       }
                       thisX.UIStartedListeners.clear(); // delete all the listeners
                    } // if (this.UIStartedListeners)
                    //--------------------------

                 },
                 1000);
   } // fireUIStartedListeners

} // WebUIStart

export var nexusMain = new NexusMain();// overwrite from a module