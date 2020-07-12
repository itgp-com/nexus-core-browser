import {getAtWindowPath, getOrInitialize} from "./CoreUtils"
import {ErrorHandler}                     from "./ErrorHandler";


/**
 * window[ERROR_HANDLER_ROOT_PATH] -> root of error_handler settings
 *              [HANDLER_INSTANCE_PATH] = instance of error handler
 *
 */
const ERROR_HANDLER_ROOT_PATH = 'errorHandler';
const HANDLER_INSTANCE_PATH   = 'handlerInstance';

function getErrorRegistryLocation(): any {
    return getAtWindowPath(ERROR_HANDLER_ROOT_PATH);
}

/**
 * Retrieves the current instance of the ErrorHandler. Lazy initialization if not already created.
 */
export function getErrorHandler(): ErrorHandler {

    let f = function () {
        return new ErrorHandler();
    };

    return getOrInitialize(getErrorRegistryLocation(), HANDLER_INSTANCE_PATH, f);
}

export function setErrorHandler(newErrorHandler: ErrorHandler) {
    let obj                    = getErrorRegistryLocation();
    obj[HANDLER_INSTANCE_PATH] = newErrorHandler;
}




