export class AuthenticationOrRefreshRequest {
   /**
    * <code>true</code> if the request is a refresh.
    */
   isRefresh ?:boolean;
   username  ?:string;
   password  ?:string;
   permanentRefreshToken ?: boolean;

   /**
    * Could be unassigned and still be a refresh call if the refreshToken is stored in the cookie
    */
   refreshToken ?:string;
}