export interface StateN2CtxMenu extends StateN2Basic {

    /**
     * The array of menu itens to display. If not specified, the default will be displayed.
     */
    menuItems?: N2CtxMenuSection[];

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2CtxMenuRef;

}

export interface InternalStateN2CtxMenu {
    colorPicker?: N2ColorPicker;
}

export interface StateN2CtxMenuComplete extends StateN2CtxMenu, InternalStateN2CtxMenu {
    //blends regular state with internal properties to make them available to the developer in code completion
}

export class N2CtxMenu<STATE extends StateN2CtxMenuComplete = StateN2CtxMenuComplete>
    extends N2Basic<STATE, N2CtxMenu> {


    constructor(state: STATE) {
        super(state);
        try {
            loadCSS();
        } catch (e) {
            console.error(e);
        }
    }

    onHtml(args: N2Evt_OnHtml): HTMLElement {
        let state = args.widget.state;
        addN2Class(state.deco, CSS_CLASS_N2CTX_MENU, CSS_CLASS_N2_DISPLAY_NONE);
        return super.onHtml(args);
    } // onHtml

    //------------------------------------------


//----------------------------------

    /**
     * Returns all visible context menus in the document.
     */
    public static getVisibleMenus(): HTMLElement[] {
        return Array.from(document.querySelectorAll(`.${CSS_CLASS_N2CTX_MENU}:not(.${CSS_CLASS_N2_DISPLAY_NONE})`)) as HTMLElement[];
    }

    public static isMenuVisible(menuContainer: HTMLElement): boolean {
        return !menuContainer?.classList?.contains(CSS_CLASS_N2_DISPLAY_NONE);
    }

    public isMenuVisible(): boolean {
        return N2CtxMenu.isMenuVisible(this.htmlElement);
    }


    public static toggle(menuContainer: HTMLElement) {
        if (!menuContainer) {
            console.warn('N2CtxMenu.toggle: menuContainer is null or undefined');
            return;
        }
        // toggle between flex and none
        if (N2CtxMenu.isMenuVisible(menuContainer)) {
            menuContainer.classList.add(CSS_CLASS_N2_DISPLAY_NONE);
            menuContainer.classList.remove(CSS_CLASS_N2_DISPLAY_FLEX);
        } else {
            menuContainer.classList.remove(CSS_CLASS_N2_DISPLAY_NONE);
            menuContainer.classList.add(CSS_CLASS_N2_DISPLAY_FLEX);
        } // if else

        if (N2CtxMenu.isMenuVisible(menuContainer)) {
            let n2: N2CtxMenu = getN2FromHtmlElement(menuContainer) as any;
            if (n2 == null)
                n2 = (menuContainer as any)[N2_CLASS] as N2CtxMenu;
            if (n2)
                n2.renderMenu(); // re-render the menu to ensure it is up-to-date
            else
                console.warn('N2CtxMenu.toggle: n2 is null or undefined');
        } // if (N2CtxMenu.isMenuVisible(menuContainer))
    } // toggle

    public toggle() {
        N2CtxMenu.toggle(this.htmlElement);
    } // toggle

    public static show(menuContainer: HTMLElement) {
        if (!N2CtxMenu.isMenuVisible(menuContainer)) {
            N2CtxMenu.toggle(menuContainer); // open the menu
        }
    }

    public show() {
        N2CtxMenu.show(this.htmlElement);
    }

    public static hide(menuContainer: HTMLElement) {
        if (N2CtxMenu.isMenuVisible(menuContainer)) {
            N2CtxMenu.toggle(menuContainer); // close the menu
        }
    }

    public hide() {
        N2CtxMenu.hide(this.htmlElement);
    }

//-----------------------------------
    protected renderMenu() {
        let state = this.state;
        let menuSections: N2CtxMenuSection[] = state.menuItems || [];
        this.htmlElement.innerHTML = '';

        menuSections.forEach(section => {
            if (section === 'separator') {
                this.htmlElement.appendChild(this.createSeparator());
            } else if ('options' in section) {
                this.htmlElement.appendChild(this.createRadioGroupElement(section));
            } else if (section.type === 'color') {
                this.htmlElement.appendChild(this.createColorPicker(section as N2CtxMenu_ColorOption));
            } else {
                this.htmlElement.appendChild(this.createMenuItem(section));
            }
        });
    } // renderMenu


    protected createSeparator() {
        const div = document.createElement('div');
        div.className = CSS_CLASS_N2CTX_MENU_SEPARATOR;
        return div;
    } // createSeparator

    protected handleRadioSelect(groupLabel: string, value: string) {
        let state = this.state;
        const group = state.menuItems.find(
            (section): section is N2CtxMenu_RadioGroup =>
                typeof section !== 'string' && 'options' in section && section.label === groupLabel
        );

        if (group) {
            group.selected = value;
            group.options.forEach(option => {
                option.checked = option.label === value;
            });
        }
    }

    private createRadioGroupElement(group: N2CtxMenu_RadioGroup) {
        const container = document.createElement('div');
        container.className = 'scribe-radio-group';

        const label = document.createElement('div');
        label.className = 'scribe-radio-group-label';
        label.textContent = group.label;
        container.appendChild(label);

        group.options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'scribe-radio-option';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = group.label;
            radio.checked = option.checked;
            radio.onchange = (ev: Event) => {
                option.action({widget: this, ev: ev});
            }

            const label = document.createElement('label');
            label.textContent = option.label;

            optionDiv.appendChild(radio);
            optionDiv.appendChild(label);
            container.appendChild(optionDiv);
        });

        return container;
    }

    protected createRadioGroup(label: string, options: string[], defaultSelected: string): N2CtxMenu_RadioGroup {
        return {
            label,
            selected: defaultSelected,
            options: options.map(option => ({
                label: option,
                type: 'radio',
                checked: option === defaultSelected,
                action: (ev) => this.handleRadioSelect(label, option)
            }))
        };
    } // createRadioGroup


    protected createColorPicker(item: N2CtxMenu_ColorOption): HTMLElement {
        let thisX = this;
        let state = thisX.state;
        const div: HTMLDivElement = htmlToElement(`<div class="${CSS_CLASS_N2CTX_MENU_ITEM}"></div>`) as HTMLDivElement;


        if (item.type === 'color') {
            const preview = document.createElement('div');
            preview.className = 'scribe-color-preview';
            preview.style.backgroundColor = state.colorPicker?.obj?.value;
            div.appendChild(preview);
        }

        if (item.action) {
            div.addEventListener('click', ev => {
                ev.stopPropagation(); // Prevent the global click handler from closing the menu

                item.action({widget: thisX});
            });
        }
        return div;
    } // createColorPicker

    protected createMenuItem(item: N2CtxMenuItem): HTMLElement {
        let thisX = this;
        let state = thisX.state;
        const div: HTMLDivElement = htmlToElement(`<div class="${CSS_CLASS_N2CTX_MENU_ITEM}"></div>`) as HTMLDivElement;

        let widget: N2Html = item.icon;
        if (widget) {
            // update onDOMAdded handler to initialize the widget logic
            let state = widget.state;
            let userOnDomAdded = state.onDOMAdded;
            state.onDOMAdded = (ev: N2Evt_DomAdded) => {
                if (userOnDomAdded && typeof userOnDomAdded === 'function') {
                    try {
                        userOnDomAdded(ev);
                    } catch (e) {
                        console.error('Error in user onDOMAdded handler:', e);
                    }
                } // if (userOnDomAdded)
                widget.onLogic({widget: widget}); // initialize the widget logic
            } // onDOMAdded
            div.appendChild(widget.htmlElement);
        }

        widget = item.label;
        if (widget) {
            // update onDOMAdded handler to initialize the widget logic
            let state = widget.state;
            let userOnDomAdded = state.onDOMAdded;
            state.onDOMAdded = (ev: N2Evt_DomAdded) => {
                if (userOnDomAdded && typeof userOnDomAdded === 'function') {
                    try {
                        userOnDomAdded(ev);
                    } catch (e) {
                        console.error('Error in user onDOMAdded handler:', e);
                    }
                } // if (userOnDomAdded)
                widget.onLogic({widget: widget}); // initialize the widget logic
            } // onDOMAdded
            div.appendChild(widget.htmlElement);
        }

        if (item.action) {
            div.addEventListener('click', ev => {
                ev.stopPropagation(); // Prevent the global click handler from closing the menu

                item.action({widget: thisX});
            });
        }

        return div;
    }
} // main class


