import {Smithchart, SmithchartLegend, SmithchartModel, TooltipRender} from "@syncfusion/ej2-charts";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

Smithchart.Inject(SmithchartLegend, TooltipRender);
export interface StateNx2EjSmithchartRef extends StateNx2EjBasicRef {
    widget?: Nx2EjSmithchart;
}

export interface StateNx2EjSmithchart<WIDGET_LIBRARY_MODEL extends SmithchartModel = SmithchartModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjSmithchartRef;
}

export class Nx2EjSmithchart<STATE extends StateNx2EjSmithchart = StateNx2EjSmithchart> extends Nx2EjBasic<STATE, Smithchart> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjSmithchart');
    }

    createEjObj(): void {
        this.obj = new Smithchart(this.state.ej);
    }



}