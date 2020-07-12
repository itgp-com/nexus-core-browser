import {BaseListener}   from "../BaseListener";
import {AbstractWidget} from "./AbstractWidget";
export class ParentAddedEvent{
   parent:AbstractWidget;
   child: AbstractWidget;
}

/**
 * Listener that gets triggered on any AbstractWidget after the widget has been tagged with  parent (or a null parent)
 */
export abstract class ParentAddedListener extends BaseListener<ParentAddedEvent>{

   eventFired(ev: ParentAddedEvent): void {
      this.parentAdded(ev);
   }

   abstract parentAdded(ev:ParentAddedEvent):void;
}