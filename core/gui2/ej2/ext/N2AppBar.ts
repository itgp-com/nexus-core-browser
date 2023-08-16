import {AppBar, AppBarModel} from "@syncfusion/ej2-navigations";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2AppBarRef extends StateNx2EjBasicRef {
    widget?: N2AppBar;
}

export interface StateN2AppBar<WIDGET_LIBRARY_MODEL extends AppBarModel = AppBarModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2AppBarRef;
}

export class N2AppBar<STATE extends StateN2AppBar = StateN2AppBar> extends Nx2EjBasic<STATE, AppBar> {
    static readonly CLASS_IDENTIFIER:string = "N2AppBar"
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2AppBar.CLASS_IDENTIFIER);
    }

    protected onStateInitialized(state: STATE) {
        state.deco.tag = 'header'; // AppBar requires a header tag
        super.onStateInitialized(state);
    }


    createEjObj(): void {
        this.obj = new AppBar(this.state.ej);
    }


    get classIdentifier() {
        return N2AppBar.CLASS_IDENTIFIER;
    }

}