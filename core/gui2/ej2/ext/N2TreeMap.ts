nexusMain.UIStartedListeners.add((ev:any)=>{
    link_widget_dataSource_NexusDataManager(TreeMap.prototype);
}); // normal priority


export interface StateN2TreeMapRef extends StateN2EjBasicRef {
    widget?: N2TreeMap;
}

export interface StateN2TreeMap<WIDGET_LIBRARY_MODEL extends TreeMapModel = TreeMapModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2TreeMapRef;
}

export class N2TreeMap<STATE extends StateN2TreeMap = StateN2TreeMap> extends N2EjBasic<STATE, TreeMap> {
    static readonly CLASS_IDENTIFIER: string = 'N2TreeMap';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2TreeMap.CLASS_IDENTIFIER);
        super.onStateInitialized(state);
    }


    createEjObj(): void {
        this.obj = new TreeMap(this.state.ej);
    }

    get classIdentifier(): string { return N2TreeMap.CLASS_IDENTIFIER; }

} // N2TreeMap

import {Sparkline} from '@syncfusion/ej2-charts';
import {TreeMap, TreeMapModel} from '@syncfusion/ej2-treemap';
import {TreeMapLegend} from '@syncfusion/ej2-treemap/src/treemap/layout/legend';
import {ImageExport} from '@syncfusion/ej2-treemap/src/treemap/model/image-export';
import {PdfExport} from '@syncfusion/ej2-treemap/src/treemap/model/pdf-export';
import {Print} from '@syncfusion/ej2-treemap/src/treemap/model/print';
import {
    TreeMapHighlight,
    TreeMapSelection
} from '@syncfusion/ej2-treemap/src/treemap/user-interaction/highlight-selection';
import {TreeMapTooltip} from '@syncfusion/ej2-treemap/src/treemap/user-interaction/tooltip';
import {nexusMain} from '../../../NexusMain';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';
import {link_widget_dataSource_NexusDataManager} from './util/N2Wrapper_dataSource';

TreeMap.Inject(
    ImageExport,
    PdfExport,
    Print,
    TreeMapHighlight,
    TreeMapLegend,
    TreeMapSelection,
    TreeMapTooltip,
);