export interface StateN2CtxMenuRef extends StateN2BasicRef {
    widget?: N2CtxMenu;
}

export interface N2CtxMenuItem<T extends N2CtxMenu = N2CtxMenu> {
    label: N2Html;
    icon?: N2Html;
    type?: 'default';
    action?: (ev?: { widget?: T }) => void;
} // N2CtxMenuItem

export interface N2CtxMenu_ColorOption<T extends N2CtxMenu = N2CtxMenu> {
    label: string;
    type: 'color';
    color: string;
    action: (ev ?: { widget?: T }) => void;
}


interface N2CtxMenu_RadioOption<T extends N2CtxMenu = N2CtxMenu> {
    label: string;
    type: 'radio';
    checked: boolean;
    action: (ev ?: { widget?: T, ev?: Event }) => void;
}

interface N2CtxMenu_RadioGroup<T extends N2CtxMenu = N2CtxMenu> {
    label: string;
    selected: string;
    options: N2CtxMenu_RadioOption<T>[];
}

export type N2CtxMenuSection<T extends N2CtxMenu = N2CtxMenu> =
    N2CtxMenuItem<T>
    | N2CtxMenu_ColorOption<T>
    | N2CtxMenu_RadioGroup<T>
    | 'separator';


export const CSS_CLASS_N2CTX_MENU_ANCHOR = 'n2ctx-menu-anchor';
export const CSS_CLASS_N2CTX_MENU = 'n2ctx-menu';
export const CSS_CLASS_N2CTX_MENU_ITEM = 'n2ctx-menu-item';
export const CSS_CLASS_N2CTX_MENU_SEPARATOR = 'n2ctx-menu-separator';

