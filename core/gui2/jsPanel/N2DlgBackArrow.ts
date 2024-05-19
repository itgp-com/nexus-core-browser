import {Tooltip} from '@syncfusion/ej2-popups';
import {N2Html, StateN2Html, StateN2HtmlRef} from '../generic/N2Html';
import {N2Evt_OnHtml} from '../N2';
import {addN2Class} from '../N2HtmlDecorator';
import {N2Dlg} from './N2Dlg';

export interface StateN2DlgBackArrowRef extends StateN2HtmlRef{
    widget ?: N2DlgBackArrow;
}
export interface StateN2DlgBackArrow extends StateN2Html {
    dialog: N2Dlg;

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?:StateN2DlgBackArrowRef;
}

export class N2DlgBackArrow<STATE extends StateN2DlgBackArrow = any> extends N2Html<STATE> {
    static readonly CLASS_IDENTIFIER: string = 'N2DlgBackArrow';


    constructor(state ?: STATE) {
        super(state);
    }


    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco, N2DlgBackArrow.CLASS_IDENTIFIER);
        // state.staticWidget = true;
        if (state.value == null) {
            state.value = `
<span style='margin-right:5px;'>
        <i class='fa fa-arrow-circle-left' style='font-weight:900;font-size:20px;color: var(--app-dialog-header-font-color) !important;'></i>
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
            'cursor': 'pointer',
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
        this.state.dialog.close(); // close
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