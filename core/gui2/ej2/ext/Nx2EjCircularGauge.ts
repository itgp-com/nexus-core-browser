import {CircularGauge, CircularGaugeModel} from "@syncfusion/ej2-circulargauge";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjCircularGaugeRef extends StateNx2EjBasicRef {
    widget?: Nx2EjCircularGauge;
}

export interface StateNx2EjCircularGauge<WIDGET_LIBRARY_MODEL extends CircularGaugeModel = CircularGaugeModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjCircularGaugeRef;
}

export class Nx2EjCircularGauge<STATE extends StateNx2EjCircularGauge = StateNx2EjCircularGauge> extends Nx2EjBasic<STATE, CircularGauge> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjCircularGauge');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new CircularGauge(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}