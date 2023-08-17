import {ChipList, ChipListModel} from '@syncfusion/ej2-buttons';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2ChipListRef extends StateN2EjBasicRef {
    widget?: N2ChipList;
}

export interface StateN2ChipList<WIDGET_LIBRARY_MODEL extends ChipListModel = ChipListModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ChipListRef;
}

export class N2ChipList<STATE extends StateN2ChipList = StateN2ChipList> extends N2EjBasic<STATE, ChipList> {
    static readonly CLASS_IDENTIFIER: string = 'N2ChipList'

    constructor(state ?: STATE) {
        super(state);
        addN2Class(this.state.deco, N2ChipList.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new ChipList(this.state.ej);
    }

    get classIdentifier() {
        return N2ChipList.CLASS_IDENTIFIER;
    }


}