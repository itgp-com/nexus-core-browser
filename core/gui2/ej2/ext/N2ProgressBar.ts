import {ProgressBar, ProgressBarModel} from '@syncfusion/ej2-progressbar';
import {ProgressAnnotation, ProgressTooltip} from '@syncfusion/ej2-progressbar/src/progressbar/model';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';

ProgressBar.Inject(ProgressAnnotation, ProgressTooltip);

export interface StateN2ProgressBarRef extends StateN2EjBasicRef {
    widget?: N2ProgressBar;
}

export interface StateN2ProgressBar<WIDGET_LIBRARY_MODEL extends ProgressBarModel = ProgressBarModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ProgressBarRef;
}

export class N2ProgressBar<STATE extends StateN2ProgressBar = StateN2ProgressBar> extends N2EjBasic<STATE, ProgressBar> {
    static readonly CLASS_IDENTIFIER: string = 'N2ProgressBar';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2ProgressBar.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }



    createEjObj(): void {
        this.obj = new ProgressBar(this.state.ej);
    }

    get classIdentifier(): string { return N2ProgressBar.CLASS_IDENTIFIER; }

}