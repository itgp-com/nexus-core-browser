import {Slider, SliderModel} from '@syncfusion/ej2-inputs';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2SliderRef extends StateN2EjBasicRef {
    widget?: N2Slider;
}

export interface StateN2Slider<WIDGET_LIBRARY_MODEL extends SliderModel = SliderModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2SliderRef;
}

export class N2Slider<STATE extends StateN2Slider = StateN2Slider> extends N2EjBasic<STATE, Slider> {
    static readonly CLASS_IDENTIFIER: string = 'N2Slider';

    constructor(state ?: STATE) {
        super(state);
        addN2Class(this.state.deco, N2Slider.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new Slider(this.state.ej);
    }

    get classIdentifier(): string { return N2Slider.CLASS_IDENTIFIER; }

}