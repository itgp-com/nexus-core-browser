import {ImageEditor, ImageEditorModel} from "@syncfusion/ej2-image-editor";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjImageEditorRef extends StateNx2EjBasicRef {
    widget?: Nx2EjImageEditor;
}

export interface StateNx2EjImageEditor<WIDGET_LIBRARY_MODEL extends ImageEditorModel = ImageEditorModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjImageEditorRef;
}

export class Nx2EjImageEditor<STATE extends StateNx2EjImageEditor = StateNx2EjImageEditor> extends Nx2EjBasic<STATE, ImageEditor> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjImageEditor');
    }

    protected createEjObj(): void {
        this.obj = new ImageEditor(this.state.ej);
    }

    protected appendEjToHtmlElement(): void {
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }

}