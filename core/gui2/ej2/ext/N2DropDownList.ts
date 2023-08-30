import {DropDownList, DropDownListModel} from '@syncfusion/ej2-dropdowns';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2DropDownListRef extends StateN2EjBasicRef {
    widget?: N2DropDownList;
}

export interface StateN2DropDownList<WIDGET_LIBRARY_MODEL extends DropDownListModel = DropDownListModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2DropDownListRef;
}

export class N2DropDownList<STATE extends StateN2DropDownList = StateN2DropDownList> extends N2EjBasic<STATE, DropDownList> {
    static readonly CLASS_IDENTIFIER: string = 'N2DropDownList'

    constructor(state ?: STATE) {
        super(state);
    }


    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2DropDownList.CLASS_IDENTIFIER);
        if (state.deco.tag == null)
            state.deco.tag = 'input';
        if (state.deco.otherAttr.type == null)
            state.deco.otherAttr.type = 'text';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new DropDownList(this.state.ej);
    }

    get classIdentifier() { return N2DropDownList.CLASS_IDENTIFIER; }

}