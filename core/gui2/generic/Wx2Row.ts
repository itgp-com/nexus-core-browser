import {Ax2Standard, StateAx2Standard} from "../Ax2Standard";
import {addWx2Class} from "../Ix2HtmlDecorator";
import {CSS_FLEX_ROW_DIRECTION} from "../../CoreCSS";

export interface StateWx2Row<WIDGET_TYPE extends Wx2Row = any> extends StateAx2Standard<WIDGET_TYPE> {

}

export class Wx2Row<STATE extends StateWx2Row = any> extends Ax2Standard<STATE> {

    constructor(state: STATE) {
        super(state);
    }

    protected _initialSetup(state: STATE) {
        addWx2Class(state.deco, CSS_FLEX_ROW_DIRECTION);
        super._initialSetup(state);
    }
}