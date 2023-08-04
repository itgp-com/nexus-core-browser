import {MultiSelect, MultiSelectModel} from "@syncfusion/ej2-dropdowns";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjMultiSelectRef extends StateNx2EjBasicRef {
  widget ?: Nx2EjMultiSelect;
}

export interface StateNx2EjMultiSelect<WIDGET_LIBRARY_MODEL extends MultiSelectModel = MultiSelectModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateNx2EjMultiSelectRef;
}

export class Nx2EjMultiSelect<STATE extends StateNx2EjMultiSelect = StateNx2EjMultiSelect> extends Nx2EjBasic<STATE,MultiSelect> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjMultiSelect');
    }


    protected onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        state.deco.otherAttr.type = 'text';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new MultiSelect(this.state.ej);
    }



}