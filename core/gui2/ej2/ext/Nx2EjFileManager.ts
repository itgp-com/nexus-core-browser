import {DetailsView, FileManager, FileManagerModel, NavigationPane, Toolbar} from "@syncfusion/ej2-filemanager";
import {BreadCrumbBar} from '@syncfusion/ej2-filemanager/src/file-manager/actions/breadcrumb-bar';
import {Virtualization} from '@syncfusion/ej2-filemanager/src/file-manager/actions/virtualization';
import {LargeIconsView} from '@syncfusion/ej2-filemanager/src/file-manager/layout/large-icons-view';
import {Accordion} from '@syncfusion/ej2-navigations';
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

FileManager.Inject(DetailsView, BreadCrumbBar, LargeIconsView, NavigationPane, Toolbar, Virtualization)

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

    protected createEjObj(): void {
        this.obj = new FileManager(this.state.ej);
    }

    protected appendEjToHtmlElement(): void {
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }

}