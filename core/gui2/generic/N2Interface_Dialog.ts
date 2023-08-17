import {N2} from '../N2';


export interface N2Interface_Dialog<DIALOG extends N2 = any, WIDGET extends N2 = any>
    extends N2Interface_Dialog_Open<DIALOG, WIDGET>,
            N2Interface_Dialog_Close<DIALOG, WIDGET> {
}


export interface N2Interface_Dialog_Open<DIALOG extends N2 = any, WIDGET extends N2 = any> {
    /**
     * Called when an N2 dialog is opened (after the content is initialized)
     * @param {N2Evt_Dialog} evt
     */
    onDialogOpen(evt ?: N2Evt_Dialog<DIALOG, WIDGET>): void;
}

export interface N2Interface_Dialog_Close<DIALOG extends N2 = any, WIDGET extends N2 = any> {
    /**
     * Called when an N2 dialog is closed (after the content is closed).
     *
     * This is called before any user close logic on the Dialog os called, and before the N2 component destroy() method is called.
     *
     * @param {N2Evt_Dialog} evt
     */
    onDialogClose(evt ?: N2Evt_Dialog<DIALOG, WIDGET>): void;
}

export interface N2Evt_Dialog<DIALOG extends N2, WIDGET extends N2> {
    dialog: DIALOG;
    widget: WIDGET;
}

export function isN2_Interface_Dialog(obj: any): obj is N2Interface_Dialog<any, any> {
    return isN2_Interface_Dialog_Open(obj) && isN2_Interface_Dialog_Close(obj);
}

export function isN2_Interface_Dialog_Open(obj: any): obj is N2Interface_Dialog_Open<any, any> {
    return obj && obj.onDialogOpen;
}

export function isN2_Interface_Dialog_Close(obj: any): obj is N2Interface_Dialog_Close<any, any> {
    return obj && obj.onDialogClose;
}