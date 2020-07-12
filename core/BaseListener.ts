export abstract class BaseListener<Event>{
   abstract eventFired(ev: Event): void;
}