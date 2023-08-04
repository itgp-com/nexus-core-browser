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

export interface StateNx2EjTreeMapRef extends StateNx2EjBasicRef {
    widget?: Nx2EjTreeMap;
}

export interface StateNx2EjTreeMap<WIDGET_LIBRARY_MODEL extends TreeMapModel = TreeMapModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjTreeMapRef;
}

export class Nx2EjTreeMap<STATE extends StateNx2EjTreeMap = StateNx2EjTreeMap> extends Nx2EjBasic<STATE, TreeMap> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjTreeMap');
    }

    createEjObj(): void {
        this.obj = new TreeMap(this.state.ej);
    }



}