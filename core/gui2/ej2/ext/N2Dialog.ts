import {Dialog, DialogModel} from '@syncfusion/ej2-popups';
import {BeforeCloseEventArgs, BeforeOpenEventArgs} from '@syncfusion/ej2-popups/src/dialog/dialog';
import {isArray, isString} from 'lodash';
import {isHTMLElement} from '../../../CoreUtils';
import {cssAddSelector} from '../../../CssUtils';
import {N2Html} from '../../generic/N2Html';
import {
    isN2_Interface_Dialog_BeforeClose,
    isN2_Interface_Dialog_BeforeOpen,
    isN2_Interface_Dialog_Close,
    isN2_Interface_Dialog_Open,
    N2Evt_Dialog,
    N2Evt_Dialog_Cancellable,
} from '../../generic/N2Interface_Dialog';
import {N2Row} from '../../generic/N2Row';
import {N2, N2Evt_Destroy, N2Evt_OnLogic} from '../../N2';
import {addN2Class, decoToHtmlElement} from '../../N2HtmlDecorator';
import {isN2} from '../../N2Utils';
import {CSS_VARS_CORE} from '../../scss/vars-material';
import {ThemeChangeEvent, themeChangeListeners} from '../../Theming';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';
import {N2DialogBackArrow} from './util/N2DialogBackArrow';


export interface StateN2DialogRef extends StateN2EjBasicRef {
    widget?: N2Dialog;
}

export interface StateN2Dialog extends StateN2EjBasic<DialogModel> {

    /**
     * Optional header for the dialog. If specified,it will override any setting
     * under ej.header
     */
    header?: string | HTMLElement | N2 | N2[];

    /**
     * The content of the dialog. It will always override ej.content
     */
    content?: N2 | HTMLElement;

    /**
     * Optional tag to append the Dialog to. If not specified, the dialog will be appended to the body
     */
    appendTo?: HTMLElement;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2DialogRef;

    /**
     * Defaults to true.
     * if true the content passed to the Dialog will have any {#link N2} component {@link N2.destroy} method called when the dialog is closed
     */
    destroyN2ContentOnClose?: boolean;

    /**
     * Defaults to true.
     * if true the header passed to the Dialog will have any {#link N2} component {@link N2.destroy} method called when the dialog is closed
     */
    destroyN2HeaderOnClose?: boolean;
}

/**
 * The color of the back arrow in the header. Overwrite in extending classes
 */
export let css_N2Dialog_color_header_font: string = 'white';
export let css_N2Dialog_color_header_background: string = 'black';


export class N2Dialog<STATE extends StateN2Dialog = any> extends N2EjBasic<STATE, Dialog> {
    static readonly CLASS_IDENTIFIER: string = 'N2Dialog';
    private _appendedTo: HTMLElement;
    private _appendTargetCreatedLocally: boolean;
    private _customValue: any;

