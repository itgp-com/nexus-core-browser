import {AxiosResponse} from "axios";

export class AuthenticationResult {
   static readonly ERROR_UNAUTHORIZED: number = 1
   /**
    * The response is a 200 HTTP Code, but the body is either empty or does not match the expectation
    * of containing a token, refreshToken and expiration date in UTC(Zulu) time format
    */
   static readonly ERROR_INVALID_RESPONSE: number      = AuthenticationResult.ERROR_UNAUTHORIZED + 1;

   /**
    * The HTTP Code returned was neither 200 (Ok) or 401 (Unauthorized)
    */
   static readonly ERROR_HTTP_CODE: number    = AuthenticationResult.ERROR_INVALID_RESPONSE + 1;

   /**
    * An exception has occurred that was not anticipated at development time.
    */
   static readonly ERROR_EXCEPTION: number    = AuthenticationResult.ERROR_HTTP_CODE + 1;

   /**
    * An exception has occurred that was not anticipated at development time.
    */
   static readonly ERROR_EXCEPTION_EXPIRATION_TIME: number    = AuthenticationResult.ERROR_EXCEPTION + 1;




   success: boolean;
   errorCode: number;  // see static error codes above
   axiosResponse: AxiosResponse;
   exception: any;

}