import {DropDownButton, MenuEventArgs, BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs, DropDownButtonModel} from '@syncfusion/ej2-splitbuttons';
import {ItemModel} from '@syncfusion/ej2-splitbuttons/src/common/common-model';
import {isString} from 'lodash';
import {voidFunction} from '../../../BaseUtils';
import {cssAddSelector, isDev} from '../../../CoreUtils';
import {N2Html} from '../../generic/N2Html';
import {N2, N2Evt_OnHtml} from '../../N2';
import {N2Basic, StateN2Basic} from '../../N2Basic';
import {addClassesToClassList, addN2Class, decoMergeStyles, decoToCssStyle, decoToHtmlElement, IHtmlUtils, N2HtmlDecorator} from '../../N2HtmlDecorator';
import {isN2} from '../../N2Utils';
import {ThemeChangeEvent, themeChangeListeners} from '../../Theming';
import {N2DropDownButton, StateN2DropDownButton} from '../ext/N2DropDownButton';


export interface StateN2DropDownMenu extends StateN2Basic {

    /**
     * The target element to append this widget to. This can be a HTMLElement or an N2 instance.
     *
     * If you leave it empty, nothing will happen until you set it and call {@link showInTarget}
     *
     */
    target ?: HTMLElement | N2;


    /**
     * This overrides the default anchor innerHTML. You are responsible for the size of the anchor circle and any other styling.
     */
    anchor_innerHTML ?: string | HTMLElement;

    /**
     * IF (and only if) we're using the default anchor innerHTML, you can specify the size of the anchor circle.
     *
     * Sizes correspond to  the fa sizes: sm, md, lg, xl
     *
     * Defaults to 'lg'
     *
     * Table below shows anchor circle size and the  corresponding fa-sm, fa-md, fa-lg, fa-xl classes.
     *         size: 15px w/ fa-sm
     *         size: 20px w/ fa-md
     *         size: 25px w/ fa-lg
     *         size: 30px w/ fa-xl
     */
    anchor_default_size ?: 'sm' | 'md' | 'lg' | 'xl'

    /**
     * Deco for the **default** anchor innerHTML. If you provide your own innerHTML, this will be ignored.
     *
     * For classes you can specify the font-awesome classes to use to replace the default 'fa-solid fa-circle-chevron-down' classes
     * These are all the classes **EXCEPT** for the size classes (fa-sm, fa-md, fa-lg, fa-xl) that are added based on the {@link anchor_default_size} above or default size if not specified.
     */
    anchor_default_fa_deco?: N2HtmlDecorator;

    dropdown_state ?: StateN2DropDownButton_Extension1;

    /**
     * By default, the DropDownButton appends itself to the target (only mandatory property) as soon
     */
    disable_auto_show_in_target ?: boolean;


} // StateN2DropDownMenu





export class N2DropDownMenu<STATE extends StateN2DropDownMenu = StateN2DropDownMenu> extends N2Basic<STATE, DropDownButton> {
    static readonly CLASS_IDENTIFIER: string = 'N2DropDownMenu'

    private _alreadyShownInTarget: boolean = false;
    private _n2Anchor: N2Html;
    private _n2DropDownButton: N2DropDownButton;
    private _sizeSettings: SizeSettings = size_lg;

    constructor(state ?: STATE) {
        super(state);
        this.autoInit();
    }

