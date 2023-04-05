import {AppBar, AppBarModel} from "@syncfusion/ej2-navigations";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjAppBarRef extends StateNx2EjBasicRef {
    widget?: Nx2EjAppBar;
}

export interface StateNx2EjAppBar<WIDGET_LIBRARY_MODEL extends AppBarModel = AppBarModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjAppBarRef;
}

export class Nx2EjAppBar<STATE extends StateNx2EjAppBar = StateNx2EjAppBar> extends Nx2EjBasic<STATE, AppBar> {
    constructor(state: STATE) {
        super(state);
    }

    protected _initialState(state: STATE) {
        state.deco.tag = 'header'; // AppBar requires a header tag
        super._initialState(state);
    }

    onLogic(args: Nx2Evt_OnLogic) {

        super.onLogic(args);

        this.obj = new AppBar(this.state.ej);
        this.obj.appendTo(this.htmlElement); // this will initialize the htmlElement if needed
        this.htmlElement.classList.add('Nx2EjAppBar');
    }
}