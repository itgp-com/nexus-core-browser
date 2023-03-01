import {Ix2State} from "../Ix2State";
import {createWx2HTMLStandard} from "../Wx2Utils";
import {Ax2Ej, StateEj} from "./Ax2Ej";
import {Ix2Destroy, Ix2Refresh, Ix2OnClear, Ix2OnHtml, Ix2OnLogic} from "../Ax2Widget";
import {StateWx2Panel} from "./panel/Wx2Panel";

export interface StateAx2EjStandard<WIDGET_TYPE extends Ax2EjStandard = any, WIDGET_LIBRARY_MODEL = any> extends StateEj<WIDGET_TYPE, WIDGET_LIBRARY_MODEL> {
}


export abstract class Ax2EjStandard<STATE extends Ix2State = Ix2State> extends Ax2Ej<STATE> {

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