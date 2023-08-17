import {Tooltip} from '@syncfusion/ej2-popups';
import {N2Html, StateN2Html, StateN2HtmlRef} from '../../../generic/N2Html';
import {N2Evt_OnHtml} from '../../../N2';
import {css_N2Dialog_color_header_background, css_N2Dialog_color_header_font, N2Dialog} from '../N2Dialog';

export interface StateN2DialogBackArrowRef extends StateN2HtmlRef{
    widget ?: N2DialogBackArrow;
}
export interface StateN2DialogBackArrow extends StateN2Html {
    dialog: N2Dialog;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?:StateN2DialogBackArrowRef;
}

export class N2DialogBackArrow<STATE extends StateN2DialogBackArrow = any> extends N2Html<STATE> {


    constructor(state ?: STATE) {
        super(state);
    }


    protected onStateInitialized(state: STATE) {
        // state.staticWidget = true;
        if (state.value == null) {
            state.value = `
<span id='${state.tagId}'  style='margin-right:5px;'>
    <button type='button' style='background-color: ${css_N2Dialog_color_header_background}'>
        <i class='fa fa-arrow-circle-left' style='font-weight:900;font-size:20px;color: ${css_N2Dialog_color_header_font} !important;'></i>
    </button>
</span>`;
        }

        super.onStateInitialized(state);
    }

    onHtml(args:N2Evt_OnHtml): HTMLElement {
        let state = this.state;

        let deco = state.deco;
        deco.tag = 'span';
        deco.style = {
            'margin-right': '5px',
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