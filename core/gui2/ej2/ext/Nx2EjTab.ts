import {Tab, TabModel} from "@syncfusion/ej2-navigations";
import {SelectEventArgs} from '@syncfusion/ej2-navigations/src/tab/tab';
import {Nx2, Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {getNx2FromHtmlElement} from '../../Nx2Utils';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface Nx2Tab_PreCreated_Event {
    nx2 : Nx2EjTab;
    args: Event;
}

export interface Nx2Tab_PreSelected_Event {
    nx2 : Nx2EjTab;
    ev: SelectEventArgs
}

export interface StateNx2EjTabRef extends StateNx2EjBasicRef {
    widget?: Nx2EjTab;
}

export interface StateNx2EjTab<WIDGET_LIBRARY_MODEL extends TabModel = TabModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjTabRef;

    /**
     * Called before the Nx2EjTab is selected code is run.
     * The regular state.ej.selected is called AFTER the Nx2EjTab is selected code is run, so this gives the
     * developer a chance to execute code before also.
     * @param {Nx2Tab_PreSelected_Event} ev
     */
    preSelected ?:(ev:Nx2Tab_PreSelected_Event)=>void;

    /**
     * Called after the Nx2EjTab is created code is run.
     * The regular state.ej.created is called BEFORE the Nx2EjTab is created code is run, so this gives the
     * developer a chance to execute code after also.
     * @param {Nx2Tab_PreCreated_Event} ev
     */
    postCreated ?:(ev:Nx2Tab_PreCreated_Event)=>void;
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

        //---------
        let fPostCreated = this?.state?.postCreated;
        let fCreated = this?.state?.ej?.created;
        this.state.ej.created = (args) => {
            if (fCreated)
                fCreated.apply(this, args);

            let index: number = this.state.ej.selectedItem || 0;
            // give the tab container a chance to be added to the DOM
            setTimeout(() => {
                try {
                    tabSelected(index, this);
                } catch (e) {
                    console.error(e, 'index=', index, 'Nx2EjTab=', this)
                }
            }); // setTimeout

            if (fPostCreated) {
                try {
                    fPostCreated.apply(this, [{nx2: this, args}]);
                } catch (e) {
                    console.error(e, ' fPostCreated ', 'index=', index, 'Nx2EjTab=', this)
                }
            } // if fPostCreated

        }  // created

        //--------------
        let fPreSelected = this?.state?.preSelected;
        let fSelected = this?.state?.ej?.selected;
        this.state.ej.selected = (ev: SelectEventArgs) => {
            // At this point, the tab container is finally added to the DOM
            let index = ev.selectedIndex;

            if (fPreSelected) {
                try {
                    fPreSelected.apply(this, [{nx2: this, ev}]);
                } catch (e) {
                    console.error(e, ' preSelected ', 'index=', index, 'Nx2EjTab=', this)
                }
            } // if fPreSelected

            try {
                tabSelected(index, this);
            } catch (e) {
                console.error(e, 'index=', index, 'Nx2EjTab=', this)
            } // try

            if (fSelected)
                fSelected.apply(this, ev);
        }  // selected


        this.obj = new Tab(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed

        let fAddTo = this.obj.addTab; // addTab(items: TabItemModel[], index?: number): void;
        this.obj.addTab = (items: any, index?: number) => {
            fAddTo.apply(this.obj, [items, index]);
            this.htmlElement.querySelectorAll('.e-tab-text').forEach(el => el.classList.add('app-tab-no-text-transform'));
        }

        // Remove forced uppercasing from Tab
        this.htmlElement.querySelectorAll('.e-tab-text').forEach(el => el.classList.add('app-tab-no-text-transform'));


    } // onLogic
}

/**
 * Function called when a tab is selected. It initializes the Nx2 component within the tab.
 * @function tabSelected
 * @param {number} index - The index of the selected tab.
 * @param {Nx2EjTab} nx2Tab - The Nx2EjTab instance.
 */
function tabSelected(index: number, nx2Tab: Nx2EjTab) {
    try {
        let tab = nx2Tab.obj;
        let tabContent = tab.items[index].content as HTMLElement

        let nx2: Nx2 = getNx2FromHtmlElement(tabContent) // get the Nx2 component in the tab
        if (nx2) {
            // The contextmenu needs to be initialized only after the target is already in the DOM
            // calling initLogic() will initialize the contextmenu but only once. Subsequent calls will be ignored.
            nx2.initLogic()
        }
    } catch (e) {
        console.error(e, 'index=', index, 'Nx2EjTab=', nx2Tab)
    }
} // tabSelected

/**
 * Sets the 'heightAdjustMode' to 'Fill' in order to make the tab content fill the parent empty space
 *
 * Use this if you want a N2PanelLayout to automatically resize the tab content to fill the available space. If you don't, the parent will resize every time the child does
 * @type TabModel Prefilled TabModel Settings to be concatenated to the state.ej
 */
export const TabOption_FillContent: TabModel = {
    heightAdjustMode: 'Fill', // this is the setting that makes the tab content fill the tab and allows grid resizing to make sens (since the surrounding div is not fixed size)
}