import {InPlaceEditor, InPlaceEditorModel} from '@syncfusion/ej2-inplace-editor';
import {AutoComplete} from '@syncfusion/ej2-inplace-editor/src/inplace-editor/modules/auto-complete';
import {ColorPicker} from '@syncfusion/ej2-inplace-editor/src/inplace-editor/modules/color-picker';
import {ComboBox} from '@syncfusion/ej2-inplace-editor/src/inplace-editor/modules/combo-box';
import {DateRangePicker} from '@syncfusion/ej2-inplace-editor/src/inplace-editor/modules/date-range-picker';
import {MultiSelect} from '@syncfusion/ej2-inplace-editor/src/inplace-editor/modules/multi-select';
import {Rte} from '@syncfusion/ej2-inplace-editor/src/inplace-editor/modules/rte';
import {Slider} from '@syncfusion/ej2-inplace-editor/src/inplace-editor/modules/slider';
import {TimePicker} from '@syncfusion/ej2-inplace-editor/src/inplace-editor/modules/time-picker';
import {cssAdd} from '../../../CssUtils';
import {addN2Class} from '../../N2HtmlDecorator';
import {themeChangeListeners} from '../../Theming';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';

InPlaceEditor.Inject(
    AutoComplete,
    ColorPicker,
    ComboBox,
    DateRangePicker,
    MultiSelect,
    Rte,
    Slider,
    TimePicker,
);

export interface StateN2InPlaceEditorRef extends StateN2EjBasicRef {
    widget?: N2InPlaceEditor;
}

export interface StateN2InPlaceEditor<WIDGET_LIBRARY_MODEL extends InPlaceEditorModel = InPlaceEditorModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2InPlaceEditorRef;
}

export class N2InPlaceEditor<STATE extends StateN2InPlaceEditor = StateN2InPlaceEditor> extends N2EjBasic<STATE, InPlaceEditor> {
    static readonly CLASS_IDENTIFIER: string = 'N2InPlaceEditor';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2InPlaceEditor.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }


    createEjObj(): void {
        this.obj = new InPlaceEditor(this.state.ej);
    }

    get classIdentifier(): string { return N2InPlaceEditor.CLASS_IDENTIFIER; }


} // N2InPlaceEditor

themeChangeListeners().add((ev) => {

    // When editor is instantiated, have the same 8px left margin as the view label element before editing started
    cssAdd(`
.${N2InPlaceEditor.CLASS_IDENTIFIER}.e-inplaceeditor .e-editable-wrapper {
    padding-left: 8px;
    padding-right: 8px;
}    
    `); // cssAdd
}); // themeChangeListeners.add  default priority