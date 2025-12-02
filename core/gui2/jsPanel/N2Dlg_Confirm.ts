import {cssAdd} from "../../CssUtils";
import {N2Html} from '../generic/N2Html';
import {N2PanelLayout} from '../generic/N2PanelLayout';
import {N2Row} from "../generic/N2Row";
import {N2} from "../N2";
import {addN2Class} from '../N2HtmlDecorator';
import {CSS_CLASS_N2_ROUNDED_BUTTON} from '../scss/core';
import {N2Dlg} from './N2Dlg';
import {N2Dlg_Modal, StateN2Dlg_Modal, StateN2Dlg_ModalRef} from './N2Dlg_Modal';

export interface StateN2Dlg_ConfirmRef extends StateN2Dlg_ModalRef {
    widget?: N2Dlg_Confirm;
}

export interface StateN2Dlg_Confirm<DATA_TYPE = any> extends StateN2Dlg_Modal<DATA_TYPE> {
    /** Message to display in the confirmation dialog. */
    message?: string | HTMLElement | N2;
    /** Optional title shown in header (overrides options.headerTitle if set) */
    title?: string | HTMLElement | N2;
    /** Label for the affirmative button (default: 'Yes') */
    yesLabel?: string;
    /** Label for the negative button (default: 'No') */
    noLabel?: string;
    /**
     * Called when the user makes a choice. If provided, it will be called before the dialog is destroyed.
     * Return value is ignored; for async usage prefer the static confirm() helper.
     */
    onChoice?: (result: boolean) => void;
    /** Additional CSS classes to apply to the panel container */
    panelClasses?: string | string[];
    /** Additional CSS classes to apply to the message element */
    messageClasses?: string | string[];
    /** Additional CSS classes to apply to the button row */
    buttonRowClasses?: string | string[];
    /** Override with specific type used in code completion */
    ref?: StateN2Dlg_ConfirmRef;
}

export class N2Dlg_Confirm<STATE extends StateN2Dlg_Confirm = StateN2Dlg_Confirm> extends N2Dlg_Modal<STATE> {
    static readonly CLASS_IDENTIFIER: string = 'N2Dlg_Confirm';

    private _resolve?: (value: boolean) => void;

    protected constructor(state?: STATE) {
        super(state as STATE);
        registerThis();
    }

    get classIdentifier(): string {
        return N2Dlg_Confirm.CLASS_IDENTIFIER;
    }

    onStateInitialized(state: STATE): void {
        addN2Class(state.deco, N2Dlg_Confirm.CLASS_IDENTIFIER);

        // Defaults
        state.yesLabel = state.yesLabel ?? 'Yes';
        state.noLabel = state.noLabel ?? 'No';
        state.repositionOnOpen = state.repositionOnOpen ?? true;
        state.options = (state.options || {}) as any;

        // Provide compact modal defaults suitable for a confirm dialog
        const mo = state.options as JsPanelOptionsModal;
        mo.closeOnEscape = mo.closeOnEscape ?? true;
        mo.closeOnBackdrop = mo.closeOnBackdrop ?? true;
        mo.panelSize = mo.panelSize ?? {width: 'auto', height: 'auto'};
        mo.contentSize = mo.contentSize ?? {width: 'auto', height: 'auto'};
        if (state.title != null) {
            if ( state.title instanceof N2 )
                (mo as any).headerTitle = state.title.htmlElement;
            else
                mo.headerTitle = state.title;
        }

        // Build content using N2 components
        const messageElem = this.messageToN2(state.message);
        const yesBtn = new N2Html({
            value: this.wrapButtonLabel(state.yesLabel!),
            deco: {
                classes: CSS_CLASS_N2_ROUNDED_BUTTON
            },
            onClick: () => this.choose(true)
        });
        const noBtn = new N2Html({
            deco: {
                classes: [CSS_CLASS_N2_ROUNDED_BUTTON],
            },
            value: this.wrapButtonLabel(state.noLabel!),
            onClick: () => this.choose(false)
        });

        let panel = new N2PanelLayout({
            deco: {
                 classes: [CSS_CLASS_N2DLG_CONFIRM_PANEL, ...(Array.isArray(state.panelClasses) ? state.panelClasses : (state.panelClasses ? [state.panelClasses] : []))]
            },
            // top: null,
            // left: null,
            // right: null,
            bottom: this.makeButtonsRow(yesBtn, noBtn),
            center: messageElem,
            center_overflow_auto: false,
        });

        state.content = panel; // N2 content

        // If user dismisses via Esc/backdrop/close, treat as No
        const originalOnBeforeClose = mo.onbeforeclose;
        mo.onbeforeclose = (panelObj: JsPanel, status: string) => {
            // If a programmatic close already decided, allow it
            const allow = originalOnBeforeClose ? (Array.isArray(originalOnBeforeClose)
                    ? originalOnBeforeClose.some(fn => fn(panelObj as any, status) === true)
                    : (originalOnBeforeClose(panelObj as any, status) === true))
                : false;
            // If not explicitly allowed and no prior resolution, resolve as false and allow close
            if (this._resolve) {
                // Only resolve if no decision recorded yet; resolve false on user dismiss
                this.choose(false, /*fromUser*/true);
            }
            return true; // Always allow close for confirm dialogs
        };

        super.onStateInitialized(state);
    }

