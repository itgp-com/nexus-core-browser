import {Dialog, DialogModel} from "@syncfusion/ej2-popups";
import {isArray, isString} from "lodash";
import {getRandomString} from "../../../BaseUtils";
import {isHTMLElement} from "../../../CoreUtils";
import {isNx2_Interface_Dialog_Close, isNx2_Interface_Dialog_Open} from '../../generic/Nx2Interface_Dialog';
import {Nx2Html} from "../../generic/Nx2Html";
import {Nx2Row} from "../../generic/Nx2Row";
import {Nx2, Nx2Evt_Destroy, Nx2Evt_OnHtml, Nx2Evt_OnLogic} from "../../Nx2";
import {addClassesToElement, addNx2Class, decoToHtmlElement} from '../../Nx2HtmlDecorator';
import {isNx2} from "../../Nx2Utils";
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";
import {Nx2DialogBackArrow} from "./util/Nx2DialogBackArrow";


export interface StateNx2EjDialogRef extends StateNx2EjBasicRef {
    widget?: Nx2EjDialog;
}

export interface StateNx2EjDialog extends StateNx2EjBasic<DialogModel> {

    /**
     * Optional header for the dialog. If specified,it will override any setting
     * under ej.header
     */
    header?: string | HTMLElement | Nx2 | Nx2[];

    /**
     * The content of the dialog. It will always override ej.content
     */
    content?: Nx2 | HTMLElement;

    /**
     * Optional tag to append the Dialog to. If not specified, the dialog will be appended to the body
     */
    appendTo?: HTMLElement;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjDialogRef;

    /**
     * Defaults to true.
     * if true the content passed to the Dialog will have any {#link Nx2} component {@link Nx2.destroy} method called when the dialog is closed
     */
    destroyNx2ContentOnClose?: boolean;

    /**
     * Defaults to true.
     * if true the header passed to the Dialog will have any {#link Nx2} component {@link Nx2.destroy} method called when the dialog is closed
     */
    destroyNx2HeaderOnClose?: boolean;
}

/**
 * The color of the back arrow in the header. Overwrite in extending classes
 */
export let css_Nx2Dialog_color_header_font: string = 'white';
export let css_Nx2Dialog_color_header_background: string = 'black';


