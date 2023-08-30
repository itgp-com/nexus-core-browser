import {Sidebar, SidebarModel} from '@syncfusion/ej2-navigations';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2SidebarRef extends StateN2EjBasicRef {
    widget?: N2Sidebar;
}

export interface StateN2Sidebar<WIDGET_LIBRARY_MODEL extends SidebarModel = SidebarModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2SidebarRef;
}

export class N2Sidebar<STATE extends StateN2Sidebar = StateN2Sidebar> extends N2EjBasic<STATE, Sidebar> {
    static readonly CLASS_IDENTIFIER: string = 'N2Sidebar';

    constructor(state ?: STATE) {
        super(state);
    }

    onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2Sidebar.CLASS_IDENTIFIER);
        state.deco.tag = 'aside';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new Sidebar(this.state.ej);
    }

    get classIdentifier(): string { return N2Sidebar.CLASS_IDENTIFIER; }

}