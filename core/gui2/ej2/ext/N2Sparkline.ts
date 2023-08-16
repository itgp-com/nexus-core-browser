import {Sparkline, SparklineModel, SparklineTooltip} from "@syncfusion/ej2-charts";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

Sparkline.Inject(SparklineTooltip);

export interface StateN2SparklineRef extends StateNx2EjBasicRef {
    widget?: N2Sparkline;
}

export interface StateN2Sparkline<WIDGET_LIBRARY_MODEL extends SparklineModel = SparklineModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2SparklineRef;
}

export class N2Sparkline<STATE extends StateN2Sparkline = StateN2Sparkline> extends Nx2EjBasic<STATE, Sparkline> {
    static readonly CLASS_IDENTIFIER: string = "N2Sparkline";

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2Sparkline.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new Sparkline(this.state.ej);
    }

    get classIdentifier(): string { return N2Sparkline.CLASS_IDENTIFIER; }

}