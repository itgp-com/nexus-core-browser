import {RangeNavigator, RangeNavigatorModel} from "@syncfusion/ej2-charts";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjRangeNavigatorRef extends StateNx2EjBasicRef {
    widget?: Nx2EjRangeNavigator;
}

export interface StateNx2EjRangeNavigator<WIDGET_LIBRARY_MODEL extends RangeNavigatorModel = RangeNavigatorModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjRangeNavigatorRef;
}

export class Nx2EjRangeNavigator<STATE extends StateNx2EjRangeNavigator = StateNx2EjRangeNavigator> extends Nx2EjBasic<STATE, RangeNavigator> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjRangeNavigator');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new RangeNavigator(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}