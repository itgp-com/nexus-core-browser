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
import {cssAddSelector} from '../../../CoreUtils';
import {StateN2PropertyName} from '../../generic/StateN2PropertyName';
import {addN2Class} from '../../N2HtmlDecorator';
import {VARS_EJ2_COMMON} from '../../scss/vars-ej2-common';
import {ThemeChangeEvent, themeChangeListeners} from '../../Theming';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';
import {N2Grid} from './N2Grid';

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

export interface StateN2RichTextEditorRef extends StateN2EjBasicRef {
    widget?: N2RichTextEditor;
}

export interface StateN2RichTextEditor extends StateN2EjBasic<RichTextEditorModel>, StateN2PropertyName {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2RichTextEditorRef;
} // state class

export class N2RichTextEditor<STATE extends StateN2RichTextEditor = StateN2RichTextEditor> extends N2EjBasic<STATE, RichTextEditor> {
    static readonly CLASS_IDENTIFIER: string = 'N2RichTextEditor';

    constructor(state ?: STATE) {
        super(state);
    }

    onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2RichTextEditor.CLASS_IDENTIFIER);
        if (state.name)
            state.deco.otherAttr['name'] = state.name; // if there's a name defined, use it for any parent form
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new RichTextEditor(this.state.ej);
    }

    get classIdentifier(): string { return N2RichTextEditor.CLASS_IDENTIFIER; }

} // main class



themeChangeListeners().add((ev: ThemeChangeEvent) => {
    let widgetClass = N2RichTextEditor.CLASS_IDENTIFIER

    // $grey-300 for light and grey-700 for dark
    cssAddSelector(`.${widgetClass} .e-tbar-btn, .${widgetClass} .e-tbtn-txt`,`
  background-color: ${VARS_EJ2_COMMON.chip_bg_color} !important;
    `);
}); // normal priority