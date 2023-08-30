import {Maps, MapsModel} from '@syncfusion/ej2-maps';
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
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';

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

export interface StateN2MapsRef extends StateN2EjBasicRef {
    widget?: N2Maps;
}

export interface StateN2Maps<WIDGET_LIBRARY_MODEL extends MapsModel = MapsModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2MapsRef;
}

export class N2Maps<STATE extends StateN2Maps = StateN2Maps> extends N2EjBasic<STATE, Maps> {
    static readonly CLASS_IDENTIFIER: string = 'N2Maps';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2Maps.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }


    createEjObj(): void {
        this.obj = new Maps(this.state.ej);
    }

    get classIdentifier(): string { return N2Maps.CLASS_IDENTIFIER; }

}