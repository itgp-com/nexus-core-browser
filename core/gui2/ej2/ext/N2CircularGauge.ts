import {CircularGauge, CircularGaugeModel} from '@syncfusion/ej2-circulargauge';
import {Annotations} from '@syncfusion/ej2-circulargauge/src/circular-gauge/annotations/annotations';
import {Gradient} from '@syncfusion/ej2-circulargauge/src/circular-gauge/axes/gradient';
import {Legend} from '@syncfusion/ej2-circulargauge/src/circular-gauge/legend/legend';
import {ImageExport} from '@syncfusion/ej2-circulargauge/src/circular-gauge/model/image-export';
import {PdfExport} from '@syncfusion/ej2-circulargauge/src/circular-gauge/model/pdf-export';
import {Print} from '@syncfusion/ej2-circulargauge/src/circular-gauge/model/print';
import {GaugeTooltip} from '@syncfusion/ej2-circulargauge/src/circular-gauge/user-interaction/tooltip';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';

CircularGauge.Inject(Annotations, Print, ImageExport, PdfExport, GaugeTooltip, Legend, Gradient);

export interface StateN2CircularGaugeRef extends StateN2EjBasicRef {
    widget?: N2CircularGauge;
}

export interface StateN2CircularGauge<WIDGET_LIBRARY_MODEL extends CircularGaugeModel = CircularGaugeModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2CircularGaugeRef;
}

export class N2CircularGauge<STATE extends StateN2CircularGauge = StateN2CircularGauge> extends N2EjBasic<STATE, CircularGauge> {
    static readonly CLASS_IDENTIFIER: string = 'N2CircularGauge'

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2CircularGauge.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }

    createEjObj(): void {
        this.obj = new CircularGauge(this.state.ej);
    }

    get classIdentifier() {
        return N2CircularGauge.CLASS_IDENTIFIER;
    }


}