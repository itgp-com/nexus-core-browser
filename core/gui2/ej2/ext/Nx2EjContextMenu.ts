import {ContextMenu, ContextMenuModel} from "@syncfusion/ej2-navigations";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjContextMenuRef extends StateNx2EjBasicRef {
    widget?: Nx2EjContextMenu;
}

export interface StateNx2EjContextMenu extends StateNx2EjBasic<ContextMenuModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjContextMenuRef;
} // state class

export class Nx2EjContextMenu<STATE extends StateNx2EjContextMenu = StateNx2EjContextMenu> extends Nx2EjBasic<STATE, ContextMenu> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjContextMenu');
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'ul'; // <ul id="contextmenu"></ul> and references different div for 'target'
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new ContextMenu(this.state.ej);
    }



} // main class