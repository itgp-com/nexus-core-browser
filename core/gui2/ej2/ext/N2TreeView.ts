nexusMain.UIStartedListeners.add((ev:any)=>{
    link_widget_dataSource_NexusDataManager(FieldsSettings.prototype);
}); // normal priority
export interface StateN2TreeViewRef extends StateN2EjBasicRef {
    widget?: N2TreeView;
}

export interface StateN2TreeView<WIDGET_LIBRARY_MODEL extends TreeViewModel = TreeViewModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2TreeViewRef;
}

export class N2TreeView<STATE extends StateN2TreeView = StateN2TreeView> extends N2EjBasic<STATE, TreeView> {
    static readonly CLASS_IDENTIFIER: string = 'N2TreeView';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2TreeView.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }


    createEjObj(): void {
        this.obj = new TreeView(this.state.ej);
    }

    get classIdentifier(): string { return N2TreeView.CLASS_IDENTIFIER; }

} // N2TreeView


import {FieldsSettings, TreeView, TreeViewModel} from '@syncfusion/ej2-navigations';
import {nexusMain} from '../../../NexusMain';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';
import {link_widget_dataSource_NexusDataManager} from './util/N2Wrapper_dataSource';