    private messageToN2(message?: string | HTMLElement | N2): N2 | HTMLElement {
        if (message instanceof N2) return message;
        if (message instanceof HTMLElement) return new N2Html({value: message});
        const additionalClasses = Array.isArray(this.state.messageClasses) ? this.state.messageClasses : (this.state.messageClasses ? [this.state.messageClasses] : []);
        return new N2Html({
                deco: {
                    classes: [CSS_CLASS_N2DLG_CONFIRM_MESSAGE, ...additionalClasses]
                },
                value: message ?? ''
            }
        );
    }

    private wrapButtonLabel(label: string): string {
        return `<div style="white-space: nowrap;">${label}</div>`;
    }

    private makeButtonsRow(yesBtn: N2Html, noBtn: N2Html): N2 {
        const additionalClasses = Array.isArray(this.state.buttonRowClasses) ? this.state.buttonRowClasses : (this.state.buttonRowClasses ? [this.state.buttonRowClasses] : []);
        let container: N2Row = new N2Row({
            deco: {
                classes: [CSS_CLASS_N2DLG_CONFIRM_BUTTON_ROW, ...additionalClasses]
            },
            children: [
                yesBtn,
                noBtn
            ]
        });

        return container;
    }

    private choose(result: boolean, fromUser?: boolean) {
        // Call optional callback
        try {
            this.state.onChoice?.(result);
        } catch (e) {
            console.error(e);
        }
        // Resolve promise if used via static helper
        if (this._resolve) {
            const r = this._resolve;
            this._resolve = undefined;
            try {
                r(result);
            } catch (e) {
                console.error(e);
            }
        }
        // Close dialog programmatically (always close)
        this.close(N2Dlg.PROGRAMMATIC_CLOSE_TOKEN);
    }

    static open(message: string | HTMLElement | N2, opts?: {
        title?: string | N2 | HTMLElement,
        yesLabel?: string,
        noLabel?: string,
        panelClasses?: string | string[],
        messageClasses?: string | string[],
        buttonRowClasses?: string | string[],
        options?: Partial<JsPanelOptionsModal>
    }): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            const dlg = new N2Dlg_Confirm({
                title: opts?.title ?? 'Confirm',
                message: message,
                yesLabel: opts?.yesLabel ?? 'Yes',
                noLabel: opts?.noLabel ?? 'No',
                panelClasses: opts?.panelClasses,
                messageClasses: opts?.messageClasses,
                buttonRowClasses: opts?.buttonRowClasses,
                options: {
                    headerControls: {
                        smallify: "remove",
                        maximize: "remove",
                        normalize: "remove",
                        minimize: "remove",
                    },
                    ...(opts?.options as any || {}),
                } as any,
                onChoice: (res) => {
                    // resolve will also be called in choose() but keep for completeness
                }
            } as StateN2Dlg_Confirm as any);
            // Attach resolver
            (dlg as any)._resolve = resolve;
            setTimeout(async () =>  await dlg.show());

        });
    }
}

const CSS_CLASS_N2DLG_CONFIRM_PANEL: string = `n2dlg_confirm_panel`;
const CSS_CLASS_N2DLG_CONFIRM_MESSAGE: string = `n2dlg_confirm_message`;
const CSS_CLASS_N2DLG_CONFIRM_BUTTON_ROW: string = `n2dlg_confirm_button_row`;


let registered = false;

function registerThis() {
    if (registered) return;

    cssAdd(`
    
.${CSS_CLASS_N2DLG_CONFIRM_PANEL} {
    padding: 8px;
}    
.${CSS_CLASS_N2DLG_CONFIRM_MESSAGE}  {  
    padding: 16px;
}

.${CSS_CLASS_N2DLG_CONFIRM_BUTTON_ROW} {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    padding: 8px;
    height: 28px;
}
    
    `);

    registered = true;
} // registerThis