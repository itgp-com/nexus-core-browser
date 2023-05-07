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
import {Nx2Evt_OnLogic} from "../../Nx2";
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

export interface StateNx2EjPdfViewerRef extends StateNx2EjBasicRef {
    widget?: Nx2EjPdfViewer;
}

export interface StateNx2EjPdfViewer<WIDGET_LIBRARY_MODEL extends PdfViewerModel = PdfViewerModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjPdfViewerRef;
}

/**
 * This is a wrapper for the Syncfusion PdfViewer widget. It requires a server component to be installed for anything past basic functionality.
 * See https://ej2.syncfusion.com/documentation/pdfviewer/server-deployment/pdfviewer-server-docker-image-overview/
 */
export class Nx2EjPdfViewer<STATE extends StateNx2EjPdfViewer = StateNx2EjPdfViewer> extends Nx2EjBasic<STATE, PdfViewer> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjPdfViewer');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new PdfViewer(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}