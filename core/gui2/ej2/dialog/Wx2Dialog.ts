import {DialogModel} from "@syncfusion/ej2-popups";
import {Ax2EjStandard, StateAx2EjStandard} from "../Ax2EjStandard";
import {Wx2DialogBackArrow} from "./util/Wx2DialogBackArrow";
import {Ax2Widget} from "../../Ax2Widget";
import {isArray, isElement, isString} from "lodash";
import {Wx2Html} from "../../generic/Wx2Html";
import {Wx2Row} from "../../generic/Wx2Row";


export interface StateWx2Dialog extends StateAx2EjStandard<Ax2EjStandard, DialogModel> {
    header: string | Ax2Widget | Ax2Widget[];
    content: Ax2Widget;
}

/**
 * The color of the back arrow in the header. Overwrite in extending classes
 */
export let css_Wx2Dialog_color_header_font: string = 'white';
export let css_Wx2Dialog_color_header_background: string = 'black';


export class Wx2Dialog<STATE extends StateWx2Dialog = any> extends Ax2EjStandard<STATE> {


    constructor(state: STATE) {
        super(state);
    }

    protected async _initialSetup(state: STATE) {
        state.header = state.header || '';
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


        let _open = ej.open;
        ej.open = async (e) => {
            await this._open(e);
            try {
                if (_open != null)
                    _open(e);
            } catch (e) {
                this.handleError(e)
            }
        } // ej.open


        super._initialSetup(state);
    }

    protected async _open(e: any) {
        let wx2Header: Ax2Widget = this._headerWx2Widget();
        await wx2Header.initLogic()
        this.state.ej.header = wx2Header.htmlElement;

        if ( this.state.content ) {
            await this.state.content.initLogic();
            this.state.ej.content = this.state.content.htmlElement;
        }


    } // _open


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
            state.header = (state.ej.header ? (isElement(state.ej.header) ? (state.ej.header as HTMLElement).outerHTML : state.ej.header.toString()) : ''); // if header is not set, use the ej.header value if possible, else default to ''

        if (isString(state.header)) {
            list.push(new Wx2Html({value: state.header}));
        } else if (isArray(state.header)) {
            list.push(...state.header);
        } else {
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

} // wx2Dialog