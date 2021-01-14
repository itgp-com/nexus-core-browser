/// <reference path="./global.d.ts" />

export class VersionedBase {
    i_d:string
    v_e_r: number
} // VersionedBase

export class Err extends VersionedBase {
    displayMessage: string;
    logMessage: string;
    extra:any;
} // Err

export class RetVal extends VersionedBase {
    value: any;
    err: Err;
    extra:{};

    public hasError():boolean{
        if ( this.err){
            return true;
        }
        return false;
    }

    public hasValue():boolean{
        if ( this.value){
            return true;
        }
        return false;
    }
} // RetVal



