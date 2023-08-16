import {Uploader, UploaderModel} from "@syncfusion/ej2-inputs";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2UploaderRef extends StateNx2EjBasicRef {
    widget?: N2Uploader;
}

export interface StateN2Uploader<WIDGET_LIBRARY_MODEL extends UploaderModel = UploaderModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2UploaderRef;
}

export class N2Uploader<STATE extends StateN2Uploader = StateN2Uploader> extends Nx2EjBasic<STATE, Uploader> {
    static readonly CLASS_IDENTIFIER: string = "N2Uploader";

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2Uploader.CLASS_IDENTIFIER);
    }


    protected onStateInitialized(state: STATE) {
        // Tag looks like this: <input type="file" id='xyz_123' />
        state.deco.tag = 'input';
        state.deco.otherAttr.type = 'file';
        if (state.wrapper == null) {
            state.wrapper = {}; // must have a wrapper or else EJ2 will not work
        }
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new Uploader(this.state.ej);
    }

    get classIdentifier(): string { return N2Uploader.CLASS_IDENTIFIER; }

}