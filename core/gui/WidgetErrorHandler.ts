import {AxiosResponse}  from "axios";
import {Err}            from "../Core";
import {ExceptionEvent} from "../ExceptionEvent";

export class Args_WidgetErrorHandler {
   err: (AxiosResponse | Err | Error | ExceptionEvent | any);
}

export class WidgetErrorHandlerStatus {
   isErrorHandled: boolean;
}

export abstract class WidgetErrorHandler {
   abstract handleWidgetError( args: Args_WidgetErrorHandler): WidgetErrorHandlerStatus;
}