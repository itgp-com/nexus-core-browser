import {Slider, SliderModel} from "@syncfusion/ej2-inputs";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjSliderRef extends StateNx2EjBasicRef {
    widget?: Nx2EjSlider;
}

export interface StateNx2EjSlider<WIDGET_LIBRARY_MODEL extends SliderModel = SliderModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjSliderRef;
}

export class Nx2EjSlider<STATE extends StateNx2EjSlider = StateNx2EjSlider> extends Nx2EjBasic<STATE, Slider> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjSlider');
    }

    createEjObj(): void {
        this.obj = new Slider(this.state.ej);
    }



}