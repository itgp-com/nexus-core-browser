import {Tooltip} from "@syncfusion/ej2-popups";
import {Nx2Html, StateNx2Html, StateNx2HtmlRef} from "../../../generic/Nx2Html";
import {Nx2Evt_OnHtml} from "../../../Nx2";
import {css_Nx2Dialog_color_header_background, css_Nx2Dialog_color_header_font, N2Dialog} from "../N2Dialog";

export interface StateNx2DialogBackArrowRef extends StateNx2HtmlRef{
    widget ?: Nx2DialogBackArrow;
}
export interface StateNx2DialogBackArrow extends StateNx2Html {
    dialog: N2Dialog;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?:StateNx2DialogBackArrowRef;
}

export class Nx2DialogBackArrow<STATE extends StateNx2DialogBackArrow = any> extends Nx2Html<STATE> {


    constructor(state ?: STATE) {
        super(state);
    }


    protected onStateInitialized(state: STATE) {
        // state.staticWidget = true;
        if (state.value == null) {
            state.value = `
<span id="${state.tagId}"  style="margin-right:5px;">
    <button type="button" style="background-color: ${css_Nx2Dialog_color_header_background}">
        <i class="fa fa-arrow-circle-left" style="font-weight:900;font-size:20px;color: ${css_Nx2Dialog_color_header_font} !important;"></i>
    </button>
</span>`;
        }

        super.onStateInitialized(state);
    }

    onHtml(args:Nx2Evt_OnHtml): HTMLElement {
        let state = this.state;

        let deco = state.deco;
        deco.tag = 'span';
        deco.style = {
            "margin-right": "5px",
        }

        return super.onHtml(args);
    }


    onLogic(): void {
        this.htmlElement.addEventListener('click', (_ev) => {
            this._action.call(this, _ev);
        });

        this._tooltip();
    }

    /**
     * Override this method to control the action taken when the back arrow widget defined in header_backArrowWidget() is clicked
     *
     * Note: if the header_backArrowWidget() method is overridden, then this method might not be called by the new widget.
     * @param _ev
     * @protected
     */
    protected _action(_ev: MouseEvent) {
        this.state.dialog.hide(); // close
    } // header_backArrowAction

    protected _tooltip() {
        let htmlElement: HTMLElement = document.getElementById(this.state.tagId);
        if (htmlElement) {
            let tooltip = new Tooltip({
                content: 'Close',
                openDelay: 300,
            });
            tooltip.appendTo(htmlElement);
        }
    } // headerRefreshTooltip


}