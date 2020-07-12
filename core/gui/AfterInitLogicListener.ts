import {BaseListener}   from "../BaseListener";
import {AbstractWidget} from "./AbstractWidget";

export class AfterInitLogicEvent {
   origin:AbstractWidget;
}

export abstract class AfterInitLogicListener extends BaseListener<AfterInitLogicEvent>{

   eventFired(ev: AfterInitLogicEvent): void {
      this.afterInitLogic(ev);
   }

   abstract afterInitLogic(ev:AfterInitLogicEvent): void;
} // main class