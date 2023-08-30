import {MultiSelect, MultiSelectModel} from '@syncfusion/ej2-dropdowns';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2MultiSelectRef extends StateN2EjBasicRef {
    widget?: N2MultiSelect;
}

export interface StateN2MultiSelect<WIDGET_LIBRARY_MODEL extends MultiSelectModel = MultiSelectModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2MultiSelectRef;
}

export class N2MultiSelect<STATE extends StateN2MultiSelect = StateN2MultiSelect> extends N2EjBasic<STATE, MultiSelect> {
    static readonly CLASS_IDENTIFIER: string = 'N2MultiSelect';

    constructor(state ?: STATE) {
        super(state);
    }


    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2MultiSelect.CLASS_IDENTIFIER);
        state.deco.tag = 'input';
        state.deco.otherAttr.type = 'text';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new MultiSelect(this.state.ej);
    }

    get classIdentifier(): string { return N2MultiSelect.CLASS_IDENTIFIER; }

}