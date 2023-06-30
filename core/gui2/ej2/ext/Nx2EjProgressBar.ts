import {ProgressBar, ProgressBarModel} from "@syncfusion/ej2-progressbar";
import {ProgressAnnotation, ProgressTooltip} from '@syncfusion/ej2-progressbar/src/progressbar/model';
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

ProgressBar.Inject(ProgressAnnotation,ProgressTooltip );
export interface StateNx2EjProgressBarRef extends StateNx2EjBasicRef {
    widget?: Nx2EjProgressBar;
}

export interface StateNx2EjProgressBar<WIDGET_LIBRARY_MODEL extends ProgressBarModel = ProgressBarModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjProgressBarRef;
}

export class Nx2EjProgressBar<STATE extends StateNx2EjProgressBar = StateNx2EjProgressBar> extends Nx2EjBasic<STATE, ProgressBar> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjProgressBar');
    }


    protected createEjObj(): void {
        this.obj = new ProgressBar(this.state.ej);
    }

    protected appendEjToHtmlElement(): void {
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }

}