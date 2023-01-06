import {BaseListener} from "../BaseListener";

export class BeforeInitLogicEvent<T=any> {
   origin:T;
}

export abstract class BeforeInitLogicListener extends BaseListener<BeforeInitLogicEvent>{

   eventFired(ev: BeforeInitLogicEvent): void {
      this.beforeInitLogic(ev);
   }

   abstract beforeInitLogic(ev:BeforeInitLogicEvent): void;

} // BeforeInitLogicListener
export type BeforeInitLogicType = (ev: BeforeInitLogicEvent) => void;