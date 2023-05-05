import {Menu, MenuModel} from "@syncfusion/ej2-navigations";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjMenuRef extends StateNx2EjBasicRef {
    widget?: Nx2EjMenu;
}

export interface StateNx2EjMenu extends StateNx2EjBasic<MenuModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjMenuRef;
} // state class

export class Nx2EjMenu<STATE extends StateNx2EjMenu = StateNx2EjMenu> extends Nx2EjBasic<STATE, Menu> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjMenu');
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'ul'; // <ul id="contextmenu"></ul> and references different div for 'target'
        super.onStateInitialized(state);
    }

    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Menu(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor);

    }
} // main class