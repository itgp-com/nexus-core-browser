/**
 * This abstract class provides the standard implementation for some of the localXXXXX functions that is the same in many of the regular components
 *
 * @author David Pociu - InsiTech
 */
import {Component}                                                                                                         from "@syncfusion/ej2-base";
import {AnyWidget, Args_AnyWidget, localContentBeginStandard, localContentEndStandard, localRefreshImplementationStandard} from "./AnyWidget";
import {addWidgetClass}                                                                                                    from "./AbstractWidget";

export abstract class AnyWidgetStandard<EJ2COMPONENT extends (Component<HTMLElement> | HTMLElement | any) = any, ARGS_ANY_WIDGET extends Args_AnyWidget = Args_AnyWidget, DATA_TYPE = any>
   extends AnyWidget<EJ2COMPONENT, ARGS_ANY_WIDGET, DATA_TYPE> {

   protected constructor() {
      super();
   }

   async initialize_AnyWidgetStandard(args?: ARGS_ANY_WIDGET) {
      addWidgetClass(args, 'AnyWidgetStandard');
      await this.initialize_AnyWidget(args);
   } // initialize_AnyWidgetStandard

   async localContentBegin(): Promise<string> {
      return localContentBeginStandard(this);
   }

   async localContentEnd(): Promise<string> {
      return localContentEndStandard(this);
   }

   async localRefreshImplementation() {
      await localRefreshImplementationStandard(this);
   } // localRefreshImplementation

} // AnyWidgetStandard class