    /**
     * Override to change the way the widget attaches itself to target initially
     * @return {boolean}
     * @protected
     */
    protected autoInit(): void {
        if (this.initialized || this._alreadyShownInTarget || this.state.disable_auto_show_in_target)
            return;

        // if we have a target, attach and show
        if ( this.state.target) {
            this.showInTarget();
        }

    } // autoInit


    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2DropDownMenu.CLASS_IDENTIFIER);

        if ( isString(state.anchor_default_size)) {
            let sizeSetting = size_map.get(state.anchor_default_size);
            if ( sizeSetting) {
                this._sizeSettings = sizeSetting;
            }
        }

        super.onStateInitialized(state)
    }


    onHtml(args: N2Evt_OnHtml): HTMLElement {
        this.createN2Anchor();
        return this.n2Anchor.htmlElement;
    }


    protected createN2Anchor(): void {
        if ( this._n2Anchor)
            return;

        let state = this.state;

        let buttonAnchorElem = document.createElement('button');
        buttonAnchorElem.classList.add(N2DropDownMenu.CLASS_IDENTIFIER);

        if ( state.anchor_innerHTML ) {
            if (typeof state.anchor_innerHTML === 'string') {
                buttonAnchorElem.innerHTML = state.anchor_innerHTML;
            } else {
                buttonAnchorElem.appendChild(state.anchor_innerHTML);
            }
        } else {

            // Example buttonAnchorElem.innerHTML = '<i class="fa-solid fa-circle-chevron-down  fa-lg"></i>';

            let default_classes :string[] = ['fa-solid', 'fa-circle-chevron-down'];
            let contentElem = document.createElement('i');

            if ( state.anchor_default_fa_deco){
                let fa_deco = state.anchor_default_fa_deco;
                 IHtmlUtils.init(fa_deco);
                if (fa_deco.classes.length == 0) {
                    fa_deco.classes = [...default_classes]; // default to these 2 classes
                }

                addClassesToClassList(fa_deco.classes as string[],this._sizeSettings.fa_size);


                decoToHtmlElement(state.deco,contentElem);
            } else {
                // real default
                let deco:N2HtmlDecorator = {
                    classes: [...default_classes, this._sizeSettings.fa_size],
                }
                decoToHtmlElement(deco,contentElem);
            }
            buttonAnchorElem.appendChild(contentElem);
        } // if anchor_innerHTML or not

        let size = this._sizeSettings.circle_size;

        let style_local = `min-width : ${size}px;
            min-height : ${size}px;
            height : ${size}px;
            width : ${size}px;
            `;

        state.deco = state.deco || {};
        IHtmlUtils.init(state.deco);
        let anchor_style = decoToCssStyle(decoMergeStyles(state.deco.style, style_local));

        if ( this._sizeSettings.top && anchor_style.top == null && anchor_style.bottom == null)
            anchor_style.top = this._sizeSettings.top;
        if ( this._sizeSettings.bottom && anchor_style.bottom == null && anchor_style.top == null)
            anchor_style.bottom = this._sizeSettings.bottom;
        if ( this._sizeSettings.right && anchor_style.right == null && anchor_style.left == null)
            anchor_style.right = this._sizeSettings.right;
        if ( this._sizeSettings.left && anchor_style.left == null && anchor_style.right == null)
            anchor_style.left = this._sizeSettings.left;
        if ( this._sizeSettings.padding_top && anchor_style['padding-top'] == null && anchor_style.padding == null)
            anchor_style['padding-top'] = this._sizeSettings.padding_top;

        state.deco.style = anchor_style;

        this._n2Anchor =  new N2Html({
            deco: state.deco,
            value:buttonAnchorElem,
        });
    } // createN2Anchor


    protected createN2DropDownButton(): void {
        if ( !this.n2Anchor){
            console.error('Anchor not created yet');
            throw new Error('Anchor not created yet');
        }

        let state = this.state;

        // let dropdown_deco = state.dropdown_deco || {};
        state.dropdown_state = state.dropdown_state || {};
        let dropdown_state : StateN2DropDownButton_Extension1 = state.dropdown_state;
        dropdown_state.skipAppendEjToHtmlElement = true; // needed so we can append to the anchor element with the correct timing

        try {
            this.beforeDropDownCreated({widget: this, dropdown_state: dropdown_state});
        } catch(e) { console.error('Error in beforeDropDownCreated', e)}

        this.addItemMethodCalls(dropdown_state);

        let items_before = [...dropdown_state.ej.items]; // different array, but same order and same items

        let n2DropDownButton = new N2DropDownButton(dropdown_state);


        let ev_afterDropDownCreated = {
            widget: this,
            dropdown_state: dropdown_state,
            n2DropDownButton: n2DropDownButton,
            override_disable_removal_of_e_btn_icon: false,
            override_custom_init_append_to_anchor: undefined,
        } as Ev_afterDropDownCreated;


        try {
            this.afterDropDownCreated(ev_afterDropDownCreated);
        } catch(e) { console.error('Error in afterDropDownCreated', e)}

        if ( ev_afterDropDownCreated.override_custom_init_append_to_anchor == null) {
            // if no override
            try {
                n2DropDownButton.initLogic();
                let ejDropDownButton = n2DropDownButton.obj;
                if (ejDropDownButton)
                    ejDropDownButton.appendTo(this.n2Anchor.htmlElement);
            } catch (e) { console.error('Error in n2DropDownButton.initLogic', e)}
        } else {
            ev_afterDropDownCreated.override_custom_init_append_to_anchor.call(this);
        } // if no override

        if ( ev_afterDropDownCreated.override_disable_removal_of_e_btn_icon !== true) {
            // if no override, remove default ej2 drop down button content
            let ejDropDownButton = n2DropDownButton.obj;
            if ( ejDropDownButton)
                ejDropDownButton.element.querySelector('.e-btn-icon').remove(); // remove default ej2 drop down button content
        } // if no override



        // now copy all the implemented functions from the beforeItemRender, beforeOpen, beforeClose, close, open, select into the actual items
        let ejDropDownButton: DropDownButton = n2DropDownButton.obj;
        if ( ejDropDownButton) {
            let items_current = ejDropDownButton.items; // these have been transformed to Item from ItemModel (actual instances)
            for (let i = 0; i < items_current.length; i++) {
                let current_item = items_current[i];
                let before_item = items_before[i];

                // copy only the properties of the ItemModel_N2DropDownMenu that are not null
                let itemState = current_item as ItemModel_N2DropDownMenu;
                let beforeItem = before_item as ItemModel_N2DropDownMenu;
                if (beforeItem.beforeItemRender) {
                    itemState.beforeItemRender = beforeItem.beforeItemRender;
                }
                if (beforeItem.beforeOpen) {
                    itemState.beforeOpen = beforeItem.beforeOpen;
                }
                if (beforeItem.beforeClose) {
                    itemState.beforeClose = beforeItem.beforeClose;
                }
                if (beforeItem.close) {
                    itemState.close = beforeItem.close;
                }
                if (beforeItem.open) {
                    itemState.open = beforeItem.open;
                }
                if (beforeItem.select) {
                    itemState.select = beforeItem.select;
                }
            } // for items_current
        }

        this._n2DropDownButton = n2DropDownButton;
    } // createN2DropDownButton


    beforeDropDownCreated(ev:{widget: N2DropDownMenu, dropdown_state:StateN2DropDownButton}): void {
        // override in subclass
    }


    afterDropDownCreated(ev:Ev_afterDropDownCreated): void {
        // override in subclass
    }


    public get n2Anchor(): N2Html {
        return this._n2Anchor;
    }

    public get n2DropDownButton(): N2DropDownButton {
        return this._n2DropDownButton;
    }

    /**
     * Show the DropDownMenu in the target element. Only use when {@link StateN2DropDownMenu.disable_auto_show_in_target} is set to true.
     * or if target was empty when you first created the DropDownMenu. In that case call it after setting the target.
     *
     * Gets called automatically when the DropDownMenu is created unless {@link StateN2DropDownMenu.disable_auto_show_in_target} is set to true.
     */
    public showInTarget(): void {
        if (this._alreadyShownInTarget)
            return; // only do this once


        if ( this.state.target) {
            this.initLogic(); // make sure we're initialized first
        } // if target


        let targetElem:HTMLElement;
        if ( isN2(this.state.target)) {
            if ( !this.state.target.initialized) {
                console.error('Cannot attach DropDownMenu since target not initialized yet ', this.state.target);
                return;
            }

            targetElem = this.state.target.htmlElement;

        } else {
            targetElem = this.state.target;
        }

        if ( isDev()){
            const computedStyle = getComputedStyle(targetElem);
            if (computedStyle.position !== 'relative' && computedStyle.position !== 'absolute' && computedStyle.position !== 'fixed') {
                let msg:string = 'Parent element must have position relative, absolute, or fixed for the child element to be positioned correctly. See console';
                console.error(msg, targetElem, 'child:', this._n2Anchor);
                alert(msg + '\n\nSee console for details.');
            } // if position not conducive to absolute positioning of a child element
        } // if isDev


        if ( targetElem ) {
            targetElem.appendChild(this.htmlElement); // could be moving the existing element to a different target

            this.createN2DropDownButton();
            this._alreadyShownInTarget = true; // only do this once
        }
    } // showInTarget


    protected addItemMethodCalls(dropdown_state: StateN2DropDownButton_Extension1): void {
        if (!dropdown_state)
            return;

        dropdown_state.ej = dropdown_state.ej || {};

        let thisX = this;

        let existing_beforeItemRender = dropdown_state.ej.beforeItemRender;
        dropdown_state.ej.beforeItemRender = (args:MenuEventArgs) => {

            let ev = {n2ddm: thisX, args: args, cancelDefault: false};
            let item = args.item as ItemModel_N2DropDownMenu;
            if (item.beforeItemRender) {
                try {
                    item.beforeItemRender.call(thisX.obj, ev);
                } catch(e) { console.error('Error in beforeItemRender', e)}
            }

            if (!ev.cancelDefault) {
                if (existing_beforeItemRender) {
                    try {
                        existing_beforeItemRender.call(thisX.obj, args);
                    } catch(e) { console.error('Error in existing_beforeItemRender', e)}
                }
            }
        } // beforeItemRender

        let existing_beforeOpen = dropdown_state.ej.beforeOpen;
        dropdown_state.ej.beforeOpen = (args:BeforeOpenCloseMenuEventArgs) => {
            let ev = {n2ddm: thisX, args: args, cancelDefault: false};
            if (existing_beforeOpen) {
                try {
                    existing_beforeOpen.call(thisX.obj, args);
                } catch(e) { console.error('Error in existing_beforeOpen', e)}
            }
            if (!ev.cancelDefault) {
                let items = args.items;
                for (let item of items) {
                    let itemState = item as ItemModel_N2DropDownMenu;
                    if (itemState.beforeOpen) {
                        try {
                            itemState.beforeOpen.call(thisX.obj, ev);
                        } catch(e) { console.error('Error in beforeOpen', e)}
                    }
                } // for items
            }
        } // beforeOpen

        let existing_beforeClose = dropdown_state.ej.beforeClose;
        dropdown_state.ej.beforeClose = (args:BeforeOpenCloseMenuEventArgs) => {
            let ev = {n2ddm: thisX, args: args, cancelDefault: false};
            if (existing_beforeClose) {
                try {
                    existing_beforeClose.call(thisX.obj, args);
                } catch(e) { console.error('Error in existing_beforeClose', e)}
            }
            if (!ev.cancelDefault) {
                let items = args.items;
                for (let item of items) {
                    let itemState = item as ItemModel_N2DropDownMenu;
                    if (itemState.beforeClose) {
                        try {
                            itemState.beforeClose.call(thisX.obj, ev);
                        } catch(e) { console.error('Error in beforeClose', e)}
                    }
                } // for items
            }
        } // beforeClose

        let existing_close = dropdown_state.ej.close;
        dropdown_state.ej.close = (args:OpenCloseMenuEventArgs) => {
            let ev = {n2ddm: thisX, args: args, cancelDefault: false};
            if (existing_close) {
                try {
                    existing_close.call(thisX.obj, args);
                } catch(e) { console.error('Error in existing_close', e)}
            }
            if (!ev.cancelDefault) {
                let items = args.items;
                for (let item of items) {
                    let itemState = item as ItemModel_N2DropDownMenu;
                    if (itemState.close) {
                        try {
                            itemState.close.call(thisX.obj, ev);
                        } catch(e) { console.error('Error in close', e)}
                    }
                } // for items
            }
        } // close

        let existing_open = dropdown_state.ej.open;
        dropdown_state.ej.open = (args:OpenCloseMenuEventArgs) => {
            let ev = {n2ddm: thisX, args: args, cancelDefault: false};
            if (existing_open) {
                try {
                    existing_open.call(thisX.obj, args);
                } catch(e) { console.error('Error in existing_open', e)}
            }
            if (!ev.cancelDefault) {
                let items = args.items;
                for (let item of items) {
                    let itemState = item as ItemModel_N2DropDownMenu;
                    if (itemState.open) {
                        try {
                            itemState.open.call(thisX.obj, ev);
                        } catch(e) { console.error('Error in open', e)}
                    }
                } // for items
            }
        } // open

        let existing_select = dropdown_state.ej.select;
        dropdown_state.ej.select = (args:MenuEventArgs) => {
            let ev = {n2ddm: thisX, args: args, cancelDefault: false};
            if (existing_select) {
                try {
                    existing_select.call(thisX.obj, args);
                } catch(e) { console.error('Error in existing_select', e)}
            }
            if (!ev.cancelDefault) {
                let item = args.item as ItemModel_N2DropDownMenu;
                if (item.select) {
                    try {
                        item.select.call(thisX.obj, ev);
                    } catch(e) { console.error('Error in select', e)}
                }
            }
        } // select

    } // addItemMethodCalls

}// class N2DropDownMenu

