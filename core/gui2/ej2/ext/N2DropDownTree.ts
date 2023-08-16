import {DropDownTree, DropDownTreeModel} from "@syncfusion/ej2-dropdowns";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2DropDownTreeRef extends StateNx2EjBasicRef {
    widget?: N2DropDownTree;
}

export interface StateN2DropDownTree<WIDGET_LIBRARY_MODEL extends DropDownTreeModel = DropDownTreeModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2DropDownTreeRef;
}

export class N2DropDownTree<STATE extends StateN2DropDownTree = StateN2DropDownTree> extends Nx2EjBasic<STATE, DropDownTree> {
    static readonly CLASS_IDENTIFIER: string = "N2DropDownTree"

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2DropDownTree.CLASS_IDENTIFIER);
    }


    protected onStateInitialized(state: STATE) {
        if (state.deco.tag == null)
            state.deco.tag = 'input';
        if (state.deco.otherAttr.type == null)
            state.deco.otherAttr.type = 'text';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new DropDownTree(this.state.ej);
    }

    get classIdentifier() { return N2DropDownTree.CLASS_IDENTIFIER; }

}