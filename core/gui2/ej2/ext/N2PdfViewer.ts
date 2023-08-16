import {
    Annotation,
    BookmarkView,
    FormDesigner,
    FormFields,
    LinkAnnotation,
    Magnification,
    Navigation,
    PdfViewer,
    PdfViewerModel,
    Print,
    TextSearch,
    TextSelection,
    ThumbnailView,
    Toolbar
} from '@syncfusion/ej2-pdfviewer';
import {AccessibilityTags} from '@syncfusion/ej2-pdfviewer/src/pdfviewer';
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

PdfViewer.Inject(
    AccessibilityTags,
    Annotation,
    BookmarkView,
    FormDesigner,
    FormFields,
    LinkAnnotation,
    Magnification,
    Navigation,
    Print,
    TextSearch,
    TextSelection,
    ThumbnailView,
    Toolbar
);

export interface StateN2PdfViewerRef extends StateNx2EjBasicRef {
    widget?: N2PdfViewer;
}

export interface StateN2PdfViewer<WIDGET_LIBRARY_MODEL extends PdfViewerModel = PdfViewerModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2PdfViewerRef;
}

/**
 * This is a wrapper for the Syncfusion PdfViewer widget. It requires a server component to be installed for anything past basic functionality.
 * See https://ej2.syncfusion.com/documentation/pdfviewer/server-deployment/pdfviewer-server-docker-image-overview/
 */
export class N2PdfViewer<STATE extends StateN2PdfViewer = StateN2PdfViewer> extends Nx2EjBasic<STATE, PdfViewer> {
    static readonly CLASS_IDENTIFIER: string = "N2PdfViewer";

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2PdfViewer.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new PdfViewer(this.state.ej);
    }

    get classIdentifier(): string { return N2PdfViewer.CLASS_IDENTIFIER; }

}