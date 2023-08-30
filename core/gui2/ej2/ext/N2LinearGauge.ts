import {LinearGauge, LinearGaugeModel} from '@syncfusion/ej2-lineargauge';
import {Annotations} from '@syncfusion/ej2-lineargauge/src/linear-gauge/annotations/annotations';
import {Gradient} from '@syncfusion/ej2-lineargauge/src/linear-gauge/axes/gradient';
import {ImageExport} from '@syncfusion/ej2-lineargauge/src/linear-gauge/model/image-export';
import {PdfExport} from '@syncfusion/ej2-lineargauge/src/linear-gauge/model/pdf-export';
import {Print} from '@syncfusion/ej2-lineargauge/src/linear-gauge/model/print';
import {GaugeTooltip} from '@syncfusion/ej2-lineargauge/src/linear-gauge/user-interaction/tooltip';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


LinearGauge.Inject(
    Annotations,
    GaugeTooltip,
    Print,
    PdfExport,
    ImageExport,
    Gradient,
);

export interface StateN2LinearGaugeRef extends StateN2EjBasicRef {
    widget?: N2LinearGauge;
}

export interface StateN2LinearGauge<WIDGET_LIBRARY_MODEL extends LinearGaugeModel = LinearGaugeModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2LinearGaugeRef;
}

export class N2LinearGauge<STATE extends StateN2LinearGauge = StateN2LinearGauge> extends N2EjBasic<STATE, LinearGauge> {
    static readonly CLASS_IDENTIFIER: string = 'N2LinearGauge';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2LinearGauge.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }


    createEjObj(): void {
        this.obj = new LinearGauge(this.state.ej);
    }

    get classIdentifier(): string { return N2LinearGauge.CLASS_IDENTIFIER; }


}