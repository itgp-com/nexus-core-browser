import {InPlaceEditor, InPlaceEditorModel} from "@syncfusion/ej2-inplace-editor";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


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