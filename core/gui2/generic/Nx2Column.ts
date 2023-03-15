import {Nx2Basic, StateNx2Basic, StateNx2BasicRef} from "../Nx2Basic";
import {addNx2Class} from "../Nx2HtmlDecorator";
import {CSS_FLEX_COL_DIRECTION} from "../../CoreCSS";

export interface StateNx2ColumnRef extends StateNx2BasicRef{
    widget ?: Nx2Column;
}

export interface StateNx2Column extends StateNx2Basic {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateNx2ColumnRef;
}

export class Nx2Column<STATE extends StateNx2Column = any> extends Nx2Basic<STATE> {

    constructor(state: STATE) {
        super(state);
    }

    protected _initialState(state: STATE) {
        addNx2Class(state.deco, CSS_FLEX_COL_DIRECTION);
        super._initialState(state);
    }
}