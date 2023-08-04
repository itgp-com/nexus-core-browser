import {Diagram, DiagramModel} from "@syncfusion/ej2-diagrams";
import {BlazorTooltip} from '@syncfusion/ej2-diagrams/src/diagram/blazor-tooltip/blazor-Tooltip';
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
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

Diagram.Inject(
    HierarchicalTree, MindMap, RadialTree, ComplexHierarchicalTree, DataBinding, Snapping, PrintAndExport, BlazorTooltip,
    BpmnDiagrams, SymmetricLayout, ConnectorBridging, UndoRedo, LayoutAnimation, DiagramContextMenu, ConnectorEditing,
    LineRouting, LineDistribution
);
export interface StateNx2EjDiagramRef extends StateNx2EjBasicRef {
    widget?: Nx2EjDiagram;
}

export interface StateNx2EjDiagram<WIDGET_LIBRARY_MODEL extends DiagramModel = DiagramModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjDiagramRef;
}

export class Nx2EjDiagram<STATE extends StateNx2EjDiagram = StateNx2EjDiagram> extends Nx2EjBasic<STATE, Diagram> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjDiagram');
    }

    createEjObj(): void {
        this.obj = new Diagram(this.state.ej);
    }



}