import {CircularGauge, CircularGaugeModel} from "@syncfusion/ej2-circulargauge";
import {Annotations} from '@syncfusion/ej2-circulargauge/src/circular-gauge/annotations/annotations';
import {Gradient} from '@syncfusion/ej2-circulargauge/src/circular-gauge/axes/gradient';
import {Legend} from '@syncfusion/ej2-circulargauge/src/circular-gauge/legend/legend';
import {ImageExport} from '@syncfusion/ej2-circulargauge/src/circular-gauge/model/image-export';
import {PdfExport} from '@syncfusion/ej2-circulargauge/src/circular-gauge/model/pdf-export';
import {Print} from '@syncfusion/ej2-circulargauge/src/circular-gauge/model/print';
import {GaugeTooltip} from '@syncfusion/ej2-circulargauge/src/circular-gauge/user-interaction/tooltip';
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

CircularGauge.Inject(Annotations, Print, ImageExport, PdfExport,GaugeTooltip,Legend,Gradient);

export interface StateNx2EjCircularGaugeRef extends StateNx2EjBasicRef {
    widget?: Nx2EjCircularGauge;
}

export interface StateNx2EjCircularGauge<WIDGET_LIBRARY_MODEL extends CircularGaugeModel = CircularGaugeModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjCircularGaugeRef;
}

export class Nx2EjCircularGauge<STATE extends StateNx2EjCircularGauge = StateNx2EjCircularGauge> extends Nx2EjBasic<STATE, CircularGauge> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjCircularGauge');
    }

    createEjObj(): void {
        this.obj = new CircularGauge(this.state.ej);
    }



}