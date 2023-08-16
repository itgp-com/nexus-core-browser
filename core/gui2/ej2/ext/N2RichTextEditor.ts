import {HtmlEditor, Image, Link, RichTextEditor, RichTextEditorModel, Toolbar} from '@syncfusion/ej2-richtexteditor';
import {Count} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/actions/count';
import {FileManager} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/actions/file-manager';
import {FormatPainter} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/actions/format-painter';
import {MarkdownEditor} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/actions/markdown-editor';
import {PasteCleanup} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/actions/paste-clean-up';
import {QuickToolbar} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/actions/quick-toolbar';
import {Resize} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/actions/resize';
import {Audio} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/renderer/audio-module';
import {Table} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/renderer/table-module';
import {Video} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/renderer/video-module';
import {StateNx2PropertyName} from '../../generic/StateNx2PropertyName';
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

RichTextEditor.Inject(
    Audio,
    Count,
    FileManager,
    FormatPainter,
    HtmlEditor,
    Image,
    Link,
    MarkdownEditor,
    PasteCleanup,
    QuickToolbar,
    Resize,
    Table,
    Toolbar,
    Video,
);

export interface StateN2RichTextEditorRef extends StateNx2EjBasicRef {
    widget?: N2RichTextEditor;
}

export interface StateN2RichTextEditor extends StateNx2EjBasic<RichTextEditorModel>, StateNx2PropertyName {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2RichTextEditorRef;
} // state class

export class N2RichTextEditor<STATE extends StateN2RichTextEditor = StateN2RichTextEditor> extends Nx2EjBasic<STATE, RichTextEditor> {
    static readonly CLASS_IDENTIFIER: string = "Nx2EjRichTextEditor";

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2RichTextEditor.CLASS_IDENTIFIER);
    }

    onStateInitialized(state: STATE) {
        if (state.name)
            state.deco.otherAttr['name'] = state.name; // if there's a name defined, use it for any parent form
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new RichTextEditor(this.state.ej);
    }

    get classIdentifier(): string { return N2RichTextEditor.CLASS_IDENTIFIER; }

} // main class