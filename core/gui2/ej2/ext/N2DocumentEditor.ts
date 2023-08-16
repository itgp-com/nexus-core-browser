import {
    DocumentEditorContainer,
    DocumentEditorContainerModel,
    Editor,
    EditorHistory,
    Print,
    Search,
    Selection,
    SfdtExport,
    TextExport,
    Toolbar,
    WordExport
} from "@syncfusion/ej2-documenteditor";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2DocumentEditorRef extends StateNx2EjBasicRef {
    widget?: N2DocumentEditor;
}

DocumentEditorContainer.Inject(Editor, EditorHistory, Print, Search, Selection, SfdtExport, TextExport, Toolbar, WordExport);

export interface StateN2DocumentEditor<WIDGET_LIBRARY_MODEL extends DocumentEditorContainerModel = DocumentEditorContainerModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2DocumentEditorRef;
}

export class N2DocumentEditor<STATE extends StateN2DocumentEditor = StateN2DocumentEditor> extends Nx2EjBasic<STATE, DocumentEditorContainer> {
    static readonly CLASS_IDENTIFIER: string = "N2DocumentEditor"

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2DocumentEditor.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new DocumentEditorContainer(this.state.ej);
    }

    get classIdentifier() { return N2DocumentEditor.CLASS_IDENTIFIER; }

}