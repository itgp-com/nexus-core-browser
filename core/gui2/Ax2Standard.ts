import {Ax2Widget, Ix2Destroy, Ix2OnClear, Ix2OnHtml, Ix2OnLogic, Ix2Refresh} from "./Ax2Widget";
import {StateWx2Panel} from "./ej2/panel/Wx2Panel";
import {Ix2State} from "./Ix2State";
import {createWx2HTMLStandard} from "./Wx2Utils";

export interface StateAx2Standard<WIDGET_TYPE extends Ax2Standard = any> extends Ix2State<WIDGET_TYPE> {
}

export class Ax2Standard<STATE extends Ix2State = StateAx2Standard> extends Ax2Widget<STATE> {

    protected constructor(state: STATE) {
        super(state);
    }

    onHtml(args: Ix2OnHtml): HTMLElement {
        return createWx2HTMLStandard<StateWx2Panel>(this.state);
    }

    onClear(args:Ix2OnClear): void {
    }

    onDestroy(args: Ix2Destroy): void {
    }

    onLogic(args : Ix2OnLogic): void {
    }

    onRefresh(args:Ix2Refresh): void {
    }

}