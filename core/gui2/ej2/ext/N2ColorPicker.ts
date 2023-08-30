import {ColorPicker, ColorPickerModel} from '@syncfusion/ej2-inputs';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2ColorPickerRef extends StateN2EjBasicRef {
    widget?: N2ColorPicker;
}

export interface StateN2ColorPicker extends StateN2EjBasic<ColorPickerModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ColorPickerRef;
} // state class

export class N2ColorPicker<STATE extends StateN2ColorPicker = StateN2ColorPicker> extends N2EjBasic<STATE, ColorPicker> {
    static readonly CLASS_IDENTIFIER: string = 'N2ColorPicker'
    constructor(state ?: STATE) {
        super(state);
    }

    onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2ColorPicker.CLASS_IDENTIFIER);
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