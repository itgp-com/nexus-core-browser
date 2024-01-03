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