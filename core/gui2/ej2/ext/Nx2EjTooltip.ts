import {Tooltip, TooltipModel} from "@syncfusion/ej2-popups";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjTooltipRef extends StateNx2EjBasicRef {
    widget?: Nx2EjTooltip;
}

export interface StateNx2EjTooltip extends StateNx2EjBasic<TooltipModel> {

    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjTooltipRef;
} // state class

export class Nx2EjTooltip<STATE extends StateNx2EjTooltip = StateNx2EjTooltip> extends Nx2EjBasic<STATE, Tooltip> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjTooltip');
    }

    onStateInitialized(state: STATE) {
        state.deco.tag = 'span';
        super.onStateInitialized(state);
    }

    protected createEjObj(): void {
        this.obj = new Tooltip(this.state.ej);
    }

    protected appendEjToHtmlElement(): void {
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }

} // main class