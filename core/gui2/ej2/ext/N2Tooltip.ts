import {Tooltip, TooltipModel} from "@syncfusion/ej2-popups";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2TooltipRef extends StateNx2EjBasicRef {
    widget?: N2Tooltip;
}

export interface StateN2Tooltip extends StateNx2EjBasic<TooltipModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2TooltipRef;
} // state class

export class N2Tooltip<STATE extends StateN2Tooltip = StateN2Tooltip> extends Nx2EjBasic<STATE, Tooltip> {
    static readonly CLASS_IDENTIFIER: string = "N2Tooltip";

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2Tooltip.CLASS_IDENTIFIER);
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'span';
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new Tooltip(this.state.ej);
    }

    get classIdentifier(): string { return N2Tooltip.CLASS_IDENTIFIER; }

} // main class