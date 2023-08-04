import {Adaptor, HeatMap, HeatMapModel, Legend, Tooltip} from "@syncfusion/ej2-heatmap";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

HeatMap.Inject(Adaptor,Legend,Tooltip);

export interface StateNx2EjHeatMapRef extends StateNx2EjBasicRef {
    widget?: Nx2EjHeatMap;
}

export interface StateNx2EjHeatMap<WIDGET_LIBRARY_MODEL extends HeatMapModel = HeatMapModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjHeatMapRef;
}

export class Nx2EjHeatMap<STATE extends StateNx2EjHeatMap = StateNx2EjHeatMap> extends Nx2EjBasic<STATE, HeatMap> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjHeatMap');
    }

    createEjObj(): void {
        this.obj = new HeatMap(this.state.ej);
    }



}