import {Args_AnyWidget, AnyWidget, initialize_Args_AnyWidget} from "../../AnyWidget";

export class AppWidgetDescriptor extends Args_AnyWidget{

   /**
    * Number between 1 and 12 for BootStrap column width
    * Defaults to 4
    */
   colSpan?: number;

   autocomplete?: string;

   inputType ?: string = 'text';

   labelHTML?: string;

   classesInputRow ?: string;

   /**
    * Number between 1 and 12 for BootStrap column width
    * Defaults to 4
    */
   labelSpan?: number;

   initialOffset ?: number;

   errorRowSpacer ?: boolean ;



   floatInput_id ?: string;


   /**
    * This is a static method because a class method would be required to be instantiated when  {@link htmlTextBoxFloating} is called with {colName:'aaa',...}
    * See: https://stackoverflow.com/questions/47239507/property-getreadableschedule-is-missing-in-type
    * @param options
    */
   static initialize(options: AppWidgetDescriptor, widget ?:AnyWidget): void {

      initialize_Args_AnyWidget(options, widget);

      options.errorRowSpacer = true;
      if (!options.colSpan)
         options.colSpan = 4;

      if (!options.autocomplete)
         options.autocomplete = 'off';

      if (!options.classesInputRow)
         options.classesInputRow = '';

      // if (!options.required)
      //    options.required = false;
      //
      // if (!options.readonly)
      //    options.readonly = false;

      if (!options.inputType)
         options.inputType = 'text';

      // if (!options.id)
      //    options.id = options.colName;

      if (!options.labelHTML)
         options.labelHTML = options.propertyName;

      if (!options.labelSpan)
         options.labelSpan = 2;

      if (options.initialOffset == null)
         options.initialOffset = 2;


      if (!options.floatInput_id)
         options.floatInput_id = `${options.id}FLoatInput`;
   }

}