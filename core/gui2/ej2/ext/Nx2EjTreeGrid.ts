import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {TreeGrid, TreeGridModel} from "@syncfusion/ej2-treegrid";


export interface StateNx2EjTreeGridRef extends StateNx2EjBasicRef {
  widget ?: Nx2EjTreeGrid;
}

export interface StateNx2EjTreeGrid<WIDGET_LIBRARY_MODEL extends TreeGridModel = TreeGridModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateNx2EjTreeGridRef;
}

export class Nx2EjTreeGrid<STATE extends StateNx2EjTreeGrid = StateNx2EjTreeGrid> extends Nx2EjBasic<STATE,TreeGrid> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjTreeGrid');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new TreeGrid(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}