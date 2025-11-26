import {StateN2Grid} from './ej2/ext/N2Grid';

/**
 * This class contains a number of static methods that should be rewritten by applications
 * to provide the necessary authentication and authorization functionality.
 */
export class N2Auth {

    public static isAdmin(): boolean { return false; }

} // N2Auth

export class N2GridAuth {
    public static allowExcelExport(args:Args_N2GridAllow): boolean { return true; }


    /**
     * Modify the state to allow Excel export depending on the user's permissions.
     * @param {Args_N2GridAllow} args
     */
    public static applyExcelExport(args:Args_N2GridAllow): void {
        let state = args?.state;
        if (state) {
            state.ej = state.ej || {};
            state.ej.allowExcelExport = N2GridAuth.allowExcelExport(args);
        } // if state
    } //static applyExcelExport

    /**
     * Determine if the grid dropdown should allow grouping.
     * @param args
     */
    public static disableGroupingInDropDownMenu(args:Args_N2GridAllow): boolean { return true; }

    public static applyDisableGroupingInDropDownMenu(args:Args_N2GridAllow): void {
        let state = args?.state;
        if (state) {
            state.ej = state.ej || {};
            state.disableDefaultGroupingInDropDownMenu = N2GridAuth.disableGroupingInDropDownMenu(args);
        } // if state
    } //static applyGrouping

} // N2GridAuth

export interface Args_N2GridAllow {
    state ?: StateN2Grid;
    extras ?:  Record<string, any>; // Index signature to allow additional properties
}