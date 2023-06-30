import {Kanban, KanbanModel} from "@syncfusion/ej2-kanban";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

export interface StateNx2EjKanbanRef extends StateNx2EjBasicRef {
    widget?: Nx2EjKanban;
}

export interface StateNx2EjKanban<WIDGET_LIBRARY_MODEL extends KanbanModel = KanbanModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjKanbanRef;
}

export class Nx2EjKanban<STATE extends StateNx2EjKanban = StateNx2EjKanban> extends Nx2EjBasic<STATE, Kanban> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjKanban');
    }

    protected createEjObj(): void {
        this.obj = new Kanban(this.state.ej);
    }

    protected appendEjToHtmlElement(): void {
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }

}