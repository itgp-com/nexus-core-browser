import {Component}       from "@syncfusion/ej2-base";
import {AnyWidget}       from "../gui/AnyWidget";
import {Args_AnyWidget}  from "../gui/Args_AnyWidget";
import {AbstractWidget}  from "../gui/AbstractWidget";
import {getErrorHandler} from "../CoreErrorHandling";

export class Ej2Widget<
   EJ2COMPONENT extends Component<HTMLElement> = Component<HTMLElement>,
   DESCRIPTOR extends Args_AnyWidget = Args_AnyWidget
   > extends AnyWidget<EJ2COMPONENT, DESCRIPTOR>{


   constructor(descriptor: DESCRIPTOR, widgetContainer ?: AbstractWidget) {
      // default empty constructor
      super();

      // initialize separately.
      // This allows the extending components to initialize the parameters needed to be passed to initEj2Widget before
      // calling it directly
      if (descriptor) {
         this.initEj2Widget(descriptor, widgetContainer);
      }
   }

   initEj2Widget(descriptor: DESCRIPTOR, widgetContainer ?: AbstractWidget):void {
      this.initializeDescriptor(descriptor);

      if ( widgetContainer) {
         if (widgetContainer instanceof AbstractWidget) {
            widgetContainer.addChild(this);
         } else {
            getErrorHandler().displayExceptionToUser(`widgetContainer was not the correct class for in widget ${JSON.stringify(this.descriptor, null, 2)}. WidgetContainer was ${JSON.stringify(widgetContainer, null, 2)}`)
         }
      } // if widgetContainer
      super.initialize_AnyWidget(descriptor);
   } //initEj2Widget

   /**
    * Method that can be overridden by extending classes to custom initialize the default values of the descriptor
    * @param descriptor
    */
   initializeDescriptor(descriptor:DESCRIPTOR){
      Args_AnyWidget.initialize(descriptor, this);
   }


} // class Ej2Widget