import {Sparkline, SparklineTooltip, SparklineModel} from "@syncfusion/ej2-charts";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

Sparkline.Inject(SparklineTooltip);

export interface StateNx2EjSparklineRef extends StateNx2EjBasicRef {
    widget?: Nx2EjSparkline;
}

export interface StateNx2EjSparkline<WIDGET_LIBRARY_MODEL extends SparklineModel = SparklineModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjSparklineRef;
}

export class Nx2EjSparkline<STATE extends StateNx2EjSparkline = StateNx2EjSparkline> extends Nx2EjBasic<STATE, Sparkline> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjSparkline');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Sparkline(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}