export abstract class EJBase {

   i_d: string;
   v_e_r: number;
   // noinspection JSUnusedGlobalSymbols
   errMsgDisplay: string;
   // noinspection JSUnusedGlobalSymbols
   errMsgLog: string;
   // noinspection JSUnusedGlobalSymbols
   success: boolean            = true;
   // noinspection JSUnusedGlobalSymbols
   errVisibleToClient: boolean = false
} // abstract class EJResponse{

const EJLIST_CLASS_NAME   = "EJList";
const EJRESULT_CLASS_NAME = "EJResult"
const EJSINGLE_CLASS_NAME = "EJSingle"

// noinspection JSUnusedGlobalSymbols
export class EJList<T = any> extends EJBase {
   count: number = 0;
   result: T[]   = [];

   // noinspection JSUnusedGlobalSymbols
   constructor() {
      super();
      this.i_d   = EJLIST_CLASS_NAME;
      this.v_e_r = 1;
   }

   // // noinspection JSUnusedGlobalSymbols
   // resultAs(cl: { new(args: any): T }): T[] {
   //    this.result = castArray(this.result, cl);
   //    return this.result;
   // }
}

// noinspection JSUnusedGlobalSymbols
export class EJResult<T> extends EJBase {

   id: any;
   instance: any;

   // noinspection JSUnusedGlobalSymbols
   constructor() {
      super();
      this.i_d   = EJRESULT_CLASS_NAME;
      this.v_e_r = 1;
   }
}

// noinspection JSUnusedGlobalSymbols
export class EJSingle<T> extends EJBase {
   result: T;
   // noinspection JSUnusedGlobalSymbols
   errorMsg: string;

   // noinspection JSUnusedGlobalSymbols
   constructor() {
      super();
      this.i_d   = EJSINGLE_CLASS_NAME;
      this.v_e_r = 1;
   }
}