import {HttpRequestEvt, HttpResponseEvt} from "./data/NexusComm";
import {ThemeState} from './gui2/Theming';

export abstract class NexusUI {

   private _mainUITagID: string = '_nexus_moduleContainer';
   private _lastUITagID:string  = 'app__l_a_s_t__';

   /**
    * First method to be called to initialize any initial settings before calling {@link createNewScreenRegistry}
    */
   abstract init():Promise<void>;
   /**
    * Called to finish initializing the UI after the first init() call and the relevant screens have been registered
    */
   abstract initUI():Promise<void>;

   /**
    * Called after {@link initUI} in order to process any URL parameters passed in after the root application URL
    *
    * @param initialParamsAsString  initial parameters (free range - depends on specific app)
    */
   abstract processURLParameters(initialParamsAsString:string):Promise<void>;

   /**
    * Return the initial theme state for the application that describes the
    * initial theme that should exist in all html pages.
    *
    * On Nexus start the switchTheme will be called with this state
    * @return {ThemeState}
    */
   abstract initialThemeState():ThemeState;


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

   /**
    * Called when any HTTP request is made by the application.
    * Look at the type of event to know which parameters are available.
    *
    * @param ev
    */
   onHttpRequest(ev:HttpRequestEvt): void {
   }

   /**
    * Called when any HTTP response is received by the application.
    * Look at the type of event to know which parameters are available.
    * @param ev
    */
   onHttpResponse(ev:HttpResponseEvt): void {
   }


} // abstract NexusUI