/**
 * Extends the DropDownButtonModel to allow items to be of type ItemModel or ItemModel_N2DropDownMenu.
 *
 * @interface DropDownButtonModel_Extention1
 * @extends {DropDownButtonModel}
 */
interface DropDownButtonModel_Extention1 extends DropDownButtonModel {
    /**
     * Array of items in the DropDownButton, which can be of type ItemModel or ItemModel_N2DropDownMenu.
     *
     * @type {(ItemModel | ItemModel_N2DropDownMenu)[]}
     * @memberof DropDownButtonModel_Extention1
     */
    items ?: (ItemModel | ItemModel_N2DropDownMenu)[];
}

/**
 * Extends the StateN2DropDownButton to redefine the ej property with the extended DropDownButtonModel.
 *
 * @interface StateN2DropDownButton_Extension1
 * @extends {Omit<StateN2DropDownButton, 'ej'>}
 */
interface StateN2DropDownButton_Extension1 extends Omit< Omit<StateN2DropDownButton, 'ej'>, 'children'> {
    /**
     * Extended DropDownButton model which allows items to be of type ItemModel or ItemModel_N2DropDownMenu.
     * Remove the 'children' property that doesn't apply here
     *
     * @type {DropDownButtonModel_Extention1}
     * @memberof StateN2DropDownButton_Extension1
     */
    ej ?: DropDownButtonModel_Extention1;
}

