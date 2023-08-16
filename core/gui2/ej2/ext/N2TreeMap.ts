import {TreeMap, TreeMapModel} from "@syncfusion/ej2-treemap";
import {TreeMapLegend} from '@syncfusion/ej2-treemap/src/treemap/layout/legend';
import {ImageExport} from '@syncfusion/ej2-treemap/src/treemap/model/image-export';
import {PdfExport} from '@syncfusion/ej2-treemap/src/treemap/model/pdf-export';
import {Print} from '@syncfusion/ej2-treemap/src/treemap/model/print';
import {
    TreeMapHighlight,
    TreeMapSelection
} from '@syncfusion/ej2-treemap/src/treemap/user-interaction/highlight-selection';
import {TreeMapTooltip} from '@syncfusion/ej2-treemap/src/treemap/user-interaction/tooltip';
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

TreeMap.Inject(
    ImageExport,
    PdfExport,
    Print,
    TreeMapHighlight,
    TreeMapLegend,
    TreeMapSelection,
    TreeMapTooltip,
);

export interface StateN2TreeMapRef extends StateNx2EjBasicRef {
    widget?: N2TreeMap;
}

export interface StateN2TreeMap<WIDGET_LIBRARY_MODEL extends TreeMapModel = TreeMapModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2TreeMapRef;
}

export class N2TreeMap<STATE extends StateN2TreeMap = StateN2TreeMap> extends Nx2EjBasic<STATE, TreeMap> {
    static readonly CLASS_IDENTIFIER: string = "N2TreeMap";

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2TreeMap.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new TreeMap(this.state.ej);
    }

    get classIdentifier(): string { return N2TreeMap.CLASS_IDENTIFIER; }

}