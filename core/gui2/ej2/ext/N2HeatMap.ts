import {Adaptor, HeatMap, HeatMapModel, Legend, Tooltip} from "@syncfusion/ej2-heatmap";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

HeatMap.Inject(Adaptor, Legend, Tooltip);

export interface StateN2HeatMapRef extends StateNx2EjBasicRef {
    widget?: N2HeatMap;
}

export interface StateN2HeatMap<WIDGET_LIBRARY_MODEL extends HeatMapModel = HeatMapModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2HeatMapRef;
}

export class N2HeatMap<STATE extends StateN2HeatMap = StateN2HeatMap> extends Nx2EjBasic<STATE, HeatMap> {
    static readonly CLASS_IDENTIFIER: string = "N2HeatMap"

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2HeatMap.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new HeatMap(this.state.ej);
    }

    get classIdentifier() { return N2HeatMap.CLASS_IDENTIFIER; }

}