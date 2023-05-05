import {PivotView, PivotViewModel} from "@syncfusion/ej2-pivotview";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjPivotViewRef extends StateNx2EjBasicRef {
    widget?: Nx2EjPivotView;
}

export interface StateNx2EjPivotView extends StateNx2EjBasic<PivotViewModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjPivotViewRef;
} // state class

export class Nx2EjPivotView<STATE extends StateNx2EjPivotView = StateNx2EjPivotView> extends Nx2EjBasic<STATE, PivotView> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjPivotView');
    }

    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new PivotView(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor);

    }
} // main class