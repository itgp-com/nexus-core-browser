import {BaseListener}   from "../../BaseListener";
import {AbstractWidget} from "../AbstractWidget";

export class ListenerAfterUpdate_Event {
   data:any;
   parent: AbstractWidget;
}

export abstract class ListenerAfterUpdate extends BaseListener<ListenerAfterUpdate_Event> {

   eventFired(ev: ListenerAfterUpdate_Event): void {
      this.updateComplete(ev);
   }

   abstract updateComplete(ev: ListenerAfterUpdate_Event): void;

}