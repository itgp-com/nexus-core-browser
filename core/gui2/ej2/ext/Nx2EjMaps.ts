import {Maps, MapsModel} from "@syncfusion/ej2-maps";
import {DataLabel} from '@syncfusion/ej2-maps/src/maps';
import {Bubble} from '@syncfusion/ej2-maps/src/maps/layers/bubble';
import {Legend} from '@syncfusion/ej2-maps/src/maps/layers/legend';
import {Marker} from '@syncfusion/ej2-maps/src/maps/layers/marker';
import {NavigationLine} from '@syncfusion/ej2-maps/src/maps/layers/navigation-selected-line';
import {ImageExport} from '@syncfusion/ej2-maps/src/maps/model/export-image';
import {PdfExport} from '@syncfusion/ej2-maps/src/maps/model/export-pdf';
import {Print} from '@syncfusion/ej2-maps/src/maps/model/print';
import {Annotations} from '@syncfusion/ej2-maps/src/maps/user-interaction/annotation';
import {Highlight} from '@syncfusion/ej2-maps/src/maps/user-interaction/highlight';
import {Selection} from '@syncfusion/ej2-maps/src/maps/user-interaction/selection';
import {MapsTooltip} from '@syncfusion/ej2-maps/src/maps/user-interaction/tooltip';
import {Zoom} from '@syncfusion/ej2-maps/src/maps/user-interaction/zoom';
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

Maps.Inject(
    Annotations,
    Bubble,
    DataLabel,
    Highlight,
    ImageExport,
    Legend,
    MapsTooltip,
    Marker,
    NavigationLine,
    PdfExport,
    Print,
    Selection,
    Zoom,
    );
export interface StateNx2EjMapsRef extends StateNx2EjBasicRef {
    widget?: Nx2EjMaps;
}

export interface StateNx2EjMaps<WIDGET_LIBRARY_MODEL extends MapsModel = MapsModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjMapsRef;
}

export class Nx2EjMaps<STATE extends StateNx2EjMaps = StateNx2EjMaps> extends Nx2EjBasic<STATE, Maps> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjMaps');
    }

    protected createEjObj(): void {
        this.obj = new Maps(this.state.ej);
    }

    protected appendEjToHtmlElement(): void {
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }

}