export class Nx2EjDialog<STATE extends StateNx2EjDialog = any> extends Nx2EjBasic<STATE, Dialog> {
    private _appendedTo: HTMLElement;
    private _appendTargetCreatedLocally: boolean;
    private _customValue: any;

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjDialog');
    }


    protected onStateInitialized(state: STATE) {
        state.ej = state.ej || {};

        //if not set to anything, default to true
        state.destroyNx2HeaderOnClose = state.destroyNx2HeaderOnClose == null ? true : state.destroyNx2HeaderOnClose;

        //if not set to anything, default to true
        state.destroyNx2ContentOnClose = state.destroyNx2ContentOnClose == null ? true : state.destroyNx2ContentOnClose;

        if (state.appendTo) {
            this._appendedTo = state.appendTo;
            // sync id
            if ( state.appendTo.id == null) {
                state.appendTo.id = state.tagId;
            } else {
                state.tagId = state.appendTo.id;
            }

            decoToHtmlElement(this.state.deco, this._appendedTo); // transfer deco to the anchor element
            if ( this.state?.deco?.tag ) {
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

        ej.width = ej.width || '99%'; // crucial to be set for Nx2EjPanelGridFlex to size correctly (get an initial resize event)
        ej.height = ej.height || '99%'; // crucial to be set for Nx2EjPanelGridFlex to size correctly (get an initial resize event)
        ej.enableResize = ej.enableResize || true;

        ej.cssClass = ej.cssClass || '';
        if (ej.cssClass != '')
            ej.cssClass += ' ';
        ej.cssClass += this.className; // name of the class for css purposes


        // Make a header from either state.header or state.ej.header
        let nx2Header: Nx2 = this._headerNx2();
        ej.header = nx2Header.htmlElement;

        if ( state.content ) {
            ej.content = (state.content instanceof HTMLElement ? state.content : state.content.htmlElement);
        }

        let userOpen = ej.open;
        let userClose = ej.close;

        ej.open = (args: any) => {
            try {
                nx2Header.initLogic(); // initialize header
            } catch (e) {
                this.handleError(e);
            }

            try {
                if (this.state.content) {
                    if (this.state.content instanceof HTMLElement) {
                    } else {
                        // if Nx2, init logic
                        this.state.content.initLogic(); // initialize content
                    }
                }
            } catch (e) {
                this.handleError(e);
            }

            try {
                if (userOpen)
                    userOpen.call(this, args); // any user open code
            } catch (e) {
                this.handleError(e);
            }

            if ( isNx2_Interface_Dialog_Open(this.state.content)) {
                try {
                    this.state.content.onDialogOpen({dialog: this, widget: this.state.content});
                } catch (e) {
                    console.error('Nx2Dialog._headerNx2: error calling onDialogOpen on content', e);
                }
            }


        } // ej.open

        ej.close = (args: any) => {

            if ( isNx2_Interface_Dialog_Close(this.state.content)) {
                try {
                    this.state.content.onDialogClose({dialog: this, widget: this.state.content});
                } catch (e) {
                    console.error('Nx2Dialog._headerNx2: error calling onDialogClose on content', e);
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
                console.error('Nx2Dialog._headerNx2: error destroying Nx2Dialog', e);
            }
        } // ej.close


        super.onStateInitialized(state); // will trigger onDestroy
    } // onStateInitialized

    onDestroy(args: Nx2Evt_Destroy) {
        let state: STATE = this.state;

        try {
            if ( this.state.destroyNx2HeaderOnClose) {
                if (isArray(state.header)) {
                    //traverse state.header array and only push if Nx2
                    for (const element of state.header) {
                        if (isNx2(element)) {
                            try {
                                element.destroy();
                            } catch (e) {
                                console.error('Nx2Dialog._headerNx2: error destroying Nx2 in state.header array', e);
                            }
                        }
                    }
                } else if (isNx2(state.header)) {
                    // single Nx2
                    try {
                        state.header.destroy();
                    } catch (e) {
                        console.error('Nx2Dialog._headerNx2: error destroying Nx2 in state.header', e);
                    }
                }
            }
        } catch (e) {
            console.error('Nx2Dialog._headerNx2: error destroying Nx2 in state.header', e);
        }


        try {
            if ( this.state.destroyNx2ContentOnClose) {
                if (isNx2(this.state.content)) {
                    this.state.content?.destroy();
                }
            }
        } catch (e) {
            console.error('Nx2Dialog._headerNx2: error destroying Nx2 in state.content', e);
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

    onLogic(args: Nx2Evt_OnLogic) {

        if (!this._appendTargetCreatedLocally) {
            this.htmlElement = this._appendedTo; // this is the true html element that will be used by the widget
        }

        super.onLogic(args);

        let ej: DialogModel = this.state.ej;
        this.obj = new Dialog(ej);
        this.obj.appendTo(this._appendedTo);

    }

    show() {
        this.initLogic(); // multiple calls don't have any impact
        this.obj.show();
    }

    hide() {
        this.obj.hide();
    }

    protected _headerNx2(): Nx2 {
        let state = this.state;
        let list: Nx2[] = [];

        // if (!state.headerOptions.hideBackArrow)
        list.push(this._headerBackArrow());

        if (state.header == null)
            state.header = (state.ej.header ? (isHTMLElement(state.ej.header) ? (state.ej.header as HTMLElement) : state.ej.header.toString()) : ''); // if header is not set, use the ej.header value if possible, else default to ''

        if (isString(state.header)) {
            list.push(new Nx2Html({value: state.header}));
        } else if (isHTMLElement(state.header)) {
            list.push(new Nx2Html({value: (state.header as HTMLElement)}));
        } else if (isArray(state.header)) {
            //traverse state.header array and only push if Nx2
            for (const element of state.header) {
                if (isNx2(element)) {
                    list.push(element);
                } else {
                    console.error('Nx2Dialog._headerNx2: state.header contains an element that is not an Nx2');
                }
            }
        } else if (isNx2(state.header)) {
            // single Nx2
            list.push(state.header);
        }

        return new Nx2Row({children: list});

    }

    protected _headerBackArrow(): Nx2DialogBackArrow {
        return new Nx2DialogBackArrow({
            value: null,
            dialog: this,
        });
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
} // Nx2Dialog