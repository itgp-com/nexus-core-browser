import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {DropDownTree, DropDownTreeModel} from "@syncfusion/ej2-dropdowns";


export interface StateNx2EjDropDownTreeRef extends StateNx2EjBasicRef {
  widget ?: Nx2EjDropDownTree;
}

export interface StateNx2EjDropDownTree<WIDGET_LIBRARY_MODEL extends DropDownTreeModel = DropDownTreeModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateNx2EjDropDownTreeRef;
}

export class Nx2EjDropDownTree<STATE extends StateNx2EjDropDownTree = StateNx2EjDropDownTree> extends Nx2EjBasic<STATE,DropDownTree> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjDropDownTree');
    }


    protected onStateInitialized(state: STATE) {
        if ( state.deco.tag == null)
            state.deco.tag = 'input';
        if ( state.deco.otherAttr.type == null)
            state.deco.otherAttr.type = 'text';
        super.onStateInitialized(state);
    }

    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new DropDownTree(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}