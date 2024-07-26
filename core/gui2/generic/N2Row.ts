import {cssAddClass} from '../../CssUtils';
import {N2Basic, StateN2Basic, StateN2BasicRef} from "../N2Basic";
import {addN2Class} from "../N2HtmlDecorator";
import {CSS_FLEX_ROW_DIRECTION} from "../scss/core";

export interface StateN2RowRef extends StateN2BasicRef{
    widget ?: N2Row;
}

export interface StateN2Row extends StateN2Basic {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateN2RowRef;
}

export class N2Row<STATE extends StateN2Row = any> extends N2Basic<STATE> {
    static readonly CLASS_IDENTIFIER: string = 'N2Row';

    constructor(state: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, CSS_FLEX_ROW_DIRECTION, N2Row.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }


    get classIdentifier(): string { return N2Row.CLASS_IDENTIFIER; }

}


//----------- N2Row specific CSS classes and selectors ----------------
export const CSS_CLASS_N2Row_scrollable :string = 'N2Row_scrollable';
export const CSS_CLASS_N2Row_scrollable_item:string = 'N2Row_scrollable_item';

/**
 * Apply to a parent component that needs to scroll its children horizontally. Use in conjunction with N2_Row_Scrollable_Item
 */
cssAddClass(CSS_CLASS_N2Row_scrollable, {
    display: 'flex',
    'flex-wrap': 'nowrap',
    'overflow-x': 'auto',
});

/**
 * Apply to a child component of N2_Row_Scrollable
 */
cssAddClass(CSS_CLASS_N2Row_scrollable_item, {
    flex: '0 0 auto',// don't adjust size as parent adjusts, therefore allow scrolling
})