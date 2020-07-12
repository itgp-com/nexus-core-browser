import {AbstractWidget}    from "./AbstractWidget";
import {BaseListener}      from "../BaseListener";
import {StopListenerChain} from "../ListenerHandler";

export class BeforeRepaintWidgetEvent extends StopListenerChain{
   widget: AbstractWidget;
}

export abstract class BeforeRepaintWidgetListener extends BaseListener<BeforeRepaintWidgetEvent>{

   eventFired(ev: BeforeRepaintWidgetEvent): void {
      this.beforeRepaintWidget(ev);
   }

   abstract beforeRepaintWidget(ev:BeforeRepaintWidgetEvent): void;
}