import {Pager, PagerModel} from "@syncfusion/ej2-grids";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjPagerRef extends StateNx2EjBasicRef {
    widget?: Nx2EjPager;
}

export interface StateNx2EjPager<WIDGET_LIBRARY_MODEL extends PagerModel = PagerModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjPagerRef;
}

export class Nx2EjPager<STATE extends StateNx2EjPager = StateNx2EjPager> extends Nx2EjBasic<STATE, Pager> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjPager');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Pager(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}