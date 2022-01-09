import {DataManager}         from "@syncfusion/ej2-data";
import {UrlAdaptor_Abstract} from "../UrlAdaptor_Abstract";

/**
 *
 */
export interface UrlAdaptorListenerRetVal<T = void> {
   stopProcessingSubsequentListeners: boolean;
   // value:T;
}

export interface UrlAdaptorListenerRetValCancellable<T = void> extends UrlAdaptorListenerRetVal<T> {
   cancel: boolean;
}

//---------  Listener exception ---------------
export class UrlAdaptorListenerExceptionEvent {

   exceptionCode ?: string;
   exception: any;

   className  ?: string;

   userMessage?: string;
   other ?: any;

}

export class UrlAdaptorListenerExceptionEventRetVal {

   /**
    * if <code>true</code> then it's the equivalent of the original listener having returned {@link UrlAdaptorListenerRetVal.stopProcessingSubsequentListeners} = <code>true</code>
    *
    * If any of the {@link UrlAdaptorListenerExceptionHandler}s sets this to true, it will be true
    *
    */
   stopProcessingSubsequentListeners: boolean;
}

export interface UrlAdaptorListenerExceptionHandler {
   listenerException(evt: UrlAdaptorListenerExceptionEvent): UrlAdaptorListenerExceptionEventRetVal
}

//-------------- Adaptor Methods ----------------------
export interface BeforeSendListener {
   beforeSend(dm: DataManager, request: XMLHttpRequest, adaptor: UrlAdaptor_Abstract): UrlAdaptorListenerRetVal;
}



