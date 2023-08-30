import {Adaptor, HeatMap, HeatMapModel, Legend, Tooltip} from '@syncfusion/ej2-heatmap';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';

HeatMap.Inject(Adaptor, Legend, Tooltip);

export interface StateN2HeatMapRef extends StateN2EjBasicRef {
    widget?: N2HeatMap;
}

export interface StateN2HeatMap<WIDGET_LIBRARY_MODEL extends HeatMapModel = HeatMapModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2HeatMapRef;
}

export class N2HeatMap<STATE extends StateN2HeatMap = StateN2HeatMap> extends N2EjBasic<STATE, HeatMap> {
    static readonly CLASS_IDENTIFIER: string = 'N2HeatMap'

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2HeatMap.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }

    createEjObj(): void {
        this.obj = new HeatMap(this.state.ej);
    }

    get classIdentifier() { return N2HeatMap.CLASS_IDENTIFIER; }

}