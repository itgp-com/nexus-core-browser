import {Breadcrumb, BreadcrumbModel} from '@syncfusion/ej2-navigations';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2BreadcrumbRef extends StateN2EjBasicRef {
    widget?: N2Breadcrumb;
}

export interface StateN2Breadcrumb<WIDGET_LIBRARY_MODEL extends BreadcrumbModel = BreadcrumbModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2BreadcrumbRef;
}

export class N2Breadcrumb<STATE extends StateN2Breadcrumb = StateN2Breadcrumb> extends N2EjBasic<STATE, Breadcrumb> {
    static readonly CLASS_IDENTIFIER: string = 'N2Breadcrumb'

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2Breadcrumb.CLASS_IDENTIFIER);
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