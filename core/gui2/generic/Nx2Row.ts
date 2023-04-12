import {Nx2Basic, StateNx2Basic, StateNx2BasicRef} from "../Nx2Basic";
import {addNx2Class} from "../Nx2HtmlDecorator";
import {CSS_FLEX_ROW_DIRECTION} from "../../CoreCSS";

export interface StateNx2RowRef extends StateNx2BasicRef{
    widget ?: Nx2Row;
}

export interface StateNx2Row extends StateNx2Basic {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateNx2RowRef;
}

export class Nx2Row<STATE extends StateNx2Row = any> extends Nx2Basic<STATE> {

    constructor(state: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addNx2Class(state.deco, CSS_FLEX_ROW_DIRECTION);
        super.onStateInitialized(state);
    }
}