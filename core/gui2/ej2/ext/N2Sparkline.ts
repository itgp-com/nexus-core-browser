nexusMain.UIStartedListeners.add((ev:any)=>{
    link_widget_dataSource_NexusDataManager(Sparkline.prototype);
}); // normal priority


export interface StateN2SparklineRef extends StateN2EjBasicRef {
    widget?: N2Sparkline;
}

export interface StateN2Sparkline<WIDGET_LIBRARY_MODEL extends SparklineModel = SparklineModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2SparklineRef;
}

export class N2Sparkline<STATE extends StateN2Sparkline = StateN2Sparkline> extends N2EjBasic<STATE, Sparkline> {
    static readonly CLASS_IDENTIFIER: string = 'N2Sparkline';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2Sparkline.CLASS_IDENTIFIER);
        super.onStateInitialized(state);
    }


    createEjObj(): void {
        this.obj = new Sparkline(this.state.ej);
    }

    get classIdentifier(): string { return N2Sparkline.CLASS_IDENTIFIER; }

}

import {Sparkline, SparklineModel, SparklineTooltip} from '@syncfusion/ej2-charts';
import {nexusMain} from '../../../NexusMain';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';
import {link_widget_dataSource_NexusDataManager} from './util/N2Wrapper_dataSource';

Sparkline.Inject(SparklineTooltip);