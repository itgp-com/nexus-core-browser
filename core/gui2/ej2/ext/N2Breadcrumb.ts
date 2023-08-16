import {Breadcrumb, BreadcrumbModel} from "@syncfusion/ej2-navigations";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2BreadcrumbRef extends StateNx2EjBasicRef {
    widget?: N2Breadcrumb;
}

export interface StateN2Breadcrumb<WIDGET_LIBRARY_MODEL extends BreadcrumbModel = BreadcrumbModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2BreadcrumbRef;
}

export class N2Breadcrumb<STATE extends StateN2Breadcrumb = StateN2Breadcrumb> extends Nx2EjBasic<STATE, Breadcrumb> {
    static readonly CLASS_IDENTIFIER: string = "N2Breadcrumb"

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2Breadcrumb.CLASS_IDENTIFIER);
    }

    protected onStateInitialized(state: STATE) {
        state.deco.tag = 'ul'; // Breadcrumb requires a ul tag
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new Breadcrumb(this.state.ej);
    }

    get classIdentifier() {
        return N2Breadcrumb.CLASS_IDENTIFIER;
    }

}