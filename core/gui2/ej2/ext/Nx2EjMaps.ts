import {Maps, MapsModel} from "@syncfusion/ej2-maps";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjMapsRef extends StateNx2EjBasicRef {
    widget?: Nx2EjMaps;
}

export interface StateNx2EjMaps<WIDGET_LIBRARY_MODEL extends MapsModel = MapsModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjMapsRef;
}

export class Nx2EjMaps<STATE extends StateNx2EjMaps = StateNx2EjMaps> extends Nx2EjBasic<STATE, Maps> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjMaps');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Maps(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}