import {TreeMap, TreeMapModel} from "@syncfusion/ej2-treemap";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjTreeMapRef extends StateNx2EjBasicRef {
    widget?: Nx2EjTreeMap;
}

export interface StateNx2EjTreeMap<WIDGET_LIBRARY_MODEL extends TreeMapModel = TreeMapModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjTreeMapRef;
}

export class Nx2EjTreeMap<STATE extends StateNx2EjTreeMap = StateNx2EjTreeMap> extends Nx2EjBasic<STATE, TreeMap> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjTreeMap');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new TreeMap(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}