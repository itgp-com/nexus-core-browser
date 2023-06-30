import {Pager, PagerModel} from "@syncfusion/ej2-grids";
import {ExternalMessage} from '@syncfusion/ej2-grids/src/pager/external-message';
import {NumericContainer} from '@syncfusion/ej2-grids/src/pager/numeric-container';
import {PagerDropDown} from '@syncfusion/ej2-grids/src/pager/pager-dropdown';
import {PagerMessage} from '@syncfusion/ej2-grids/src/pager/pager-message';
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

Pager.Inject(
    ExternalMessage,
    NumericContainer,
    PagerDropDown,
    PagerMessage,
);
export interface StateNx2EjPagerRef extends StateNx2EjBasicRef {
    widget?: Nx2EjPager;
}

export interface StateNx2EjPager<WIDGET_LIBRARY_MODEL extends PagerModel = PagerModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjPagerRef;
}

export class Nx2EjPager<STATE extends StateNx2EjPager = StateNx2EjPager> extends Nx2EjBasic<STATE, Pager> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjPager');
    }

    protected createEjObj(): void {
        this.obj = new Pager(this.state.ej);
    }

    protected appendEjToHtmlElement(): void {
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }

}