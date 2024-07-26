import {ListBox, ListBoxModel} from '@syncfusion/ej2-dropdowns';

import {cssAddSelector} from '../../../CssUtils';
import {addN2Class} from '../../N2HtmlDecorator';
import {ThemeChangeEvent, themeChangeListeners} from '../../Theming';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2ListBoxRef extends StateN2EjBasicRef {
    widget?: N2ListBox;
}

export interface StateN2ListBox extends StateN2EjBasic<ListBoxModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ListBoxRef;
} // state class

export class N2ListBox<STATE extends StateN2ListBox = StateN2ListBox> extends N2EjBasic<STATE, ListBox> {
    static readonly CLASS_IDENTIFIER: string = 'N2ListBox';
    static readonly N2LISTBBOX_WRAPPER: string = `${N2ListBox.CLASS_IDENTIFIER}_Wrapper`;

    constructor(state ?: STATE) {
        super(state);
    }

    onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2ListBox.CLASS_IDENTIFIER);
        state.deco.tag = 'input';
        let thisX = this;
        let f_dataBound = state.ej.dataBound;
        state.ej.dataBound = (ev: any) => {
            let e_listbox_wrapper: HTMLElement = this.htmlElementAnchor.closest('.e-listbox-wrapper') as HTMLElement;// parent
            if (e_listbox_wrapper) {
                e_listbox_wrapper.classList.remove(N2ListBox.N2LISTBBOX_WRAPPER) // make sure it's not there
                e_listbox_wrapper.classList.add(N2ListBox.N2LISTBBOX_WRAPPER)

                let select_all_parent: HTMLElement = e_listbox_wrapper.querySelector('.e-selectall-parent');
                if (select_all_parent) {
                    let e_list_parent: HTMLElement = e_listbox_wrapper.querySelector('.e-list-parent.e-ul');
                    e_list_parent.style.height = 'auto';
                    e_list_parent.style.minHeight = `${row_height}px`;
                }

            }
            try {
                if (f_dataBound) f_dataBound.call(thisX, ev);
            } catch (e) { console.error(e) }

        } // dataBound
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new ListBox(this.state.ej);
    }

    get classIdentifier(): string { return N2ListBox.CLASS_IDENTIFIER; }

} // main class

const row_height: number = 30;

export function cssForN2ListBox(n2ListBoxClass: string, eListBoxClass: string) {
    cssAddSelector(`.e-listbox-wrapper.${N2ListBox.N2LISTBBOX_WRAPPER}`, `
            font-size: var(--app-font-size-regular);`);

    let sel1 = `
    .${N2ListBox.N2LISTBBOX_WRAPPER}.e-listbox-wrapper:not(.e-list-template) .e-list-item,
    .${N2ListBox.N2LISTBBOX_WRAPPER}.e-listbox-wrapper .e-list-nrt,
    .${N2ListBox.N2LISTBBOX_WRAPPER}.e-listbox-wrapper .e-selectall-parent,
    .${N2ListBox.N2LISTBBOX_WRAPPER} .e-listbox-container:not(.e-list-template) .e-list-item,
    .${N2ListBox.N2LISTBBOX_WRAPPER} .e-listbox-container .e-list-nrt,
    .${N2ListBox.N2LISTBBOX_WRAPPER} .e-listbox-container .e-selectall-parent,
    .${N2ListBox.N2LISTBBOX_WRAPPER} .e-listboxtool-wrapper:not(.e-list-template) .e-list-item,
    .${N2ListBox.N2LISTBBOX_WRAPPER} .e-listboxtool-wrapper .e-list-nrt,
    .${N2ListBox.N2LISTBBOX_WRAPPER} .e-listboxtool-wrapper .e-selectall-parent `;
    cssAddSelector(sel1, `
        height: ${row_height}px;
        line-height: 1;
        padding: 10px 10px;
        position: relative;`);

    // let sel2 = `.e-listbox-wrapper:has(.e-list-parent.e-ul)`
    // cssAddSelector(sel2, `
    //     calc(100% - ${row_height}px)`);


} // cssForN2ListBox

themeChangeListeners().add((ev: ThemeChangeEvent) => {
    cssForN2ListBox(N2ListBox.CLASS_IDENTIFIER, 'e-listbox');
}); // normal priority