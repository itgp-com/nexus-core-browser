nexusMain.UIStartedListeners.add((ev:any)=>{
    link_widget_dataSource_NexusDataManager(ListView.prototype);
}); // normal priority

export interface StateN2ListViewRef extends StateN2EjBasicRef {
    widget?: N2ListView;
}

export interface StateN2ListView<WIDGET_LIBRARY_MODEL extends ListViewModel = ListViewModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ListViewRef;
}

export class N2ListView<STATE extends StateN2ListView = StateN2ListView> extends N2EjBasic<STATE, ListView> {
    static readonly CLASS_IDENTIFIER: string = 'N2ListView';

    constructor(state: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2ListView.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }


    createEjObj(): void {
        this.obj = new ListView(this.state.ej);
    }

    get classIdentifier(): string { return N2ListView.CLASS_IDENTIFIER; }


}


import {ListView, ListViewModel} from '@syncfusion/ej2-lists';
import {Virtualization} from '@syncfusion/ej2-lists/src/list-view/virtualization';
import {nexusMain} from '../../../NexusMain';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';
import {link_widget_dataSource_NexusDataManager} from './util/N2Wrapper_dataSource';

ListView.Inject(Virtualization)