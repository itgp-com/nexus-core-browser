import {LinearGauge, LinearGaugeModel} from "@syncfusion/ej2-lineargauge";
import {Annotations} from '@syncfusion/ej2-lineargauge/src/linear-gauge/annotations/annotations';
import {Gradient} from '@syncfusion/ej2-lineargauge/src/linear-gauge/axes/gradient';
import {ImageExport} from '@syncfusion/ej2-lineargauge/src/linear-gauge/model/image-export';
import {PdfExport} from '@syncfusion/ej2-lineargauge/src/linear-gauge/model/pdf-export';
import {Print} from '@syncfusion/ej2-lineargauge/src/linear-gauge/model/print';
import {GaugeTooltip} from '@syncfusion/ej2-lineargauge/src/linear-gauge/user-interaction/tooltip';
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


LinearGauge.Inject(
    Annotations,
    GaugeTooltip,
    Print,
    PdfExport,
    ImageExport,
    Gradient,

);
export interface StateNx2EjLinearGaugeRef extends StateNx2EjBasicRef {
    widget?: Nx2EjLinearGauge;
}

export interface StateNx2EjLinearGauge<WIDGET_LIBRARY_MODEL extends LinearGaugeModel = LinearGaugeModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjLinearGaugeRef;
}

export class Nx2EjLinearGauge<STATE extends StateNx2EjLinearGauge = StateNx2EjLinearGauge> extends Nx2EjBasic<STATE, LinearGauge> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjLinearGauge');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new LinearGauge(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}