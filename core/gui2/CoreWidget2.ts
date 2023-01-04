import {IWidget2}        from "./IWidget2";
import {IStateWidget2}   from "./IStateWidget2";
import {getRandomString} from "../BaseUtils";
import {IHtmlUtils}      from "./IHtmlDecorator";

export abstract class CoreWidget2<STATE extends IStateWidget2> implements IWidget2 {

   protected _state: STATE;
   private _className: string;
   private _htmlElement: HTMLElement;

   protected constructor() {
      this._className = this.constructor.name; // the name of the class
      if (!this._state.tagId) this._state.tagId = getRandomString(this._className);
   } //  constructor


   protected async _build(state: STATE) {
      if (!state) state = {} as STATE;
      if (!this._state) this._state = state;
      await this.createHtmlElement();
   }


//-------------- Start IWidget2 ----------------------------


   async createHtmlElement(): Promise<HTMLElement> {
      let decorator = this.state.decorator;
      if (!decorator) decorator = {
         tag: "div"
      }

      let htmlElement: HTMLElement = document.createElement("div");
      htmlElement.id               = this.tagId;
      return htmlElement;
   };


   async refresh(f ?: (VoidFunction | Promise<VoidFunction>)) {

      if (f) {
         let f2: VoidFunction = await f; // wait for the promise to resolve
         f2.call(this); // execute in context
      }

      if (this.state.repaintOnRefresh) {
         //TODO implement
         console.log("TODO implement refresh for repaintOnRefresh");
      } else {
         //TODO implement
         console.log("TODO implement regular refresh");
      }
   } // refresh

//-------------- End IWidget2 ----------------------------


   get className(): string {
      return this._className;
   }

   set className(value: string) {
      this._className = value;
   }

   get state(): STATE {
      return this._state;
   } // state

   set state(state: STATE) {
      if (state)
         state.decorator = IHtmlUtils.init(state.decorator); // the decorator must exist because there must be a tag type for the component HTML
      this._state = state;
   }


   get tagId(): string {
      return this.state.tagId;
   }

   set tagId(value: string) {
      this.state.tagId = value;
   }


   get htmlElement(): HTMLElement {
      return this._htmlElement;
   }

   set htmlElement(value: HTMLElement) {
      this._htmlElement = value;
   }
} // CoreWidget2