export interface ItemModel_N2DropDownMenu extends ItemModel {
    /**
     * Triggers while rendering each Popup item of DropDownButton.
     *
     * @event beforeItemRender
     */
    beforeItemRender?: ( ev:{n2ddm: N2DropDownMenu, args:MenuEventArgs, cancelDefault?:boolean}, )=>void;

    /**
     * Triggers before opening the DropDownButton popup.
     *
     * @event beforeOpen
     */
    beforeOpen?: (  ev:{n2ddm: N2DropDownMenu, args:BeforeOpenCloseMenuEventArgs, cancelDefault?:boolean})=>void;

    /**
     * Triggers before closing the DropDownButton popup.
     *
     * @event beforeClose
     */
    beforeClose?: (  ev:{n2ddm: N2DropDownMenu, args:BeforeOpenCloseMenuEventArgs, cancelDefault?:boolean})=>void;

    /**
     * Triggers while closing the DropDownButton popup.
     *
     * @event close
     */
    close?: (  ev:{n2ddm: N2DropDownMenu, args:OpenCloseMenuEventArgs, cancelDefault?:boolean})=>void;

    /**
     * Triggers while opening the DropDownButton popup.
     *
     * @event open
     */
    open?: (  ev:{n2ddm: N2DropDownMenu, args:OpenCloseMenuEventArgs, cancelDefault?:boolean})=>void;
    /**
     * Triggers while selecting action item in DropDownButton popup.
     *
     * @event select
     */
    select?: (  ev:{n2ddm: N2DropDownMenu, args:MenuEventArgs, cancelDefault?:boolean})=>void;

} // ItemModel_N2DropDownMenu


