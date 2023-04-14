import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {Grid, GridModel} from "@syncfusion/ej2-grids";


export interface StateNx2EjGridRef extends StateNx2EjBasicRef {
  widget ?: Nx2EjGrid;
}

export interface StateNx2EjGrid<WIDGET_LIBRARY_MODEL extends GridModel = GridModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateNx2EjGridRef;
}

export class Nx2EjGrid<STATE extends StateNx2EjGrid = StateNx2EjGrid> extends Nx2EjBasic<STATE,Grid> {
    constructor(state ?: STATE) {
        super(state);
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Grid(this.state.ej);
        this.obj.appendTo(this.htmlElement); // this will initialize the htmlElement if needed
        this.htmlElement.classList.add( 'Nx2EjGrid');
    }
}