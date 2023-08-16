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
export interface StateN2PagerRef extends StateNx2EjBasicRef {
    widget?: N2Pager;
}

export interface StateN2Pager<WIDGET_LIBRARY_MODEL extends PagerModel = PagerModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2PagerRef;
}

export class N2Pager<STATE extends StateN2Pager = StateN2Pager> extends Nx2EjBasic<STATE, Pager> {
    static readonly CLASS_IDENTIFIER: string = "N2Pager";
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2Pager.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new Pager(this.state.ej);
    }

    get classIdentifier(): string { return N2Pager.CLASS_IDENTIFIER; }

}