//---------------------- Events ----------------------------

export interface Ev_afterDropDownCreated {
    widget: N2DropDownMenu,
    dropdown_state:StateN2DropDownButton,
    n2DropDownButton: N2DropDownButton,
    /**
     * If you set to true, the 'e-btn-icon' default DropDownButton content in the anchor is not removed any longer
     */
    override_disable_removal_of_e_btn_icon?: boolean,

    /**
     * If you define this function, it will replace the following code:
     * {@code typescript
     *         n2DropDownButton.initLogic();
     *         let ejDropDownButton = n2DropDownButton.obj;
     *         n2DropDownButton.obj.appendTo(this.n2Anchor.htmlElement);
     *              ejDropDownButton.element.querySelector('.e-btn-icon').remove(); // remove default ej2 drop down button content
     * }
     */
    override_custom_init_append_to_anchor ?: voidFunction,
} // Ev_afterDropDownCreated


//------------------------ SizeSettings ----------------------

interface SizeSettings {
    /**
     * The size of the anchor circle (in units of {@link circle_size_unit} that are 'px' by default).
     */
    circle_size: number;
    /**
     *Defaults to 'px', but can be set to 'em', 'rem', etc.
     */
    circle_size_unit:string;

    /**
     * The font-awesome size class to use for the anchor circle.
     */
    fa_size: 'fa-sm' | 'fa-md' | 'fa-lg' | 'fa-xl' ;

