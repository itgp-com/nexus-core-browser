nexusMain.UIStartedListeners.add((ev: any) => {
    link_widget_dataSource_NexusDataManager(Kanban.prototype);
}); // normal priority

export interface StateN2KanbanRef extends StateN2EjBasicRef {
    widget?: N2Kanban;
}

export interface StateN2Kanban<WIDGET_LIBRARY_MODEL extends KanbanModel = KanbanModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2KanbanRef;
}

export class N2Kanban<STATE extends StateN2Kanban = StateN2Kanban> extends N2EjBasic<STATE, Kanban> {
    static readonly CLASS_IDENTIFIER: string = 'N2Kanban';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2Kanban.CLASS_IDENTIFIER);
        super.onStateInitialized(state);
    }


    createEjObj(): void {
        this.obj = new Kanban(this.state.ej);
    }

    get classIdentifier(): string { return N2Kanban.CLASS_IDENTIFIER; }

} // N2Kanban

import {Kanban, KanbanModel} from '@syncfusion/ej2-kanban';
import {nexusMain} from '../../../NexusMain';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';
import {link_widget_dataSource_NexusDataManager} from './util/N2Wrapper_dataSource';