nexusMain.UIStartedListeners.add((ev: any) => {
    link_widget_dataSource_NexusDataManager(Fields.prototype);
}); // normal priority

export interface StateN2DropDownTreeRef extends StateN2EjBasicRef {
    widget?: N2DropDownTree;
}

export interface StateN2DropDownTree<WIDGET_LIBRARY_MODEL extends DropDownTreeModel = DropDownTreeModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2DropDownTreeRef;
}

export class N2DropDownTree<STATE extends StateN2DropDownTree = StateN2DropDownTree> extends N2EjBasic<STATE, DropDownTree> {
    static readonly CLASS_IDENTIFIER: string = 'N2DropDownTree'

    constructor(state ?: STATE) {
        super(state);
    }


    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2DropDownTree.CLASS_IDENTIFIER);
        if (state.deco.tag == null)
            state.deco.tag = 'input';
        if (state.deco.otherAttr.type == null)
            state.deco.otherAttr.type = 'text';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new DropDownTree(this.state.ej);
    }

    get classIdentifier() { return N2DropDownTree.CLASS_IDENTIFIER; }

} // N2DropDownTree

import {DropDownTree, DropDownTreeModel, Fields} from '@syncfusion/ej2-dropdowns';
import {nexusMain} from '../../../NexusMain';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';
import {link_widget_dataSource_NexusDataManager} from './util/N2Wrapper_dataSource';