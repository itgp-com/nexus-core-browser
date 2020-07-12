import {AbstractWidget} from "./AbstractWidget";
import {BaseListener}   from "../BaseListener";

export class AfterRepaintWidgetEvent {
   widget: AbstractWidget;
}

export abstract class AfterRepaintWidgetListener extends BaseListener<AfterRepaintWidgetEvent>{

   eventFired(ev: AfterRepaintWidgetEvent): void {
      this.afterRepaintWidget(ev);
   }
   
   abstract afterRepaintWidget(ev:AfterRepaintWidgetEvent): void;
}