    constructor(state ?: STATE) {
        super(state);
    }


    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2Dialog.CLASS_IDENTIFIER);
        state.ej = state.ej || {};

        //if not set to anything, default to true
        state.destroyN2HeaderOnClose = state.destroyN2HeaderOnClose == null ? true : state.destroyN2HeaderOnClose;

        //if not set to anything, default to true
        state.destroyN2ContentOnClose = state.destroyN2ContentOnClose == null ? true : state.destroyN2ContentOnClose;

        if (state.appendTo) {
            this._appendedTo = state.appendTo;
            // sync id
            if (state.appendTo.id == null) {
                state.appendTo.id = state.tagId;
            } else {
                state.tagId = state.appendTo.id;
            }

            decoToHtmlElement(this.state.deco, this._appendedTo); // transfer deco to the anchor element
            if (this.state?.deco?.tag) {
                if (this._appendedTo?.tagName != this.state?.deco?.tag) {
                    console.error('Tag of deco cannot be set to the anchor element. deco value is', this.state.deco, 'and anchor element is', this._appendedTo);
                }
            }

        } else {
            // let localAnchorID: string = this.state.tagId; // getRandomString('anchor_');
            // let elem: HTMLDivElement = document.createElement('div')
            // elem.id = localAnchorID
            this._appendedTo = this.htmlElement; // we can call it here because we have recursion prevention in place
            document.body.appendChild(this.htmlElement);
            this._appendTargetCreatedLocally = true; // so it can be removed on destroy
        }


        let ej: DialogModel = state.ej;

        if (ej.isModal == null)
            ej.isModal = true;

        if (ej.animationSettings == null)
            ej.animationSettings = {effect: 'FadeZoom'};

        if (ej.showCloseIcon == null)
            ej.showCloseIcon = true;

        if (ej.closeOnEscape == null)
            ej.closeOnEscape = true;

        if (ej.enableResize == null)
            ej.enableResize = true;

        if (ej.allowDragging == null)
            ej.allowDragging = true;

        if (ej.visible == null)
            ej.visible = false; // visible only when show() is called

        ej.width = ej.width || '99%'; // crucial to be set for N2EjPanelGridFlex to size correctly (get an initial resize event)
        ej.height = ej.height || '99%'; // crucial to be set for N2EjPanelGridFlex to size correctly (get an initial resize event)
        ej.enableResize = ej.enableResize || true;

        ej.cssClass = ej.cssClass || '';
        if (ej.cssClass != '')
            ej.cssClass += ' ';
        ej.cssClass += this.className; // name of the class for css purposes


        // Make a header from either state.header or state.ej.header
        let n2Header: N2 = this._headerN2();
        ej.header = n2Header.htmlElement;

        if (state.content) {
            ej.content = (state.content instanceof HTMLElement ? state.content : state.content.htmlElement);
        }

        let userOpen = ej.open;
        let userClose = ej.close;
        let userBeforeClose = ej.beforeClose;
        let userBeforeOpen = ej.beforeOpen;

        ej.beforeOpen = (args: BeforeOpenEventArgs) => {
            try {
                if (isN2_Interface_Dialog_BeforeOpen(this.state.content)) {
                    try {
                        let evt: N2Evt_Dialog_Cancellable = {
                            dialog: this,
                            widget: this.state.content as any,
                            native_event: args,
                            cancel: false
                        };
                        this.state.content.onDialogBeforeOpen(evt);
                        if (evt.cancel) {
                            args.cancel = true;
                        }
                    } catch (e) {
                        console.error('N2Dialog._headerN2: error calling onDialogBeforeOpen on content', e);
                    }
                }
            } catch (e) {
                this.handleError(e);
            }
            if (args.cancel)
                return;

            try {
                if (userBeforeOpen)
                    userBeforeOpen.call(this, args); // any user open code
            } catch (e) {
                this.handleError(e);
            }

        } // ej.beforeOpen

        ej.open = (args: any) => {
            try {
                if (isN2(n2Header))
                    n2Header.initLogic(); // initialize header
            } catch (e) {
                this.handleError(e);
            }

            try {
                if (this.state.content) {
                    if (this.state.content instanceof HTMLElement) {
                    } else {
                        // if N2, init logic
                        if (isN2(this.state.content))
                            this.state.content.initLogic(); // initialize content
                    }
                }
            } catch (e) {
                this.handleError(e);
            }
            if (isN2_Interface_Dialog_Open(this.state.content)) {
                try {
                    let evt: N2Evt_Dialog<N2Dialog> = {
                        dialog: this,
                        widget: this.state.content as any,
                        native_event: args
                    };
                    this.state.content.onDialogOpen(evt);
                } catch (e) {
                    console.error('N2Dialog._headerN2: error calling onDialogOpen on content', e);
                }
            }

            try {
                if (userOpen)
                    userOpen.call(this, args); // any user open code
            } catch (e) {
                this.handleError(e);
            }

        } // ej.open

        ej.beforeClose = (args: BeforeCloseEventArgs) => {
            if (isN2_Interface_Dialog_BeforeClose(this.state.content)) {
                try {
                    let evt: N2Evt_Dialog_Cancellable = {
                        dialog: this,
                        widget: this.state.content as any,
                        native_event: args,
                        cancel: false
                    };
                    this.state.content.onDialogBeforeClose(evt);
                    if (evt.cancel) {
                        args.cancel = true;
                    }
                } catch (e) {
                    console.error('N2Dialog._headerN2: error calling onDialogBeforeClose on content', e);
                }
            } // if (isN2_Interface_Dialog_BeforeClose(this.state.content))

            if (args.cancel)
                return;

            try {
                if (userBeforeClose)
                    userBeforeClose.call(this, args); // any user open code
            } catch (e) {
                this.handleError(e);
            }

        }

        ej.close = (args: any) => {

            if (isN2_Interface_Dialog_Close(this.state.content)) {
                try {
                    let evt: N2Evt_Dialog = {dialog: this, widget: this.state.content as any, native_event: args};
                    this.state.content.onDialogClose(evt);
                } catch (e) {
                    console.error('N2Dialog._headerN2: error calling onDialogClose on content', e);
                }
            }

            try {
                if (userClose)
                    userClose.call(this, args);
            } catch (e) {
                this.handleError(e);
            }

            try {
                this.destroy();
            } catch (e) {
                console.error('N2Dialog._headerN2: error destroying N2Dialog', e);
            }
        } // ej.close


        super.onStateInitialized(state); // will trigger onDestroy
    } // onStateInitialized

    onDestroy(args: N2Evt_Destroy) {
        let state: STATE = this.state;

        try {
            if (this.state.destroyN2HeaderOnClose) {
                if (isArray(state.header)) {
                    //traverse state.header array and only push if N2
                    for (const element of state.header) {
                        if (isN2(element)) {
                            try {
                                element.destroy();
                            } catch (e) {
                                console.error('N2Dialog._headerN2: error destroying N2 in state.header array', e);
                            }
                        }
                    }
                } else if (isN2(state.header)) {
                    // single N2
                    try {
                        state.header.destroy();
                    } catch (e) {
                        console.error('N2Dialog._headerN2: error destroying N2 in state.header', e);
                    }
                }
            }
        } catch (e) {
            console.error('N2Dialog._headerN2: error destroying N2 in state.header', e);
        }


        try {
            if (this.state.destroyN2ContentOnClose) {
                if (isN2(this.state.content)) {
                    this.state.content?.destroy();
                }
            }
        } catch (e) {
            console.error('N2Dialog._headerN2: error destroying N2 in state.content', e);
        }

        try {
            this.obj.destroy();
        } catch (e) {
            console.error(e);
        }

        try {
            if (this.appendTargetCreatedLocally) {
                if (this.appendedTo) {
                    this.appendedTo.parentElement.removeChild(this._appendedTo);
                }
            }

        } catch (e) {
            console.error(e);
        }

        super.onDestroy(args);
    }

    onLogic(args: N2Evt_OnLogic) {
        if (!this._appendTargetCreatedLocally) {
            this.htmlElement = this._appendedTo; // this is the true html element that will be used by the widget
        }
        super.onLogic(args);
    }


    createEjObj(): void {
        this.obj = new Dialog(this.state.ej);
    }

    appendEjToHtmlElement(): void {
        this.obj.appendTo(this._appendedTo);
    }


    show() {
        this.initLogic(); // multiple calls don't have any impact
        this.obj.show();
    }

    hide() {
        this.obj.hide();
    }

    protected _headerN2(): N2 {
        let state = this.state;
        let list: N2[] = [];

        // if (!state.headerOptions.hideBackArrow)
        list.push(this._headerBackArrow());

        if (state.header == null)
            state.header = (state.ej.header ? (isHTMLElement(state.ej.header) ? (state.ej.header as HTMLElement) : state.ej.header.toString()) : ''); // if header is not set, use the ej.header value if possible, else default to ''

        if (isString(state.header)) {
            list.push(new N2Html({value: state.header}));
        } else if (isHTMLElement(state.header)) {
            list.push(new N2Html({value: (state.header as HTMLElement)}));
        } else if (isArray(state.header)) {
            //traverse state.header array and only push if N2
            for (const element of state.header) {
                if (isN2(element)) {
                    list.push(element);
                } else {
                    console.error('N2Dialog._headerN2: state.header contains an element that is not an N2');
                }
            }
        } else if (isN2(state.header)) {
            // single N2
            list.push(state.header);
        }

        return new N2Row({children: list});

    }

    protected _headerBackArrow(): N2DialogBackArrow {
        return new N2DialogBackArrow({
            value: null,
            dialog: this,
        });
    }

    /**
     * Refresh the header of the dialog based on the current header in the state property.
     * Used to change the header AFTER the dialog is rendered already
     */
    public headerRefresh() {
        let header = this._headerN2();
        if ( this.obj){
            header.initLogic();
            this.obj.header = header.htmlElement;
        }
    }

    public get appendTargetCreatedLocally(): boolean {
        return this._appendTargetCreatedLocally;
    }

    public set appendTargetCreatedLocally(value: boolean) {
        this._appendTargetCreatedLocally = value;
    }

    public get appendedTo(): HTMLElement {
        return this._appendedTo;
    }

    public set appendedTo(value: HTMLElement) {
        this._appendedTo = value;
    }


    public get customValue(): any {
        return this._customValue;
    }

    public set customValue(value: any) {
        this._customValue = value;
    }

    get classIdentifier() { return N2Dialog.CLASS_IDENTIFIER; }
} // N2Dialog

