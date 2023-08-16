import {ImageEditor, ImageEditorModel} from "@syncfusion/ej2-image-editor";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2ImageEditorRef extends StateNx2EjBasicRef {
    widget?: N2ImageEditor;
}

export interface StateN2ImageEditor<WIDGET_LIBRARY_MODEL extends ImageEditorModel = ImageEditorModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ImageEditorRef;
}

export class N2ImageEditor<STATE extends StateN2ImageEditor = StateN2ImageEditor> extends Nx2EjBasic<STATE, ImageEditor> {
    static readonly CLASS_IDENTIFIER: string = "N2ImageEditor"

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2ImageEditor.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new ImageEditor(this.state.ej);
    }

    get classIdentifier() { return N2ImageEditor.CLASS_IDENTIFIER; }

}