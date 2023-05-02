import {DashboardLayout, DashboardLayoutModel} from "@syncfusion/ej2-layouts";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";
import {Nx2Evt_OnLogic} from "../../Nx2";


export interface StateNx2EjDashboardLayoutRef extends StateNx2EjBasicRef {
  widget ?: Nx2EjDashboardLayout;
}

export interface StateNx2EjDashboardLayout<WIDGET_LIBRARY_MODEL extends DashboardLayoutModel = DashboardLayoutModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateNx2EjDashboardLayoutRef;
}

export class Nx2EjDashboardLayout<STATE extends StateNx2EjDashboardLayout = StateNx2EjDashboardLayout> extends Nx2EjBasic<STATE,DashboardLayout> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjDashboardLayout');
    }


    protected onStateInitialized(state: STATE) {
        if ( state.wrapper == null ) {
            state.wrapper = {}; // must have a wrapper or else EJ2 will not work
        }
        super.onStateInitialized(state);
    }

    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new DashboardLayout(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}