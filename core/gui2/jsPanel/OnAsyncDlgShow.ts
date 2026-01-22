// THIS MODULE DOES NOT HAVE ANY IMPORTS ON PURPOSE TO AVOID CIRCULAR DEPENDENCIES
// WHEN USED AS EXTENDED INTERFACE IN N2

/**
 * Interface for objects that can handle the async dialog show lifecycle.
 * Method signature allows an optional first `state` parameter for backwards compatibility.
 */
export interface OnAsyncDlgShow<STATE = any> {
    onAsyncDlgShow: (state: STATE, ev: N2Evt_OnAsyncDlgShow) => Promise<void>;
}

/**
 * Event object passed to the onAsyncDlgShow event handler
 * @widget will contain the object to be displayed in the dialog
 * @widget_N2Dlg will contain the N2Dlg instance. Cast to N2Dlg (cannot cast here to avoid circular dependency)
 */
export interface N2Evt_OnAsyncDlgShow<WIDGET = any> {

    widget: WIDGET;

    /**
     * instance of the N2Dlg that is calling the onAsyncDlgShow
     * Defined as 'any' here to avoid circular dependency between N2 and N2Dlg
     */
    widget_N2Dlg: any;
}

/**
 * Type guard to detect if an arbitrary object implements {@link OnAsyncDlgShow}.
 * - Safe for null/undefined
 */
export function isOnAsyncDlgShow(value: unknown): value is OnAsyncDlgShow {
    return !!value && typeof (value as any).onAsyncDlgShow === 'function';
}

/**
 * Type guard to determine if the value is of type N2Evt_OnAsyncDlgShow
 * @param value
 */
export function isN2Evt_OnAsyncDlgShow(value: any): value is N2Evt_OnAsyncDlgShow {
    return (
        // valid object
        typeof value === 'object' &&
        value !== null &&
        // valid widget
        'widget' in (value as any) &&
            //valid N2Dlg object
        'widget_N2Dlg' in (value as any) &&
        (value as any).widget_N2Dlg != null &&

            // isN2
        value.isN2 !== null &&
        value.isN2 !== undefined &&
        typeof value.isN2 === 'boolean' &&
        value.isN2 === true

    );
}