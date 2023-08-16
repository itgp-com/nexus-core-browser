import {DetailsView, FileManager, FileManagerModel, NavigationPane, Toolbar} from "@syncfusion/ej2-filemanager";
import {BreadCrumbBar} from '@syncfusion/ej2-filemanager/src/file-manager/actions/breadcrumb-bar';
import {Virtualization} from '@syncfusion/ej2-filemanager/src/file-manager/actions/virtualization';
import {LargeIconsView} from '@syncfusion/ej2-filemanager/src/file-manager/layout/large-icons-view';
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

FileManager.Inject(DetailsView, BreadCrumbBar, LargeIconsView, NavigationPane, Toolbar, Virtualization)

export interface StateN2FileManagerRef extends StateNx2EjBasicRef {
    widget?: N2FileManager;
}

export interface StateN2FileManager<WIDGET_LIBRARY_MODEL extends FileManagerModel = FileManagerModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2FileManagerRef;
}

export class N2FileManager<STATE extends StateN2FileManager = StateN2FileManager> extends Nx2EjBasic<STATE, FileManager> {
    static readonly CLASS_IDENTIFIER: string = "N2FileManager"

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2FileManager.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new FileManager(this.state.ej);
    }

    get classIdentifier() { return N2FileManager.CLASS_IDENTIFIER; }

}