import {Spreadsheet, SpreadsheetModel} from "@syncfusion/ej2-spreadsheet";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjSpreadsheetRef extends StateNx2EjBasicRef {
    widget?: Nx2EjSpreadsheet;
}

export interface StateNx2EjSpreadsheet<WIDGET_LIBRARY_MODEL extends SpreadsheetModel = SpreadsheetModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjSpreadsheetRef;
}

export class Nx2EjSpreadsheet<STATE extends StateNx2EjSpreadsheet = StateNx2EjSpreadsheet> extends Nx2EjBasic<STATE, Spreadsheet> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjSpreadsheet');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Spreadsheet(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}