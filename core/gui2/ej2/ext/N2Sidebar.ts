import {Sidebar, SidebarModel} from "@syncfusion/ej2-navigations";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2SidebarRef extends StateNx2EjBasicRef {
    widget?: N2Sidebar;
}

export interface StateN2Sidebar<WIDGET_LIBRARY_MODEL extends SidebarModel = SidebarModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2SidebarRef;
}

export class N2Sidebar<STATE extends StateN2Sidebar = StateN2Sidebar> extends Nx2EjBasic<STATE, Sidebar> {
    static readonly CLASS_IDENTIFIER: string = "N2Sidebar";

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2Sidebar.CLASS_IDENTIFIER);
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'aside';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new Sidebar(this.state.ej);
    }

    get classIdentifier(): string { return N2Sidebar.CLASS_IDENTIFIER; }

}