themeChangeListeners().add((ev: ThemeChangeEvent) => {

    let isDarkTheme: boolean = ev.newState.theme_type == 'dark';

    if (isDarkTheme) {
        // dialog itself gets the background color
        cssAddSelector(`.${N2Dialog.CLASS_IDENTIFIER}.e-dialog`, `
        background-color: var(--app-color-panel-background);
        border: 1px solid var(--grid-header-border-color);
    `);
    } // if ( isDarkTheme)


    // color of text in dialog box header
    cssAddSelector(`.${N2Dialog.CLASS_IDENTIFIER} .e-dlg-header`, `
        color: ${CSS_VARS_CORE.app_dialog_header_font_color}; 
    `);

    // color of text in dialog box header
    // remove border from all buttons and other elements
    cssAddSelector(`.${N2Dialog.CLASS_IDENTIFIER} .e-dlg-header, .${N2Dialog.CLASS_IDENTIFIER} .e-dlg-header *`, `
        color: ${CSS_VARS_CORE.app_dialog_header_font_color}; 
        font-size: var(--app-font-size-regular);
        border: none;         
`);


    // dialog header gets background color
//noinspection CssReplaceWithShorthandSafely

    let rules: string = `
        padding: 0 10px 0 2px;
        border-bottom: 5px solid ${CSS_VARS_CORE.app_color_blue};
        background-color: ${CSS_VARS_CORE.app_dialog_header_background_color}; 
    `;
    cssAddSelector(`.${N2Dialog.CLASS_IDENTIFIER}.e-lib.e-dialog .e-dlg-header-content`, rules);


    rules = `
        padding: 5px;
    `
    if (isDarkTheme) {
        rules += `
        background-color: var(--app-color-panel-background); 
        `;
    }
    // dialog content gets background color
    cssAddSelector(`.${N2Dialog.CLASS_IDENTIFIER}.e-dialog .e-dlg-content`, rules);

    cssAddSelector(`.${N2Dialog.CLASS_IDENTIFIER} .e-dlg-header-content .e-dlg-header`, `
        font-size: var(--app-font-size-regular);
    `);


// Size the dialog heading component to be the whole width of the dialog minus the width of the close button
    cssAddSelector(`.${N2Dialog.CLASS_IDENTIFIER}.e-dialog .e-dlg-header`, `
        width: calc(100% - ${CSS_VARS_CORE.app_dialog_header_close_button_size}px)
    `);


//----------------- Size close button and X inside properly -----------
// See https://support.syncfusion.com/support/tickets/358806

    cssAddSelector(`.${N2Dialog.CLASS_IDENTIFIER}.e-dialog .e-dlg-header-content .e-btn.e-dlg-closeicon-btn`, `
        display: inline-flex;
        margin-top: 5px;
        height: ${CSS_VARS_CORE.app_dialog_header_close_button_size}px;
        width: ${CSS_VARS_CORE.app_dialog_header_close_button_size}px;
        padding-top: 3px;
    `);
    // This makes the close button visible at all times, not just when being hovered over
    cssAddSelector(`.${N2Dialog.CLASS_IDENTIFIER}.e-lib.e-dialog .e-btn.e-dlg-closeicon-btn`, `
        background-color: #e0e0e0;
        border-color: rgba(0, 0, 0, 0);
        box-shadow: 0 0 0 rgba(0, 0, 0, 0)
    `);
    // black x on gray #e0e0e0 background
    cssAddSelector(`.${N2Dialog.CLASS_IDENTIFIER}.e-dialog .e-dlg-header-content .e-btn.e-dlg-closeicon-btn .e-icon-dlg-close`, `
        color:#000;
    `);

    cssAddSelector(`.${N2Dialog.CLASS_IDENTIFIER}.e-dialog .e-btn .e-btn-icon`, `
        margin-top: 0px;
    `);

    //changed
    cssAddSelector(`.${N2Dialog.CLASS_IDENTIFIER}.e-dialog .e-btn .e-btn-icon.e-icon-dlg-close`, `
        font-size: 10px;
    `);

    // by default the N2Dialog has 5px padding
    cssAddSelector(`.${N2Dialog.CLASS_IDENTIFIER}.e-dialog.no-padding .e-dlg-content`, `
    padding: 0;
    `);

}); // normal priority