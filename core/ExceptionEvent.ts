export class ExceptionEvent {
   event_id: string;
   originInstance: any;
   exception: any;
   parametersAtExceptionTime?: any[];
   description ?: string;
   developerInfo ?: string;
   extras ?: any;
}