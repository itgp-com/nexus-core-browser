import {Sidebar, SidebarModel} from "@syncfusion/ej2-navigations";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjSidebarRef extends StateNx2EjBasicRef {
    widget?: Nx2EjSidebar;
}

export interface StateNx2EjSidebar<WIDGET_LIBRARY_MODEL extends SidebarModel = SidebarModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjSidebarRef;
}

export class Nx2EjSidebar<STATE extends StateNx2EjSidebar = StateNx2EjSidebar> extends Nx2EjBasic<STATE, Sidebar> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjSidebar');
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'aside';
        super.onStateInitialized(state);
    }

    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Sidebar(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}