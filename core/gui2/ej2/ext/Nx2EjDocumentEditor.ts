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


export interface StateNx2EjDocumentEditorContainerRef extends StateNx2EjBasicRef {
    widget?: Nx2EjDocumentEditorContainer;
}

DocumentEditorContainer.Inject(Editor,EditorHistory,Print,Search,Selection,SfdtExport,TextExport,Toolbar,WordExport);

export interface StateNx2EjDocumentEditorContainer<WIDGET_LIBRARY_MODEL extends DocumentEditorContainerModel = DocumentEditorContainerModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjDocumentEditorContainerRef;
}

export class Nx2EjDocumentEditorContainer<STATE extends StateNx2EjDocumentEditorContainer = StateNx2EjDocumentEditorContainer> extends Nx2EjBasic<STATE, DocumentEditorContainer> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjDocumentEditorContainer');
    }

    createEjObj(): void {
        this.obj = new DocumentEditorContainer(this.state.ej);
    }



}