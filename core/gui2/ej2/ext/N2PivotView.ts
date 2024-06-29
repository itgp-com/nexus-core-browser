
export interface StateN2PivotViewRef extends StateN2EjBasicRef {
    widget?: N2PivotView;
}

export interface StateN2PivotView extends StateN2EjBasic<PivotViewModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2PivotViewRef;
} // state class

export class N2PivotView<STATE extends StateN2PivotView = StateN2PivotView> extends N2EjBasic<STATE, PivotView> {
    static readonly CLASS_IDENTIFIER: string = 'N2PivotView';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2PivotView.CLASS_IDENTIFIER);
        super.onStateInitialized(state);
    }


    createEjObj(): void {
        this.obj = new PivotView(this.state.ej);
    }

    get classIdentifier(): string { return N2PivotView.CLASS_IDENTIFIER; }

} // N2PivotView


import {PivotView, PivotViewModel} from '@syncfusion/ej2-pivotview';
import {Common} from '@syncfusion/ej2-pivotview/src/common/actions/common';
import {CalculatedField} from '@syncfusion/ej2-pivotview/src/common/calculatedfield/calculated-field';
import {ConditionalFormatting} from '@syncfusion/ej2-pivotview/src/common/conditionalformatting/conditional-formatting';
import {GroupingBar} from '@syncfusion/ej2-pivotview/src/common/grouping-bar/grouping-bar';
import {NumberFormatting} from '@syncfusion/ej2-pivotview/src/common/popups/formatting-dialog';
import {Grouping} from '@syncfusion/ej2-pivotview/src/common/popups/grouping';
import {Toolbar} from '@syncfusion/ej2-pivotview/src/common/popups/toolbar';
import {PivotChart} from '@syncfusion/ej2-pivotview/src/pivotchart';
import {ChartExport} from '@syncfusion/ej2-pivotview/src/pivotchart/actions/chart-export';
import {PivotFieldList} from '@syncfusion/ej2-pivotview/src/pivotfieldlist/base/field-list';
import {DrillThrough} from '@syncfusion/ej2-pivotview/src/pivotview/actions/drill-through';
import {ExcelExport} from '@syncfusion/ej2-pivotview/src/pivotview/actions/excel-export';
import {Pager} from '@syncfusion/ej2-pivotview/src/pivotview/actions/pager';
import {PDFExport} from '@syncfusion/ej2-pivotview/src/pivotview/actions/pdf-export';
import {VirtualScroll} from '@syncfusion/ej2-pivotview/src/pivotview/actions/virtualscroll';
import {ej} from '@syncfusion/ej2/dist/ej2';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';

PivotView.Inject(
    CalculatedField,
    ChartExport,
    Common,
    ConditionalFormatting,
    DrillThrough,
    ExcelExport,
    Grouping,
    GroupingBar,
    NumberFormatting,
    Pager,
    PDFExport,
    PivotChart,
    PivotFieldList,
    Toolbar,
    VirtualScroll,
);