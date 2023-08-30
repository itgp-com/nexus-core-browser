import {ImageEditor, ImageEditorModel} from '@syncfusion/ej2-image-editor';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2ImageEditorRef extends StateN2EjBasicRef {
    widget?: N2ImageEditor;
}

export interface StateN2ImageEditor<WIDGET_LIBRARY_MODEL extends ImageEditorModel = ImageEditorModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ImageEditorRef;
}

export class N2ImageEditor<STATE extends StateN2ImageEditor = StateN2ImageEditor> extends N2EjBasic<STATE, ImageEditor> {
    static readonly CLASS_IDENTIFIER: string = 'N2ImageEditor'

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2ImageEditor.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }


    createEjObj(): void {
        this.obj = new ImageEditor(this.state.ej);
    }

    get classIdentifier() { return N2ImageEditor.CLASS_IDENTIFIER; }

}