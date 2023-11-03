import {Tab, TabModel} from '@syncfusion/ej2-navigations';
import {SelectEventArgs} from '@syncfusion/ej2-navigations/src/tab/tab';
import {cssAddSelector} from '../../../CoreUtils';
import {N2, N2Evt_OnLogic} from '../../N2';
import {addClassesToElement, addN2Class, removeClassesFromElement} from '../../N2HtmlDecorator';
import {getN2FromHtmlElement} from '../../N2Utils';
import {ThemeChangeEvent, themeChangeListeners} from '../../Theming';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface N2Tab_PostCreated_Event {
    n2: N2Tab;
    args: Event;
}

export interface N2Tab_PreSelected_Event {
    n2: N2Tab;
    ev: SelectEventArgs;
}

export interface StateN2TabRef extends StateN2EjBasicRef {
    widget?: N2Tab;
}

export interface StateN2Tab<WIDGET_LIBRARY_MODEL extends TabModel = TabModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2TabRef;

    /**
     * Called before the N2Tab is selected code is run.
     * The regular state.ej.selected is called AFTER the N2Tab internal 'selected' code is run, so this gives the
     * developer a chance to execute code before also.
     * @param {N2Tab_PreSelected_Event} ev
     */
    preSelected?: (ev: N2Tab_PreSelected_Event) => void;

    /**
     * Called after the N2Tab is created code is run.
     * The regular state.ej.created is called BEFORE the N2Tab internal 'created' code is run, so this gives the
     * developer a chance to execute code after also.
     * @param {N2Tab_PostCreated_Event} ev
     */
    postCreated?: (ev: N2Tab_PostCreated_Event) => void;
}

/**
 *  Please see all the add-on TabOption_XXXXXXX constants that have predefined settings for the Tab state in state.ej
 */
export class N2Tab<STATE extends StateN2Tab = StateN2Tab> extends N2EjBasic<STATE, Tab> {
    static readonly CLASS_IDENTIFIER: string = 'N2Tab';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2Tab.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }



    onLogic(args: N2Evt_OnLogic) {

        //---------
        let fPostCreated = this?.state?.postCreated;
        let fCreated = this?.state?.ej?.created;
        this.state.ej.created = (args) => {
            if (fCreated)
                fCreated.call(this, args);

            let index: number = this.state.ej.selectedItem || 0;
            // give the tab container a chance to be added to the DOM
            setTimeout(() => {
                try {
                    tabSelected(index, this);
                } catch (e) {
                    console.error(e, 'index=', index, `${N2Tab.CLASS_IDENTIFIER}=`, this)
                }
            }); // setTimeout

            if (fPostCreated) {
                try {
                    fPostCreated.call(this, {n2: this, args});
                } catch (e) {
                    console.error(e, ' fPostCreated ', 'index=', index, `${N2Tab.CLASS_IDENTIFIER}=`, this)
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
                    fPreSelected.call(this, {n2: this, ev});
                } catch (e) {
                    console.error(e, ' preSelected ', 'index=', index, `${N2Tab.CLASS_IDENTIFIER}=`, this)
                }
            } // if fPreSelected


            //------------------- deselect listeners -----------------
            try {
                if (this._deselectListeners.length > 0) {
                    this._deselectListeners.forEach(listener => {
                        try {
                            listener.tabDeselected({
                                n2: this,
                                ev: ev,
                                previousIndex: ev.previousIndex,
                                previousHTMLElem: ev.previousItem
                            });
                        } catch (e) {
                            console.error(e, 'index=', index, `${N2Tab.CLASS_IDENTIFIER}=`, this, 'deSelectListener=', listener);
                        }
                    });

                }
            } catch (e) {
                console.error(e, 'index=', index, `${N2Tab.CLASS_IDENTIFIER}=`, this)
            }


            try {
                tabSelected(index, this);
            } catch (e) {
                console.error(e, 'index=', index, `${N2Tab.CLASS_IDENTIFIER}=`, this)
            } // try

            if (fSelected)
                fSelected.call(this, ev);
        }  // selected


        super.onLogic(args); // will call createEjObj and appendEjToHtmlElement

        let fAddTo = this.obj.addTab; // addTab(items: TabItemModel[], index?: number): void;
        this.obj.addTab = (items: any, index?: number) => {
            fAddTo.call(this.obj, items, index);
            this.htmlElement.querySelectorAll('.e-tab-text').forEach(el => el.classList.add('app-tab-no-text-transform'));
        }

        // Remove forced uppercasing from Tab
        this.htmlElement.querySelectorAll('.e-tab-text').forEach(el => el.classList.add('app-tab-no-text-transform'));


    } // onLogic

    createEjObj(): void {
        this.obj = new Tab(this.state.ej);
    }

    get classIdentifier(): string { return N2Tab.CLASS_IDENTIFIER; }


    private _deselectListeners: N2Tab_Deselected_Listener[] = [];

    addDeselectListener(listener: N2Tab_Deselected_Listener) {
        if (listener) {
            if (this._deselectListeners.indexOf(listener) === -1) {
                this._deselectListeners.push(listener);
            } // if not already in the list
        } // if listener
    } // addDeselectListener

    removeDeselectListener(listener: N2Tab_Deselected_Listener) {
        if (listener) {
            let index = this._deselectListeners.indexOf(listener);
            if (index !== -1) {
                this._deselectListeners.splice(index, 1);
            } // if in the list
        } // if listener
    } // removeDeselectListener

} // class N2Tab

export const N2TAB_DESELECTED_EVENT: string = '_n2tab_deselected_';

export interface N2Tab_Deselected_Listener {
    tabDeselected: (ev: N2Tab_Deselected_Event) => void;
}

export interface N2Tab_Deselected_Event {
    n2: N2Tab;
    ev: SelectEventArgs;
    previousIndex: number;
    previousHTMLElem: HTMLElement;
}

export function addN2Tab_Deselected_Listener(elem: HTMLElement, listener: N2Tab_Deselected_Listener) {
    if (!elem) return;
    if (!listener) return;

    addClassesToElement(elem, N2TAB_DESELECTED_EVENT);
    elem[N2TAB_DESELECTED_EVENT] = listener; // tag the element with the listener
} // addN2Tab_Deselected_Listener

export function removeN2Tab_Deselected_Listener(elem: HTMLElement) {
    if (!elem) return;
    removeClassesFromElement(elem, N2TAB_DESELECTED_EVENT);
    elem[N2TAB_DESELECTED_EVENT] = undefined;
} // removeN2Tab_Deselected_Listener


/**
 * Function called when a tab is selected. It initializes the N2 component within the tab.
 * @function tabSelected
 * @param {number} index - The index of the selected tab.
 * @param {N2Tab} n2Tab - The N2Tab instance.
 */
function tabSelected(index: number, n2Tab: N2Tab) {
    try {
        let tab = n2Tab.obj;
        let tabContent = tab.items[index].content as HTMLElement

        let n2: N2 = getN2FromHtmlElement(tabContent) // get the N2 component in the tab
        if (n2) {
            // The contextmenu needs to be initialized only after the target is already in the DOM
            // calling initLogic() will initialize the contextmenu but only once. Subsequent calls will be ignored.
            n2.initLogic()
        }
    } catch (e) {
        console.error(e, 'index=', index, `${N2Tab.CLASS_IDENTIFIER}=`, n2Tab)
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



themeChangeListeners().add((ev: ThemeChangeEvent) => {

    cssAddSelector(`app-tab-no-text-transform`,`
    text-transform: unset !important;`);
}); // normal priority