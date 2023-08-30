import {Menu, MenuModel} from '@syncfusion/ej2-navigations';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2MenuRef extends StateN2EjBasicRef {
    widget?: N2Menu;
}

export interface StateN2Menu extends StateN2EjBasic<MenuModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2MenuRef;
} // state class

export class N2Menu<STATE extends StateN2Menu = StateN2Menu> extends N2EjBasic<STATE, Menu> {
    static readonly CLASS_IDENTIFIER: string = 'N2Menu';

    constructor(state ?: STATE) {
        super(state);
    }

    onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2Menu.CLASS_IDENTIFIER);
        state.deco.tag = 'ul'; // <ul id='contextmenu'></ul> and references different div for 'target'
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new Menu(this.state.ej);
    }

    get classIdentifier(): string { return N2Menu.CLASS_IDENTIFIER; }

} // main class