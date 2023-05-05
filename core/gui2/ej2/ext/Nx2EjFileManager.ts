import {DetailsView, FileManager, FileManagerModel, NavigationPane, Toolbar} from "@syncfusion/ej2-filemanager";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

FileManager.Inject(DetailsView, NavigationPane, Toolbar)

export interface StateNx2EjFileManagerRef extends StateNx2EjBasicRef {
    widget?: Nx2EjFileManager;
}

export interface StateNx2EjFileManager<WIDGET_LIBRARY_MODEL extends FileManagerModel = FileManagerModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjFileManagerRef;
}

export class Nx2EjFileManager<STATE extends StateNx2EjFileManager = StateNx2EjFileManager> extends Nx2EjBasic<STATE, FileManager> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjFileManager');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new FileManager(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}