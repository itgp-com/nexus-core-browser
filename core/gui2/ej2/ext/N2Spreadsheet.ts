import {Spreadsheet, SpreadsheetModel} from "@syncfusion/ej2-spreadsheet";
import {AutoFill, Scroll, Selection} from '@syncfusion/ej2-spreadsheet/src/spreadsheet/actions';
import {Open} from '@syncfusion/ej2-spreadsheet/src/spreadsheet/integrations';
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

Spreadsheet.Inject(
    AutoFill,
    Open,
    Scroll,
    Selection,
);

export interface StateN2SpreadsheetRef extends StateNx2EjBasicRef {
    widget?: N2Spreadsheet;
}

export interface StateN2Spreadsheet<WIDGET_LIBRARY_MODEL extends SpreadsheetModel = SpreadsheetModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2SpreadsheetRef;
}

export class N2Spreadsheet<STATE extends StateN2Spreadsheet = StateN2Spreadsheet> extends Nx2EjBasic<STATE, Spreadsheet> {
    static readonly CLASS_IDENTIFIER: string = "N2Spreadsheet";

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2Spreadsheet.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new Spreadsheet(this.state.ej);
    }

    get classIdentifier(): string { return N2Spreadsheet.CLASS_IDENTIFIER; }

}