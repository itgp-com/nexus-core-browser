import {ColorPicker, ColorPickerModel} from "@syncfusion/ej2-inputs";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2ColorPickerRef extends StateNx2EjBasicRef {
    widget?: N2ColorPicker;
}

export interface StateN2ColorPicker extends StateNx2EjBasic<ColorPickerModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ColorPickerRef;
} // state class

export class N2ColorPicker<STATE extends StateN2ColorPicker = StateN2ColorPicker> extends Nx2EjBasic<STATE, ColorPicker> {
    static readonly CLASS_IDENTIFIER: string = "N2ColorPicker"
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2ColorPicker.CLASS_IDENTIFIER);
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        state.deco.otherAttr['type'] = 'color';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new ColorPicker(this.state.ej);
    }

    get classIdentifier() {
        return N2ColorPicker.CLASS_IDENTIFIER;
    }


} // main class