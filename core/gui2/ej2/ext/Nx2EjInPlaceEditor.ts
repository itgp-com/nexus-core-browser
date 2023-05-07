import {InPlaceEditor, InPlaceEditorModel} from "@syncfusion/ej2-inplace-editor";
import {AutoComplete} from '@syncfusion/ej2-inplace-editor/src/inplace-editor/modules/auto-complete';
import {ColorPicker} from '@syncfusion/ej2-inplace-editor/src/inplace-editor/modules/color-picker';
import {ComboBox} from '@syncfusion/ej2-inplace-editor/src/inplace-editor/modules/combo-box';
import {DateRangePicker} from '@syncfusion/ej2-inplace-editor/src/inplace-editor/modules/date-range-picker';
import {MultiSelect} from '@syncfusion/ej2-inplace-editor/src/inplace-editor/modules/multi-select';
import {Rte} from '@syncfusion/ej2-inplace-editor/src/inplace-editor/modules/rte';
import {Slider} from '@syncfusion/ej2-inplace-editor/src/inplace-editor/modules/slider';
import {TimePicker} from '@syncfusion/ej2-inplace-editor/src/inplace-editor/modules/time-picker';
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

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

export interface StateNx2EjInPlaceEditorRef extends StateNx2EjBasicRef {
    widget?: Nx2EjInPlaceEditor;
}

export interface StateNx2EjInPlaceEditor<WIDGET_LIBRARY_MODEL extends InPlaceEditorModel = InPlaceEditorModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjInPlaceEditorRef;
}

export class Nx2EjInPlaceEditor<STATE extends StateNx2EjInPlaceEditor = StateNx2EjInPlaceEditor> extends Nx2EjBasic<STATE, InPlaceEditor> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjInPlaceEditor');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new InPlaceEditor(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}