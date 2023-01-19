import {StateWx2Html, Wx2Html} from "../../../generic/Wx2Html";
import {css_Wx2Dialog_color_header_background, css_Wx2Dialog_color_header_font, Wx2Dialog} from "../Wx2Dialog";
import {Tooltip} from "@syncfusion/ej2-popups";

export interface StateWx2DialogBackArrow<WIDGET_TYPE extends Wx2DialogBackArrow = Wx2DialogBackArrow> extends StateWx2Html<WIDGET_TYPE> {
    dialog: Wx2Dialog;
}

export class Wx2DialogBackArrow<STATE extends StateWx2DialogBackArrow = any> extends Wx2Html<STATE> {


    constructor(state: STATE) {
        super(state);
    }


    protected _initialSetup(state: STATE) {
        state.staticWidget = true;
        if (state.value == null) {
            state.value = `
<span id="${state.tagId}"  style="margin-right:5px;">
    <button type="button" style="background-color: ${css_Wx2Dialog_color_header_background}">
        <i class="fa fa-arrow-circle-left" style="font-weight:900;font-size:20px;color: ${css_Wx2Dialog_color_header_font} !important;"></i>
    </button>
</span>`;
        }

        super._initialSetup(state);
    }

    onHtml(): HTMLElement {
        let state = this.state;

        let deco = state.deco;
        deco.tag = 'span';
        deco.style = {
            "margin-right": "5px",
        }

        return super.onHtml();
    }


    async onLogic(): Promise<void> {
        this.htmlElement.addEventListener('click', (_ev) => {
            this._action.call(this, _ev);
        });

        await this._tooltip();

    }

    /**
     * Override this method to control the action taken when the back arrow widget defined in header_backArrowWidget() is clicked
     *
     * Note: if the header_backArrowWidget() method is overridden, then this method might not be called by the new widget.
     * @param _ev
     * @protected
     */
    protected async _action(_ev: MouseEvent) {
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