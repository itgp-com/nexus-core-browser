import { MultiColumnComboBox, MultiColumnComboBoxModel } from '@syncfusion/ej2/multicolumn-combobox';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2MultiColumnComboBoxRef extends StateN2EjBasicRef {
    widget?: N2MultiColumnComboBox;
}

export interface StateN2MultiColumnComboBox<WIDGET_LIBRARY_MODEL extends MultiColumnComboBoxModel = MultiColumnComboBoxModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2MultiColumnComboBoxRef;
}

export class N2MultiColumnComboBox<STATE extends StateN2MultiColumnComboBox = StateN2MultiColumnComboBox> extends N2EjBasic<STATE, MultiColumnComboBox> {
    static readonly CLASS_IDENTIFIER: string = 'N2MultiColumnComboBox'

    constructor(state ?: STATE) {
        super(state);
    }


    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2MultiColumnComboBox.CLASS_IDENTIFIER);
        state.deco.tag = 'input';
        state.deco.otherAttr.type = 'text';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new MultiColumnComboBox(this.state.ej);
    }

    get classIdentifier() {
        return N2MultiColumnComboBox.CLASS_IDENTIFIER;
    }


}