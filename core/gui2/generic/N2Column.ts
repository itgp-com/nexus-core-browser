import {CSS_FLEX_COL_DIRECTION} from "../../CoreCSS";
import {N2Basic, StateN2Basic, StateN2BasicRef} from "../N2Basic";
import {addN2Class} from "../N2HtmlDecorator";

export interface StateN2ColumnRef extends StateN2BasicRef {
    widget?: N2Column;
}

export interface StateN2Column extends StateN2Basic {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ColumnRef;
}

export class N2Column<STATE extends StateN2Column = any> extends N2Basic<STATE> {
    static readonly CLASS_IDENTIFIER: string = 'N2Column';

    constructor(state: STATE) {
        super(state);

    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, CSS_FLEX_COL_DIRECTION, N2Column.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }


    get classIdentifier(): string { return N2Column.CLASS_IDENTIFIER; }

}