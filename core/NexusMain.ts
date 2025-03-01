import {setAppBase} from "./AppPathUtils";
import {getErrorHandler} from "./CoreErrorHandling";
import {UIStartedListener} from "./gui/UIStartedListener";
import {switchTheme} from './gui2/Theming';
import {ListenerHandler} from "./ListenerHandler";
import {NexusUI} from "./NexusUI";

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

         let initialParamsAsString: string = decodeURI(window.location.hash.substring(1)); // all the stuff after # but without #

         if (!thisX.ui) {
            window.alert("Error: Please define a menu class in coreUI.webUIStart.mainUI !")
            return;
         }

         //Await all the async activity to finish
         await thisX.ui.init();

         // on start, call the theme initialization with the initial theme state
         switchTheme(thisX.ui.initialThemeState());

         await thisX.ui.initUI();

         thisX.fireUIStartedListeners();

         // Menu system started, process any initial parameters passed in (appended to) the baseURL.
         await thisX.ui?.processURLParameters(initialParamsAsString);


      } catch (ex) {
         // A catastrophic error has occurred on instantiating the very basic UI for the app
         console.error(ex);
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
                                                             console.error(event);
                                                          }
                                                       });

                       } catch (t) {
                          console.error(t);
                       }
                       thisX.UIStartedListeners.clear(); // delete all the listeners
                    } // if (this.UIStartedListeners)
                    //--------------------------

                 },
                 1000);
   } // fireUIStartedListeners

} // NexusMain

export var nexusMain = new NexusMain();// overwrite from a module