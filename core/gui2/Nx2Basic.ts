import {Nx2, Nx2Evt_Destroy, Nx2Evt_OnClear, Nx2Evt_OnHtml, Nx2Evt_OnLogic, Nx2Evt_Refresh} from "./Nx2";
import {StateNx2Panel} from "./generic/Nx2Panel";
import {StateNx2, StateNx2Ref} from "./StateNx2";
import {createNx2HtmlBasic} from "./Nx2Utils";

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

export class Nx2Basic<STATE extends StateNx2 = StateNx2Basic> extends Nx2<STATE> {

    protected constructor(state: STATE) {
        super(state);
    }

    onHtml(args: Nx2Evt_OnHtml): HTMLElement {
        return createNx2HtmlBasic<StateNx2Basic>(this.state);
    }

    onClear(args:Nx2Evt_OnClear): void {
    }

    onDestroy(args: Nx2Evt_Destroy): void {
    }

    onLogic(args : Nx2Evt_OnLogic): void {
    }

    onRefresh(args:Nx2Evt_Refresh): void {
    }

}