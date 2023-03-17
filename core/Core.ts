/// <reference path="./global.d.ts" />

import {AxiosError} from 'axios';
import {isObject} from 'lodash';

export class VersionedBase {
    i_d:string
    v_e_r: number
} // VersionedBase

export class Err extends VersionedBase {
    displayMessage: string;
    logMessage: string;
    extra:any;

    /**
     * If the error is an AxiosError, it will be stored here by the client.
     * This is not a part of the server's response, but is added by the client.
     * @type {AxiosError}
     */
    axiosError ?: AxiosError;
} // Err

export class RetVal extends VersionedBase {
    value: any;
    err: Err;
    extra:{};

    public hasError():boolean{
        return !!this.err;
    }

    public hasValue():boolean{
        return !!this.value;
    }
} // RetVal

export function isRetVal(obj: any, version ?: number): obj is RetVal {
    if (  obj !== null && typeof obj === 'object') {
        // if it's an object
        if (obj instanceof RetVal) {
            return !(version && obj.v_e_r !== version);
        }
        if (obj.i_d && obj.i_d === "RetVal") {
            return !(version && obj.v_e_r !== version);
        }
    }
    return false;
} // isRetVal

export function isErr(obj: any, version ?: number): obj is Err {
    if (  obj !== null && typeof obj === 'object') {
        // if it's an object
        if (obj instanceof Err) {
            return !(version && obj.v_e_r !== version);

        }
        if (obj && obj.i_d && obj.i_d === "Err") {
            return !(version && obj.v_e_r !== version);
        }
    }
    return false;
} // isErr

/**
 * Returns the value of the RetVal object or null if obj is not a RetVal
 * @param obj
 * @return {Err}
 */
export function getRetValErr(obj: any): Err {
    if (isRetVal(obj) && obj.err){
        return obj.err as Err;
    }
    return null;
}