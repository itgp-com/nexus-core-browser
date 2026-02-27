import {
    ContextMenu,
    DetailsView,
    FileManager,
    FileManagerModel,
    NavigationPane,
    Toolbar
} from '@syncfusion/ej2-filemanager';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';

FileManager.Inject(Toolbar, NavigationPane, DetailsView, ContextMenu,)

export interface StateN2FileManagerRef extends StateN2EjBasicRef {
    widget?: N2FileManager;
}

export interface StateN2FileManager<WIDGET_LIBRARY_MODEL extends FileManagerModel = FileManagerModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2FileManagerRef;
}

export class N2FileManager<STATE extends StateN2FileManager = StateN2FileManager> extends N2EjBasic<STATE, FileManager> {
    static readonly CLASS_IDENTIFIER: string = 'N2FileManager'

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2FileManager.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }


    createEjObj(): void {
        this.obj = new FileManager(this.state.ej);
    }

    get classIdentifier() {
        return N2FileManager.CLASS_IDENTIFIER;
    }

}