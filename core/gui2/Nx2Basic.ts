import {Nx2, Nx2Evt_Destroy, Nx2Evt_OnHtml, Nx2Evt_OnLogic} from "./Nx2";
import {addNx2Class} from './Nx2HtmlDecorator';
import {createNx2HtmlBasic, isNx2} from "./Nx2Utils";
import {StateNx2, StateNx2Ref} from "./StateNx2";

export interface StateNx2BasicRef extends StateNx2Ref{
    widget ?: Nx2Basic;
}
export interface StateNx2Basic extends StateNx2 {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref ?: StateNx2BasicRef;
}

export class Nx2Basic<STATE extends StateNx2Basic = StateNx2Basic> extends Nx2<STATE> {

    protected constructor(state?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2Basic');
    }

    onHtml(args: Nx2Evt_OnHtml): HTMLElement {
        return createNx2HtmlBasic<StateNx2Basic>(this.state);
    }

    onLogic(args : Nx2Evt_OnLogic): void {
    }

    onDestroy(args: Nx2Evt_Destroy): void {
        if (this.state.children) {
            this.state.children.forEach(child => {
                try {
                    if (child && isNx2(child))
                        child.destroy();
                } catch (e) {
                    console.error('Error destroying child', e);
                }
            });
        }
    }

}