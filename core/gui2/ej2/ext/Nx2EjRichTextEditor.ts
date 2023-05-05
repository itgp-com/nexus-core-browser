import {HtmlEditor, Image, Link, RichTextEditor, RichTextEditorModel, Toolbar} from '@syncfusion/ej2-richtexteditor';
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

RichTextEditor.Inject(Toolbar, Link, Image, HtmlEditor);

export interface StateNx2EjRichTextEditorRef extends StateNx2EjBasicRef {
    widget?: Nx2EjRichTextEditor;
}

export interface StateNx2EjRichTextEditor extends StateNx2EjBasic<RichTextEditorModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjRichTextEditorRef;
} // state class

export class Nx2EjRichTextEditor<STATE extends StateNx2EjRichTextEditor = StateNx2EjRichTextEditor> extends Nx2EjBasic<STATE, RichTextEditor> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjRichTextEditor');
    }

    onStateInitialized(state: STATE) {
        super.onStateInitialized(state);
    }

    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new RichTextEditor(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor);

    }
} // main class