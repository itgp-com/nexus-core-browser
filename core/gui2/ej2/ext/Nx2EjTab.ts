import {Tab, TabModel} from "@syncfusion/ej2-navigations";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjTabRef extends StateNx2EjBasicRef {
    widget?: Nx2EjTab;
}

export interface StateNx2EjTab<WIDGET_LIBRARY_MODEL extends TabModel = TabModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjTabRef;
}

/**
 *  Please see all the add-on TabOption_XXXXXXX constants that have predefined settings for the Tab state in state.ej
 */
export class Nx2EjTab<STATE extends StateNx2EjTab = StateNx2EjTab> extends Nx2EjBasic<STATE, Tab> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjTab');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Tab(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed

        let fAddTo = this.obj.addTab; // addTab(items: TabItemModel[], index?: number): void;

        this.obj.addTab = (items: any, index?: number) => {
            fAddTo.apply(this.obj, [items, index]);
            this.htmlElement.querySelectorAll('.e-tab-text').forEach(el => el.classList.add('app-tab-no-text-transform'));
        }


        // Remove forced uppercasing from Tab
        this.htmlElement.querySelectorAll('.e-tab-text').forEach(el => el.classList.add('app-tab-no-text-transform'));
    }
}

/**
 * Sets the 'heightAdjustMode' to 'Fill' in order to make the tab content fill the parent empty space
 *
 * Use this if you want a N2PanelLayout to automatically resize the tab content to fill the available space. If you don't, the parent will resize every time the child does
 * @type TabModel Prefilled TabModel Settings to be concatenated to the state.ej
 */
export const TabOption_FillContent: TabModel = {
    heightAdjustMode: 'Fill', // this is the setting that makes the tab content fill the tab and allows grid resizing to make sens (since the surrounding div is not fixed size)
}