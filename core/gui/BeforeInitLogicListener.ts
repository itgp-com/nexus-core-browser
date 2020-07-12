import {BaseListener} from "../BaseListener";

export class BeforeInitLogicEvent {
   origin:any;
}

export abstract class BeforeInitLogicListener extends BaseListener<BeforeInitLogicEvent>{

   eventFired(ev: BeforeInitLogicEvent): void {
      this.beforeInitLogic(ev);
   }

   abstract beforeInitLogic(ev:BeforeInitLogicEvent): void;

} // BeforeInitLogicListener