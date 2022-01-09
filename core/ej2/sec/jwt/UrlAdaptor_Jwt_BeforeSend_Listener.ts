import {BeforeSendListener, UrlAdaptorListenerRetVal} from "../../events/UrlAdaptorEvents";
import {DataManager}                                  from "@syncfusion/ej2-data";
import {Security_JWT}                                 from "../../../sec/jwt/Security_JWT";

export class UrlAdaptor_Jwt_BeforeSend_Listener implements BeforeSendListener {
   beforeSend(dm: DataManager, request: XMLHttpRequest): UrlAdaptorListenerRetVal {
      let retVal: UrlAdaptorListenerRetVal = {
         stopProcessingSubsequentListeners: false
      }

      if (!Security_JWT.instance.enabled)
         return retVal; // nothing to do

      return retVal;
   }


}