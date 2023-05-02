import {ChipList, ChipListModel} from "@syncfusion/ej2-buttons";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjChipListRef extends StateNx2EjBasicRef {
    widget?: Nx2EjChipList;
}

export interface StateNx2EjChipList<WIDGET_LIBRARY_MODEL extends ChipListModel = ChipListModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjChipListRef;
}

export class Nx2EjChipList<STATE extends StateNx2EjChipList = StateNx2EjChipList> extends Nx2EjBasic<STATE, ChipList> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjChipList');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new ChipList(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}