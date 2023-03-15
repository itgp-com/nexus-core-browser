import {Nx2} from '../Nx2';


export interface Nx2Interface_Dialog<DIALOG extends Nx2 = any, WIDGET extends Nx2 = any>
    extends Nx2Interface_Dialog_Open<DIALOG, WIDGET>,
            Nx2Interface_Dialog_Close<DIALOG, WIDGET> {
}


export interface Nx2Interface_Dialog_Open<DIALOG extends Nx2 = any, WIDGET extends Nx2 = any> {
    /**
     * Called when an Nx2 dialog is opened (after the content is initialized)
     * @param {Nx2Evt_Dialog} evt
     */
    onDialogOpen(evt ?: Nx2Evt_Dialog<DIALOG, WIDGET>): void;
}

export interface Nx2Interface_Dialog_Close<DIALOG extends Nx2 = any, WIDGET extends Nx2 = any> {
    /**
     * Called when an Nx2 dialog is closed (after the content is closed).
     *
     * This is called before any user close logic on the Dialog os called, and before the Nx2 component destroy() method is called.
     *
     * @param {Nx2Evt_Dialog} evt
     */
    onDialogClose(evt ?: Nx2Evt_Dialog<DIALOG, WIDGET>): void;
}

export interface Nx2Evt_Dialog<DIALOG extends Nx2, WIDGET extends Nx2> {
    dialog: DIALOG;
    widget: WIDGET;
}

export function isNx2_Interface_Dialog(obj: any): obj is Nx2Interface_Dialog<any, any> {
    return isNx2_Interface_Dialog_Open(obj) && isNx2_Interface_Dialog_Close(obj);
}

export function isNx2_Interface_Dialog_Open(obj: any): obj is Nx2Interface_Dialog_Open<any, any> {
    return obj && obj.onDialogOpen;
}

export function isNx2_Interface_Dialog_Close(obj: any): obj is Nx2Interface_Dialog_Close<any, any> {
    return obj && obj.onDialogClose;
}