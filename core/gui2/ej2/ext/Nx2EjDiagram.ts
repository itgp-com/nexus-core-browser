import {Diagram, DiagramModel} from "@syncfusion/ej2-diagrams";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


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


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Diagram(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}