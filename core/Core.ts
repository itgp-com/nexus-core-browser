/// <reference path="./global.d.ts" />
import {enableRipple} from '@syncfusion/ej2-base';
import * as coreUI    from "./CoreUI";
import * as exHandler from "./CoreErrorHandling";
import * as utils     from "./CoreUtils";

let webUIStart = coreUI.webUIStart;

let startup = async function () {
    enableRipple(true);

    try {
        if (webUIStart) {

            // First save the base URL of the application for later relative URL processing
            let baseURL = new URL(".", window.location.href);// Startup should always occur in index.html. Therefore that is the appBase
            utils.setAppBase(baseURL);


            let initialParamsAsString: string = decodeURI(window.location.hash.substr(1)); // all the stuff after # but without #

            if (webUIStart.mainUI) {
                console.log("Calling mainUI with custom UI of type " + webUIStart.mainUI.constructor.name)
            } else {
                console.log("Calling mainUI with default MainUI instance")
                webUIStart.mainUI = new coreUI.MainUI();
            }
            webUIStart.mainUI.init();

            //Await all the aync activity to finish
            await webUIStart.mainUI.init_async();

            // Menu system started.

            try {
                // Process the initial parameters
                if (initialParamsAsString.startsWith('{') && initialParamsAsString.endsWith('}')) {
                    // it's JSON
                    let initParams = JSON.parse(initialParamsAsString);
                    if (initParams.mod)
                        webUIStart.mainUI.openModule({modID: initParams.mod as string, initialParams: initParams});
                }
            } catch (ex) {
                let errorHandler = exHandler.getErrorHandler();
                errorHandler.displayExceptionToUser(ex);
            }
        }
    } catch (ex ){
        // A catastrophic error has occurred on instantiating the very basic UI for the app
        console.log(ex);
        window.alert('Startup error: ' + ex);
    }
};

// /* GLOBAL STARTUP*/
////  ---- this code executes twice because of code duplication from bionexus.ts and core.ts transpiling duplicating all of CoreUI.ts and others
// document.addEventListener("DOMContentLoaded",
//     startup
// );
/* GLOBAL STARTUP*/
window.onload = startup;

export class VersionedBase {
    i_d:string
    v_e_r: number
}

export class Err extends VersionedBase {
    displayMessage: string;
    logMessage: string;
    extra:any;
}

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
}



