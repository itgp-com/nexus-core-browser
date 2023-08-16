import {PivotView, PivotViewModel} from "@syncfusion/ej2-pivotview";
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
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

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

export interface StateN2PivotViewRef extends StateNx2EjBasicRef {
    widget?: N2PivotView;
}

export interface StateN2PivotView extends StateNx2EjBasic<PivotViewModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2PivotViewRef;
} // state class

export class N2PivotView<STATE extends StateN2PivotView = StateN2PivotView> extends Nx2EjBasic<STATE, PivotView> {
    static readonly CLASS_IDENTIFIER: string = "N2PivotView";

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2PivotView.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new PivotView(this.state.ej);
    }

    get classIdentifier(): string { return N2PivotView.CLASS_IDENTIFIER; }

} // main class