export const CSS_CLASS_N2CTX_MENU_RADIO_GROUP = 'n2ctx-radio-group';
export const CSS_CLASS_N2CTX_MENU_RADIO_GROUP_LABEL = 'n2ctx-radio-group-label';
export const CSS_CLASS_N2CTX_MENU_RADIO_OPTION = 'n2ctx-radio-option';

export const CSS_CLASS_N2CTX_MENU_COLOR_PREVIEW = 'n2ctx-color-preview';


let cssLoaded = false;

function loadCSS(): void {
    if (cssLoaded) return;

    try {

        // Global click handler to close all menus
        document.addEventListener('click', (event) => {
            const target = event.target as Element;
            const visible_menus = N2CtxMenu.getVisibleMenus();
            const isClickInsideAnyMenu = visible_menus.some(menu => menu.contains(target));

            if (!isClickInsideAnyMenu) {

                // menus.forEach(menu => menu.style.display = 'none');
                visible_menus.forEach(menu => {
                    if (N2CtxMenu.isMenuVisible(menu))
                        N2CtxMenu.hide(menu)
                });

            }
        });


// CSS Styles
        cssAdd(`
.${CSS_CLASS_N2CTX_MENU} {
    position: absolute;
    background-color: var(--default-bg-color);
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    min-width: max-content;
    padding: 8px 0;
    top: 100%;
    /*left: 0;*/ /*right: 0;*/ /* Position relative to the anchor element */
    font-size: var(--app-font-size-regular);
    font-family: var(--app-font-main);
    flex-direction: column;
    z-index: 1000; /* Ensure it appears above other elements */
}

.${CSS_CLASS_N2CTX_MENU_ITEM} {
    display: flex;
    align-items: baseline;   
    justify-content: flex-start;
    gap: 12px;
    cursor: pointer;
    background-color: var(--default-bg-color);
    padding: 6px 10px;
}

.${CSS_CLASS_N2CTX_MENU_ITEM}:hover {
    background-color: #f5f5f5;
}

.${CSS_CLASS_N2CTX_MENU_SEPARATOR} {
    border-top: 1px solid #eee;
    margin: 8px 0;
}

.${CSS_CLASS_N2CTX_MENU_RADIO_GROUP} {
    padding: 8px 0;
}

.${CSS_CLASS_N2CTX_MENU_RADIO_GROUP_LABEL} {
    padding: 8px 16px;
    font-weight: 500;
    color: #666;
}

.${CSS_CLASS_N2CTX_MENU_RADIO_OPTION} {
    padding: 4px 16px 4px 36px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.${CSS_CLASS_N2CTX_MENU_COLOR_PREVIEW} {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    border: 1px solid #ccc;
}

.${CSS_CLASS_N2CTX_MENU_ANCHOR} {
    position: relative;
    display: inline-block;
    margin: 10px;
}

`, 'N2CtxMenu'
        ); // cssAdd
    } catch (e) {
        console.error(e);
    }

    cssLoaded = true;

} // loadCSS

import {htmlToElement} from "../../BaseUtils";
import {N2_CLASS} from "../../Constants";
import {cssAdd} from "../../CssUtils";
import {N2ColorPicker} from "../ej2/ext/N2ColorPicker";
import {N2Evt_DomAdded, N2Evt_OnHtml} from "../N2";
import {N2Basic, StateN2Basic, StateN2BasicRef} from "../N2Basic";
import {addN2Class} from "../N2HtmlDecorator";
import {getN2FromHtmlElement} from "../N2Utils";
import {CSS_CLASS_N2_DISPLAY_FLEX, CSS_CLASS_N2_DISPLAY_NONE} from "../scss/core";
import {N2Html} from "./N2Html";