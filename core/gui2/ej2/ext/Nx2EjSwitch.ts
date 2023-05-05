import {Switch, SwitchModel} from "@syncfusion/ej2-buttons";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjSwitchRef extends StateNx2EjBasicRef {
    widget?: Nx2EjSwitch;
}

export interface StateNx2EjSwitch extends StateNx2EjBasic<SwitchModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjSwitchRef;
} // state class

export class Nx2EjSwitch<STATE extends StateNx2EjSwitch = StateNx2EjSwitch> extends Nx2EjBasic<STATE, Switch> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjSwitch');
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'input';
        state.deco.otherAttr['type'] = 'checkbox';
        if (!state.wrapper) {
            state.wrapper = {}; // must have a wrapper or else EJ2 will not work
        }
        super.onStateInitialized(state);
    }

    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Switch(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor);

    }
} // main class