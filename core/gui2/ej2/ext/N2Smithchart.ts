import {Smithchart, SmithchartLegend, SmithchartModel, TooltipRender} from "@syncfusion/ej2-charts";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

Smithchart.Inject(SmithchartLegend, TooltipRender);

export interface StateN2SmithchartRef extends StateNx2EjBasicRef {
    widget?: N2Smithchart;
}

export interface StateN2Smithchart<WIDGET_LIBRARY_MODEL extends SmithchartModel = SmithchartModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2SmithchartRef;
}

export class N2Smithchart<STATE extends StateN2Smithchart = StateN2Smithchart> extends Nx2EjBasic<STATE, Smithchart> {
    static readonly CLASS_IDENTIFIER: string = "N2Smithchart";

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2Smithchart.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new Smithchart(this.state.ej);
    }

    get classIdentifier(): string { return N2Smithchart.CLASS_IDENTIFIER; }

}