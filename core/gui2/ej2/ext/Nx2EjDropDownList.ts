import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {DropDownList, DropDownListModel} from "@syncfusion/ej2-dropdowns";


export interface StateNx2EjDropDownListRef extends StateNx2EjBasicRef {
  widget ?: Nx2EjDropDownList;
}

export interface StateNx2EjDropDownList<WIDGET_LIBRARY_MODEL extends DropDownListModel = DropDownListModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateNx2EjDropDownListRef;
}

export class Nx2EjDropDownList<STATE extends StateNx2EjDropDownList = StateNx2EjDropDownList> extends Nx2EjBasic<STATE,DropDownList> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjDropDownList');
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

        this.obj = new DropDownList(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}