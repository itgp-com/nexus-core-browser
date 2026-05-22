import {N2, N2Evt_Destroy, N2Evt_OnHtml, N2Evt_OnLogic} from "./N2";
import {addN2Class} from './N2HtmlDecorator';
import {createN2HtmlBasic, isN2} from "./N2Utils";
import {StateN2, StateN2Ref} from "./StateN2";

export interface StateN2BasicRef extends StateN2Ref{
    widget ?: N2Basic;
}
export interface StateN2Basic extends StateN2 {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateN2BasicRef;
}

/**
 * Base class for **standalone** (non-EJ2) N2 widgets.
 *
 * Provides default implementations for the three abstract methods from {@link N2}:
 * - `onHtml` — generates a DOM element from the state's N2HtmlDecorator via
 *   {@link createN2HtmlBasic}
 * - `onLogic` — no-op (no JS component to instantiate)
 * - `onDestroy` — destroys all N2 children
 *
 * Use this as the base for layout widgets ({@link N2Row}, {@link N2Panel},
 * {@link N2PanelLayout}), display widgets ({@link N2Html}), or any custom
 * non-Syncfusion component.
 *
 * For Syncfusion-wrapping widgets, use {@link N2EjBasic} instead.
 */
export class N2Basic<STATE extends StateN2Basic = StateN2Basic, JS_COMPONENT = any> extends N2<STATE, JS_COMPONENT> {
    static readonly CLASS_IDENTIFIER: string = 'N2Basic';

    protected constructor(state?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2Basic.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }


    onHtml(args: N2Evt_OnHtml): HTMLElement {
        return createN2HtmlBasic<StateN2Basic>(this.state);
    }

    onLogic(args : N2Evt_OnLogic): void {
    }

    onDestroy(args: N2Evt_Destroy): void {
        if (this.state.children) {
            this.state.children.forEach(child => {
                try {
                    if (child && isN2(child))
                        child.destroy();
                } catch (e) {
                    console.error('Error destroying child', e);
                }
            });
        }
    }

    get classIdentifier(): string { return N2Basic.CLASS_IDENTIFIER; }}