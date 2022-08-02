import {castArray} from "../BaseUtils";

export abstract class EJBase{

    i_d : string;
    v_e_r : number;
    // noinspection JSUnusedGlobalSymbols
    errMsgDisplay : string;
    // noinspection JSUnusedGlobalSymbols
    errMsgLog : string;
    // noinspection JSUnusedGlobalSymbols
    success :boolean = true;
    // noinspection JSUnusedGlobalSymbols
    errVisibleToClient:boolean = false
} // abstract class EJResponse{

// noinspection JSUnusedGlobalSymbols
export class EJList<T=any> extends EJBase{
    count : number = 0;
    result: T[] = [];

    // noinspection JSUnusedGlobalSymbols
    constructor(){
        super();
        this.i_d = "EJList";
        this.v_e_r = 1;
    }

    // noinspection JSUnusedGlobalSymbols
    resultAs(cl:{ new(args:any): T }):T[]{
        this.result = castArray(this.result, cl);
        return this.result;
    }
}

// noinspection JSUnusedGlobalSymbols
export class EJResult<T> extends EJBase {

    id: any;
    instance: any;

    // noinspection JSUnusedGlobalSymbols
    constructor() {
        super();
        this.i_d = "EJResult";
        this.v_e_r = 1;
    }
}

// noinspection JSUnusedGlobalSymbols
export class EJSingle<T> extends EJBase {
    result: T ;
    // noinspection JSUnusedGlobalSymbols
    errorMsg: string;

    // noinspection JSUnusedGlobalSymbols
    constructor() {
        super();
        this.i_d = "EJSingle";
        this.v_e_r = 1;
    }
}