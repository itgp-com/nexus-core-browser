import {Breadcrumb, BreadcrumbModel} from "@syncfusion/ej2-navigations";
import {addNx2Class} from '../../Nx2HtmlDecorator';
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
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjBreadcrumb');
    }

    protected onStateInitialized(state: STATE) {
        state.deco.tag = 'ul'; // Breadcrumb requires a ul tag
        super.onStateInitialized(state);
    }

    protected createEjObj(): void {
        this.obj = new Breadcrumb(this.state.ej);
    }

    protected appendEjToHtmlElement(): void {
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }

}