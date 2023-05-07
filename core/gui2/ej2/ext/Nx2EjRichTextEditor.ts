import {HtmlEditor, Image, Link, RichTextEditor, RichTextEditorModel, Toolbar} from '@syncfusion/ej2-richtexteditor';
import {Count} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/actions/count';
import {EnterKeyAction} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/actions/enter-key';
import {FileManager} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/actions/file-manager';
import {FormatPainter} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/actions/format-painter';
import {FullScreen} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/actions/full-screen';
import {MarkdownEditor} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/actions/markdown-editor';
import {PasteCleanup} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/actions/paste-clean-up';
import {QuickToolbar} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/actions/quick-toolbar';
import {Resize} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/actions/resize';
import {Audio} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/renderer/audio-module';
import {Table} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/renderer/table-module';
import {Video} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/renderer/video-module';
import {ViewSource} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/renderer/view-source';
import {ServiceLocator} from '@syncfusion/ej2-richtexteditor/src/rich-text-editor/services/service-locator';
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

RichTextEditor.Inject(
    Audio,
    Count,
    EnterKeyAction,
    FileManager,
    FormatPainter,
    FullScreen,
    HtmlEditor,
    Image,
    Link,
    MarkdownEditor,
    PasteCleanup,
    QuickToolbar,
    Resize,
    ServiceLocator,
    Table,
    Toolbar,
    Video,
    ViewSource,
);

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