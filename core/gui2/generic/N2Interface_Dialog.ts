import {N2} from '../N2';


export interface N2Interface_Dialog<DIALOG extends N2 = any, WIDGET extends N2|HTMLElement = any>
    extends N2Interface_Dialog_Open<DIALOG, WIDGET>,
            N2Interface_Dialog_Close<DIALOG, WIDGET>,
            N2Interface_Dialog_BeforeOpen<DIALOG, WIDGET>,
            N2Interface_Dialog_BeforeClose<DIALOG, WIDGET> {
}


export interface N2Interface_Dialog_Open<DIALOG extends N2 = any, WIDGET extends N2|HTMLElement = any> {
    /**
     * Called when an N2 dialog is opened (after the content is initialized)
     * @param {N2Evt_Dialog} evt
     */
    onDialogOpen(evt ?: N2Evt_Dialog<DIALOG, WIDGET>): void;
} // N2Interface_Dialog_Open

export interface N2Interface_Dialog_Close<DIALOG extends N2 = any, WIDGET extends N2|HTMLElement = any> {
    /**
     * Called when an N2 dialog is closed (after the content is closed).
     *
     * This is called before any user close logic on the Dialog os called, and before the N2 component destroy() method is called.
     *
     * @param {N2Evt_Dialog} evt
     */
    onDialogClose(evt ?: N2Evt_Dialog<DIALOG, WIDGET>): void;
} // N2Interface_Dialog_Close

export interface N2Interface_Dialog_BeforeOpen<DIALOG extends N2 = any, WIDGET extends N2|HTMLElement = any> {
    /**
     * Called when an N2 dialog is opened (after the content is initialized)
     * @param {N2Evt_Dialog} evt
     */
    onDialogBeforeOpen(evt ?: N2Evt_Dialog_Cancellable<DIALOG, WIDGET>): void;
} // N2Interface_Dialog_BeforeOpen

export interface N2Interface_Dialog_BeforeClose<DIALOG extends N2 = any, WIDGET extends N2|HTMLElement = any> {
    /**
     * Called when an N2 dialog is closed (after the content is closed).
     *
     * This is called before any user close logic on the Dialog os called
     *
     * @param {N2Evt_Dialog} evt
     */
    onDialogBeforeClose(evt ?: N2Evt_Dialog_Cancellable<DIALOG, WIDGET>): void;
} // N2Interface_Dialog_BeforeClose

export interface N2Evt_Dialog<DIALOG extends N2=N2, WIDGET extends N2|HTMLElement=N2> {
    dialog: DIALOG;
    widget: WIDGET;
    native_event : any;
}

export interface N2Evt_Dialog_Cancellable<DIALOG extends N2=N2, WIDGET extends N2|HTMLElement=N2> extends N2Evt_Dialog<DIALOG, WIDGET> {
    /**
     * If set to true, the dialog will not be closed
     */
    cancel?: boolean;
}

export function isN2_Interface_Dialog(obj: any): obj is N2Interface_Dialog<any, any> {
    return isN2_Interface_Dialog_Open(obj) && isN2_Interface_Dialog_Close(obj) && isN2_Interface_Dialog_BeforeClose(obj) && isN2_Interface_Dialog_BeforeOpen(obj);
}

export function isN2_Interface_Dialog_Open(obj: any): obj is N2Interface_Dialog_Open<any, any> {
    return obj && obj.onDialogOpen;
}

export function isN2_Interface_Dialog_BeforeOpen(obj: any): obj is N2Interface_Dialog_BeforeOpen<any, any> {
    return obj && obj.onDialogBeforeOpen;
}

export function isN2_Interface_Dialog_Close(obj: any): obj is N2Interface_Dialog_Close<any, any> {
    return obj && obj.onDialogClose;
}

export function isN2_Interface_Dialog_BeforeClose(obj: any): obj is N2Interface_Dialog_BeforeClose<any, any> {
    return obj && obj.onDialogBeforeClose;
}