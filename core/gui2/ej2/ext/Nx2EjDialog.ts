import {Dialog, DialogModel} from "@syncfusion/ej2-popups";
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";
import {Nx2DialogBackArrow} from "./util/Nx2DialogBackArrow";
import {Nx2, Nx2Evt_Destroy, Nx2Evt_OnLogic} from "../../Nx2";
import {isArray, isString} from "lodash";
import {Nx2Html} from "../../generic/Nx2Html";
import {Nx2Row} from "../../generic/Nx2Row";
import {isHTMLElement} from "../../../CoreUtils";
import {isNx2} from "../../Nx2Utils";
import {getRandomString} from "../../../BaseUtils";


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
    content?: Nx2;

    /**
     * Optional tag to append the Dialog to. If not specified, the dialog will be appended to the body
     */
    appendTo?: HTMLElement;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjDialogRef;
}

/**
 * The color of the back arrow in the header. Overwrite in extending classes
 */
export let css_Nx2Dialog_color_header_font: string = 'white';
export let css_Nx2Dialog_color_header_background: string = 'black';


export class Nx2EjDialog<STATE extends StateNx2EjDialog = any> extends Nx2EjBasic<STATE> {
    appendedTo: HTMLElement;
    private _appendTargetCreatedLocally: boolean;

    constructor(state: STATE) {
        super(state);
    }

    protected _initialSetup(state: STATE) {
        state.ej = state.ej || {};
        if (state.appendTo) {
            this.appendedTo = state.appendTo;
        } else {
            let localAnchorID: string = getRandomString('anchor_');
            let elem: HTMLDivElement = document.createElement('div')
            elem.id = localAnchorID
            document.body.appendChild(elem);
            this.appendedTo = elem;
            this._appendTargetCreatedLocally = true;
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

        ej.width = ej.width || '99%'; // crucial to be set for Nx2EjPanelGrid to size correctly (get an initial resize event)
        ej.height = ej.height || '99%'; // crucial to be set for Nx2EjPanelGrid to size correctly (get an initial resize event)
        ej.enableResize = ej.enableResize || true;

        ej.cssClass = ej.cssClass || '';
        if (ej.cssClass != '')
            ej.cssClass += ' ';
        ej.cssClass += this.className; // name of the class for css purposes


        // Make a header from either state.header or state.ej.header
        let nx2Header: Nx2 = this._headerNx2();
        ej.header = nx2Header.htmlElement;

        ej.content = state.content ? state.content.htmlElement : undefined;

        let userOpen = ej.open;
        // let userBeforeOpen = ej.beforeOpen;
        let userClose = ej.close;
        // let userBeforeClose = ej.beforeClose;

        ej.open = (args: any) => {
            try {
                nx2Header.initLogic();
            } catch (e) {
                this.handleError(e);
            }

            try {
                if (this.state.content) {
                    this.state.content.initLogic();
                    // this.state.ej.content = this.state.content.htmlElement;
                }
            } catch (e) {
                this.handleError(e);
            }

            try {
                if (userOpen)
                    userOpen.call(this, args);
            } catch (e) {
                this.handleError(e);
            }


        } // ej.open

        ej.close = (args: any) => {
            try {
                if (userClose)
                    userClose.call(this, args);
            } catch (e) {
                this.handleError(e);
            }

            try {
                this.state.content?.destroy();
                this.destroy();
            } catch (e) {
                this.handleError(e);
            }
        } // ej.close


        super._initialSetup(state);
    } // _initialSetup


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        let ej: DialogModel = this.state.ej;
        this.obj = new Dialog(ej);
        this.obj.appendTo(this.appendedTo);
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


    onDestroy(args: Nx2Evt_Destroy) {

        try {
            this.obj.destroy();
        } catch (e) {
            console.error(e);
        }

        try {
            if (this._appendTargetCreatedLocally) {
                if (this.appendedTo) {
                    this.appendedTo.parentElement.removeChild(this.appendedTo);
                }
            }

        } catch (e) {
            console.error(e);
        }

        super.onDestroy(args);
    }
} // Nx2Dialog