    top ?: string;

    bottom ?: string;

    right ?: string;

    left ?: string;

    padding_top ?: string;

}

const size_sm: SizeSettings = {
    circle_size: 18,
    circle_size_unit: 'px',
    fa_size: 'fa-sm',
    top: '1px',
    right: '1px',
    padding_top: '2px', // HACK! Small circle does not center at 100% resolution. Don't know why, but this fixes it.

};
const size_md: SizeSettings = {
    circle_size: 20,
    circle_size_unit: 'px',
    fa_size: 'fa-md',
    top: '1px',
    right: '1px',
};
const size_lg: SizeSettings = {
    circle_size: 25,
    circle_size_unit: 'px',
    fa_size: 'fa-lg',
    top: '1px',
    right: '1px',
};
const size_xl: SizeSettings = {
    circle_size: 30,
    circle_size_unit: 'px',
    fa_size: 'fa-xl',
    top: '1px',
    right: '1px',
};
const size_map: Map<'sm' | 'md' | 'lg' | 'xl', SizeSettings> = new Map([
    ['sm', size_sm],
    ['md', size_md],
    ['lg', size_lg],
    ['xl', size_xl],
]);

themeChangeListeners().add((_ev: ThemeChangeEvent) => {
    let size: number = 25;

    cssAddSelector(`.${N2DropDownMenu.CLASS_IDENTIFIER},
    .${N2DropDownMenu.CLASS_IDENTIFIER}.e-btn.e-active, 
    .${N2DropDownMenu.CLASS_IDENTIFIER}.e-btn:focus,
    .${N2DropDownMenu.CLASS_IDENTIFIER}.e-btn:hover`, `
    position : absolute;
    padding : initial;
    color : var(--app-color-blue-01);
    background-color : transparent;
    border-radius : 50%;
    border : solid 0.1px var(--app-color-gray-500);
    display : flex;
    justify-content : center;
    align-items : center;
`);

    cssAddSelector(`.${N2DropDownMenu.CLASS_IDENTIFIER}.e-btn:hover`, `
        border : solid 1px var(--app-color-blue-01);
        box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12);
`);
}); // normal priority