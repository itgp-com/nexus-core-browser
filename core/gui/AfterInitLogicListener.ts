import {BaseListener} from "../BaseListener";


export class AfterInitLogicEvent<T = any> {
   origin: T;
}

export type AfterInitLogicType = (ev: AfterInitLogicEvent) => void;

export abstract class AfterInitLogicListener extends BaseListener<AfterInitLogicEvent> {

   eventFired(ev: AfterInitLogicEvent): void {
      this.afterInitLogic(ev);
   }

   abstract afterInitLogic(ev: AfterInitLogicEvent): void;
} // main class