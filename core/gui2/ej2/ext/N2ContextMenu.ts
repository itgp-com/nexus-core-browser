import {ContextMenu, ContextMenuModel} from '@syncfusion/ej2-navigations';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2ContextMenuRef extends StateN2EjBasicRef {
    widget?: N2ContextMenu;
}

export interface StateN2ContextMenu extends StateN2EjBasic<ContextMenuModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ContextMenuRef;
} // state class

export class N2ContextMenu<STATE extends StateN2ContextMenu = StateN2ContextMenu> extends N2EjBasic<STATE, ContextMenu> {
    static readonly CLASS_IDENTIFIER:string = 'N2ContextMenu'
    constructor(state ?: STATE) {
        super(state);
    }

    onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2ContextMenu.CLASS_IDENTIFIER);
        state.deco.tag = 'ul'; // <ul id='contextmenu'></ul> and references different div for 'target'
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new ContextMenu(this.state.ej);
    }

    get classIdentifier() { return N2ContextMenu.CLASS_IDENTIFIER; }

} // main class