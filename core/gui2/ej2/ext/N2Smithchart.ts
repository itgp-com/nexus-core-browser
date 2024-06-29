nexusMain.UIStartedListeners.add((ev:any)=>{
    link_widget_dataSource_NexusDataManager(Smithchart.prototype);
}); // normal priority

export interface StateN2SmithchartRef extends StateN2EjBasicRef {
    widget?: N2Smithchart;
}

export interface StateN2Smithchart<WIDGET_LIBRARY_MODEL extends SmithchartModel = SmithchartModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2SmithchartRef;
}

export class N2Smithchart<STATE extends StateN2Smithchart = StateN2Smithchart> extends N2EjBasic<STATE, Smithchart> {
    static readonly CLASS_IDENTIFIER: string = 'N2Smithchart';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2Smithchart.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }


    createEjObj(): void {
        this.obj = new Smithchart(this.state.ej);
    }

    get classIdentifier(): string { return N2Smithchart.CLASS_IDENTIFIER; }

} // N2Smithchart

import {Smithchart, SmithchartLegend, SmithchartModel, TooltipRender} from '@syncfusion/ej2-charts';
import {nexusMain} from '../../../NexusMain';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';
import {link_widget_dataSource_NexusDataManager} from './util/N2Wrapper_dataSource';

Smithchart.Inject(SmithchartLegend, TooltipRender);