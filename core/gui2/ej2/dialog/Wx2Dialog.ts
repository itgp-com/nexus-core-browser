import {Dialog, DialogModel} from "@syncfusion/ej2-popups";
import {Ax2EjStandard, StateAx2EjStandard} from "../Ax2EjStandard";
import {Wx2DialogBackArrow} from "./util/Wx2DialogBackArrow";
import {Ax2Widget, Ix2Destroy} from "../../Ax2Widget";
import {isArray, isString} from "lodash";
import {Wx2Html} from "../../generic/Wx2Html";
import {Wx2Row} from "../../generic/Wx2Row";
import {isHTMLElement} from "../../../CoreUtils";
import {isAx2Widget} from "../../Wx2Utils";
import {getRandomString} from "../../../BaseUtils";


export interface StateWx2Dialog extends StateAx2EjStandard<Ax2EjStandard, DialogModel> {

    /**
     * Optional header for the dialog. If specified,it will override any setting
     * under ej.header
     */
    header?: string | HTMLElement | Ax2Widget | Ax2Widget[];

    /**
     * The content of the dialog. It will always override ej.content
     */
    content?: Ax2Widget;

    /**
     * Optional tag to append the Dialog to. If not specified, the dialog will be appended to the body
     */
    appendTo?: HTMLElement;
}

/**
 * The color of the back arrow in the header. Overwrite in extending classes
 */
export let css_Wx2Dialog_color_header_font: string = 'white';
export let css_Wx2Dialog_color_header_background: string = 'black';


export class Wx2Dialog<STATE extends StateWx2Dialog = any> extends Ax2EjStandard<STATE> {
    private _appendTargetCreatedLocally: boolean = false;
    appendedTo: HTMLElement;

    constructor(state: STATE) {
        super(state);
    }

    protected _initialSetup(state: STATE) {
        state.ej = state.ej || {};
        if ( state.appendTo){
            this.appendedTo = state.appendTo;
        } else {
            let localAnchorID:string  = getRandomString('anchor_');
            let elem:HTMLDivElement     = document.createElement('div')
            elem.id            = localAnchorID
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

        ej.cssClass = ej.cssClass || '';
        if (ej.cssClass != '')
            ej.cssClass += ' ';
        ej.cssClass += this.className; // name of the class for css purposes


        // Make a header from either state.header or state.ej.header
        let wx2Header: Ax2Widget = this._headerWx2Widget();
        wx2Header.initLogic()
        this.state.ej.header = wx2Header.htmlElement;

        if (this.state.content) {
            this.state.content.initLogic();
            this.state.ej.content = this.state.content.htmlElement;
        }

        this.obj = new Dialog(ej);
        this.obj.appendTo(this.appendedTo);

        super._initialSetup(state);
    } // _initialSetup




    show() {
        this.obj.show();
    }

    hide() {
        this.obj.hide();
    }


    protected _headerWx2Widget(): Ax2Widget {
        let state = this.state;
        let list: Ax2Widget[] = [];

        // if (!state.headerOptions.hideBackArrow)
        list.push(this._headerBackArrow());

        if ( state.header == null)
            state.header = (state.ej.header ? (isHTMLElement(state.ej.header) ? (state.ej.header as HTMLElement) : state.ej.header.toString()) : ''); // if header is not set, use the ej.header value if possible, else default to ''

        if (isString(state.header)) {
            list.push(new Wx2Html({value: state.header}));
        } else if (isHTMLElement(state.header)) {
            list.push(new Wx2Html({value: (state.header as HTMLElement)}));
        } else if (isArray(state.header)) {
            //traverse state.header array and only push if Ax2Widget
            for (const element of state.header) {
                if ( isAx2Widget(element)){
                    list.push(element);
                } else {
                    console.error('Wx2Dialog._headerWx2Widget: state.header contains an element that is not an Ax2Widget');
                }
            }
        } else if (isAx2Widget(state.header)){
            // single Ax2Widget
            list.push(state.header);
        }

        return new Wx2Row({children: list});

    }

    protected _headerBackArrow(): Wx2DialogBackArrow {
        return new Wx2DialogBackArrow({
            value: null,
            dialog: this,
        });
    }


    onDestroy(args: Ix2Destroy) {
        try {
            if (this._appendTargetCreatedLocally) {
                if (this.appendedTo)
                    this.appendedTo.remove();
            }
        } catch (e) {
            console.error(e);
        }
        super.onDestroy(args);
    }
} // wx2Dialog