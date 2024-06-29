nexusMain.UIStartedListeners.add((ev:any)=>{
    link_widget_dataSource_NexusDataManager(Spreadsheet.prototype);
}); // normal priority


export interface StateN2SpreadsheetRef extends StateN2EjBasicRef {
    widget?: N2Spreadsheet;
}

export interface StateN2Spreadsheet<WIDGET_LIBRARY_MODEL extends SpreadsheetModel = SpreadsheetModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2SpreadsheetRef;
}

export class N2Spreadsheet<STATE extends StateN2Spreadsheet = StateN2Spreadsheet> extends N2EjBasic<STATE, Spreadsheet> {
    static readonly CLASS_IDENTIFIER: string = 'N2Spreadsheet';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2Spreadsheet.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }


    createEjObj(): void {
        this.obj = new Spreadsheet(this.state.ej);
    }

    get classIdentifier(): string { return N2Spreadsheet.CLASS_IDENTIFIER; }

}

import {Spreadsheet, SpreadsheetModel} from '@syncfusion/ej2-spreadsheet';
import {AutoFill, Scroll, Selection} from '@syncfusion/ej2-spreadsheet/src/spreadsheet/actions';
import {Open} from '@syncfusion/ej2-spreadsheet/src/spreadsheet/integrations';
import {nexusMain} from '../../../NexusMain';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';
import {link_widget_dataSource_NexusDataManager} from './util/N2Wrapper_dataSource';

Spreadsheet.Inject(
    AutoFill,
    Open,
    Scroll,
    Selection,
);