import {Chart,ChartConfiguration} from 'chart.js'
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../../ej2/N2EjBasic';
import {addN2Class} from '../../N2HtmlDecorator';



export interface StateN2ChartRef extends StateN2EjBasicRef {
    widget?: N2Chartjs;
}

export interface StateN2Chart<WIDGET_LIBRARY_MODEL extends ChartConfiguration = ChartConfiguration> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ChartRef;
}

export class N2Chartjs<STATE extends StateN2Chart = StateN2Chart> extends N2EjBasic<STATE, Chart> {
    static readonly CLASS_IDENTIFIER: string = 'N2Chartjs';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        state.deco.tag = 'canvas'; // always use a canvas tag
        addN2Class(state.deco,  N2Chartjs.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }

    createEjObj(): void {
        const canvas :HTMLCanvasElement = this.htmlElementAnchor  as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        this.obj = new Chart(ctx,this.state.ej);
    }


    get classIdentifier() { return N2Chartjs.CLASS_IDENTIFIER; }

}