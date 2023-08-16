import {Kanban, KanbanModel} from "@syncfusion/ej2-kanban";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

export interface StateN2KanbanRef extends StateNx2EjBasicRef {
    widget?: N2Kanban;
}

export interface StateN2Kanban<WIDGET_LIBRARY_MODEL extends KanbanModel = KanbanModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2KanbanRef;
}

export class N2Kanban<STATE extends StateN2Kanban = StateN2Kanban> extends Nx2EjBasic<STATE, Kanban> {
    static readonly CLASS_IDENTIFIER: string = 'N2Kanban';

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2Kanban.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new Kanban(this.state.ej);
    }

    get classIdentifier(): string { return N2Kanban.CLASS_IDENTIFIER; }

}