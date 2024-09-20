
export interface StateN2DiagramRef extends StateN2EjBasicRef {
    widget?: N2Diagram;
}

export interface StateN2Diagram<WIDGET_LIBRARY_MODEL extends DiagramModel = DiagramModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2DiagramRef;
}

export class N2Diagram<STATE extends StateN2Diagram = StateN2Diagram> extends N2EjBasic<STATE, Diagram> {
    static readonly CLASS_IDENTIFIER: string = 'N2Diagram'

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2Diagram.CLASS_IDENTIFIER);
        super.onStateInitialized(state);
    }

    createEjObj(): void {
        this.obj = new Diagram(this.state.ej);
    }

    get classIdentifier() { return N2Diagram.CLASS_IDENTIFIER; }


} // N2Diagram

import {Diagram, DiagramModel} from '@syncfusion/ej2-diagrams';
import {DataBinding} from '@syncfusion/ej2-diagrams/src/diagram/data-binding/data-binding';
import {ConnectorEditing} from '@syncfusion/ej2-diagrams/src/diagram/interaction/connector-editing';
import {LineDistribution} from '@syncfusion/ej2-diagrams/src/diagram/interaction/line-distribution';
import {LineRouting} from '@syncfusion/ej2-diagrams/src/diagram/interaction/line-routing';
import {ComplexHierarchicalTree} from '@syncfusion/ej2-diagrams/src/diagram/layout/complex-hierarchical-tree';
import {HierarchicalTree} from '@syncfusion/ej2-diagrams/src/diagram/layout/hierarchical-tree';
import {MindMap} from '@syncfusion/ej2-diagrams/src/diagram/layout/mind-map';
import {RadialTree} from '@syncfusion/ej2-diagrams/src/diagram/layout/radial-tree';
import {SymmetricLayout} from '@syncfusion/ej2-diagrams/src/diagram/layout/symmetrical-layout';
import {BpmnDiagrams} from '@syncfusion/ej2-diagrams/src/diagram/objects/bpmn';
import {ConnectorBridging} from '@syncfusion/ej2-diagrams/src/diagram/objects/connector-bridging';
import {DiagramContextMenu} from '@syncfusion/ej2-diagrams/src/diagram/objects/context-menu';
import {LayoutAnimation} from '@syncfusion/ej2-diagrams/src/diagram/objects/layout-animation';
import {Snapping} from '@syncfusion/ej2-diagrams/src/diagram/objects/snapping';
import {UndoRedo} from '@syncfusion/ej2-diagrams/src/diagram/objects/undo-redo';
import {PrintAndExport} from '@syncfusion/ej2-diagrams/src/diagram/print-settings';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';

Diagram.Inject(
    HierarchicalTree, MindMap, RadialTree, ComplexHierarchicalTree, DataBinding, Snapping, PrintAndExport,
    BpmnDiagrams, SymmetricLayout, ConnectorBridging, UndoRedo, LayoutAnimation, DiagramContextMenu, ConnectorEditing,
    LineRouting, LineDistribution
);