import {DashboardLayout, DashboardLayoutModel} from "@syncfusion/ej2-layouts";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2DashboardLayoutRef extends StateNx2EjBasicRef {
  widget ?: N2DashboardLayout;
}

export interface StateN2DashboardLayout<WIDGET_LIBRARY_MODEL extends DashboardLayoutModel = DashboardLayoutModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateN2DashboardLayoutRef;
}

export class N2DashboardLayout<STATE extends StateN2DashboardLayout = StateN2DashboardLayout> extends Nx2EjBasic<STATE,DashboardLayout> {
    static readonly CLASS_IDENTIFIER:string = "N2DashboardLayout"

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2DashboardLayout.CLASS_IDENTIFIER);
    }


    /**
     * If the dashboard widget does not appear, try adding a wrapper around it. That usually fixes it.
     * @param {STATE} state
     * @protected
     */
    protected onStateInitialized(state: STATE) {
        // if ( state.wrapper == null ) {
        //     state.wrapper = {}; // must have a wrapper or else EJ2 will not work
        // }
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new DashboardLayout(this.state.ej);
    }

    get classIdentifier() { return N2DashboardLayout.CLASS_IDENTIFIER; }


}