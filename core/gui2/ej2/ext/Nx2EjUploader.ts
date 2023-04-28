import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {Uploader, UploaderModel} from "@syncfusion/ej2-inputs";


export interface StateNx2EjUploaderRef extends StateNx2EjBasicRef {
  widget ?: Nx2EjUploader;
}

export interface StateNx2EjUploader<WIDGET_LIBRARY_MODEL extends UploaderModel = UploaderModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateNx2EjUploaderRef;
}

export class Nx2EjUploader<STATE extends StateNx2EjUploader = StateNx2EjUploader> extends Nx2EjBasic<STATE,Uploader> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjUploader');
    }


    protected onStateInitialized(state: STATE) {
        // Tag looks like this: <input type="file" id='xyz_123' />
        state.deco.tag = 'input';
        state.deco.otherAttr.type = 'file';
        if ( state.wrapper == null ) {
            state.wrapper = {}; // must have a wrapper or else EJ2 will not work
        }
        super.onStateInitialized(state);
    }

    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Uploader(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}