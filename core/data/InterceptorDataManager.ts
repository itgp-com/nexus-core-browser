import {DataManager, Query} from '@syncfusion/ej2-data';
import {Ajax}               from '@syncfusion/ej2-base';

/*
If in Core, diferent path lib creates incompatibility
Ej2 should be global, but for now it's at the project level
See https://stackoverflow.com/questions/6480549/install-dependencies-globally-and-locally-using-package-json
 */

export interface SuccessResponse {
    xhr: any,
    count: number,
    result: Object[],
    request: any,
    aggregates: any,
    actual: any,
    virtualSelectRecords: any,
}

export interface ErrorResponse {
    error: any
}

export interface OnSuccessExecuteQuery {
    (args: SuccessResponse): void;
}

export interface OnFailExecuteQuery {
    (args: ErrorResponse): void;
}

export interface OnAlwaysExecuteQuery {
    (args: SuccessResponse| ErrorResponse): void;
}

export interface OnExecuteLocal {
    (query: Query): Object[];
}

/**
 * Usage:
 *
 <code>
                this.idm.onSuccess = (args) =>{
                    console.log("OnSuccess: " + JSON.stringify(args, null, 2))
                }
 </code>
 */
export class InterceptorDataManager extends DataManager {

    public onSuccess: OnSuccessExecuteQuery;

    public onFail: OnFailExecuteQuery;

    public onAlways: OnAlwaysExecuteQuery;

    public onLocal: OnExecuteLocal;

    executeLocal(query?: Query): Object[] {

        if (this.onLocal){
            let data:Object[] = this.onLocal(query);
            if (data)
                return data; // return data, no more query
        }

        return super.executeLocal(query);
    }


    executeQuery(query: Query | Function, done?: Function, fail?: Function, always?: Function): Promise<Ajax> {

        let classThis = this;
        let newDone = function (args: SuccessResponse) {
            try {
                if (done)
                    done(args);
            } finally {
                if (classThis.onSuccess)
                    classThis.onSuccess(args);
            }
        };

        let newFail = function (args: ErrorResponse) {
            try {
                if (fail)
                    fail();
            } finally {
                if (classThis.onFail)
                    classThis.onFail(args);
            }

        };

        let newAlways = function (args: SuccessResponse| ErrorResponse) {
            try {
                if (always)
                    always(args);
            } finally {
                if (classThis.onAlways)
                    classThis.onAlways(args);
            }
        };
        return super.executeQuery(query, newDone, newFail, newAlways);
    }


}