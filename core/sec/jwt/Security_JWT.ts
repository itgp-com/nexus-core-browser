import {getAppPath}                     from "nexus-core-browser/core/CoreUtils";
import {asyncHttpPost}                  from "nexus-core-browser/core/ej2/WidgetUtils";
import {AuthenticationOrRefreshRequest} from "./AuthenticationOrRefreshRequest";
import {AxiosResponse}                  from "axios";
import {AuthenticationResult}           from "./AuthenticationResult";

export class Security_JWT {

   public static readonly instance: Security_JWT = new Security_JWT();

   private _enabled: boolean;
   readonly enabledListeners: Security_JWT_Enabled_Listener[] = [];

   /**
    * How many seconds before expiration to we trigger the refresh
    * @private
    */
   private secondsBeforeExpiration: number = 60; // default to 1 minute before expiration


   #authenticationPath: string = "authenticate";
   #refreshPath: string        = "refreshToken";
   #accessToken: string;
   #expirationTime: Date;
   #refreshToken: string;

   protected constructor() {
   }

   get enabled(): boolean {
      return this._enabled;
   }

   set enabled(value: boolean) {
      if (this.enabledListeners.length) {
         for (const enabledListener of this.enabledListeners) {
            let cancel = enabledListener.enabledChanged(value);
            if (cancel)
               return;
         } // for

      } // if (this.enabledListeners.length)

      this._enabled = value;
   } // enabled

   async authenticationURL(): Promise<string> {
      //TODO: Ask the server first what the authenticationPath is for this application

      while (this.#authenticationPath.startsWith('/'))
         this.#authenticationPath = this.#authenticationPath.substring(1); // eliminate first char if '/'

      let appPath: string = getAppPath();
      let path: string    = encodeURI(`${appPath}${this.#authenticationPath}`);
      return path;
   }

   async refreshURL(): Promise<string> {
      //TODO: Ask the server first what the authenticationPath is for this application

      while (this.#authenticationPath.startsWith('/'))
         this.#authenticationPath = this.#authenticationPath.substring(1); // eliminate first char if '/'

      let appPath: string = getAppPath();
      let path: string    = encodeURI(`${appPath}${this.#authenticationPath}`);
      return path;
   }


   async authenticate(authenticationRequest: AuthenticationOrRefreshRequest): Promise<AuthenticationResult> {
      if (!authenticationRequest)
         authenticationRequest = new AuthenticationOrRefreshRequest();
      authenticationRequest.isRefresh = false;
      return this.doCall(authenticationRequest);
   } // authenticate

   async refresh(authenticationRequest: AuthenticationOrRefreshRequest): Promise<AuthenticationResult> {
      if (!authenticationRequest)
         authenticationRequest = new AuthenticationOrRefreshRequest();
      authenticationRequest.isRefresh = true;

      return this.doCall(authenticationRequest);
   } // refresh


   private async doCall(authenticationRequest: AuthenticationOrRefreshRequest): Promise<AuthenticationResult> {
      let authResponse: AuthenticationResult = new AuthenticationResult(); // starts as success = false

      authResponse.success = false;
      try {
         let axiosResponse: AxiosResponse = await asyncHttpPost(
            await (authenticationRequest.isRefresh ? this.refreshURL() : this.authenticationURL()),
            authenticationRequest,
         );


         authResponse.axiosResponse = axiosResponse;

         try {
            if (axiosResponse.status == 200) {
               let auth = axiosResponse.data?.value;
               if (auth) {
                  let token: string        = auth.token;
                  let refreshToken: string = auth.refreshToken;
                  let expAsString: string  = auth.expirationTime;

                  if (token != null && refreshToken != null && expAsString != null) {
                     try {

                        /**
                         * const anExampleVariable = "2021-10-27T21:36:18.192Z"
                         * let  d:Date = new Date(anExampleVariable);
                         * console.log(d.toString());      -->    "Wed Oct 27 2021 17:36:18 GMT-0400 (Eastern Daylight Time)"
                         * console.log(d.toUTCString());   -->    "Wed, 27 Oct 2021 21:36:18 GMT"
                         */
                        let expirationTime: Date = new Date(expAsString);

                        this.#accessToken    = token;
                        this.#expirationTime = expirationTime;
                        this.#refreshToken   = refreshToken;

                        auth.success = true;

                        return auth;
                     } catch (dateError) {
                        authResponse.errorCode = AuthenticationResult.ERROR_EXCEPTION_EXPIRATION_TIME;
                        authResponse.exception = dateError;
                     }
                  } else {
                     authResponse.errorCode = AuthenticationResult.ERROR_INVALID_RESPONSE;
                  }
               } else {
                  // no data
                  authResponse.errorCode = AuthenticationResult.ERROR_INVALID_RESPONSE;
               }
            } else {
               if (axiosResponse.status == 401) {
                  // bad user/password
                  authResponse.errorCode = AuthenticationResult.ERROR_UNAUTHORIZED;
               } else {
                  // status not 200 or 401 (Unauthorized)
                  authResponse.errorCode = AuthenticationResult.ERROR_HTTP_CODE;
               }
            }

         } catch (error) {
            authResponse.errorCode = AuthenticationResult.ERROR_EXCEPTION;
            authResponse.exception = error;
         }

      } catch (error) {
         authResponse.errorCode = AuthenticationResult.ERROR_EXCEPTION;
         authResponse.exception = error;
      }
      return authResponse; // success
   }


} // main class


export interface Security_JWT_Enabled_Listener {
   /**
    *
    * @param newValue the new value of the enabled flag (existing value is obviously the reverse)
    * @return <code>false</code> to continue, <code>true</code> to veto/cancel the change in enable status
    */
   enabledChanged(newValue: boolean): boolean;
}

