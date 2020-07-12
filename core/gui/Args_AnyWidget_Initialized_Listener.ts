import {AnyWidget}            from "./AnyWidget";
import {Args_AnyWidget}       from "./Args_AnyWidget";
import {BaseListener}         from "../BaseListener";
import {BeforeInitLogicEvent} from "./BeforeInitLogicListener";

export class Args_AnyWidget_Initialized_Event {
   widget: AnyWidget;
   args: Args_AnyWidget
}


/**
 * Fired when the Args_AnyWidget instance is completely initialized, but before the Args_AnyWidget functions
 * line initContentBegin, initContentEnd, etc are invoked
 */
export abstract class Args_AnyWidget_Initialized_Listener extends BaseListener<Args_AnyWidget_Initialized_Event> {
   eventFired(ev: Args_AnyWidget_Initialized_Event): void {
      this.argsAnyWidgetInitialized(ev);
   }

   abstract argsAnyWidgetInitialized(evt: Args_AnyWidget_Initialized_Event): void;
} //Args_AnyWidget_Initialized_Listener