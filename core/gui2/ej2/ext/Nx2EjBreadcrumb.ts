import {Breadcrumb, BreadcrumbModel} from "@syncfusion/ej2-navigations";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjBreadcrumbRef extends StateNx2EjBasicRef {
    widget?: Nx2EjBreadcrumb;
}

export interface StateNx2EjBreadcrumb<WIDGET_LIBRARY_MODEL extends BreadcrumbModel = BreadcrumbModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjBreadcrumbRef;
}

export class Nx2EjBreadcrumb<STATE extends StateNx2EjBreadcrumb = StateNx2EjBreadcrumb> extends Nx2EjBasic<STATE, Breadcrumb> {
    constructor(state: STATE) {
        super(state);
    }

    protected _initialState(state: STATE) {
        state.deco.tag = 'ul'; // Breadcrumb requires a ul tag
        super._initialState(state);
    }

    onLogic(args: Nx2Evt_OnLogic) {

        super.onLogic(args);

        this.obj = new Breadcrumb(this.state.ej);
        this.obj.appendTo(this.htmlElement); // this will initialize the htmlElement if needed
        this.htmlElement.classList.add('Nx2EjBreadcrumb');
    }
}