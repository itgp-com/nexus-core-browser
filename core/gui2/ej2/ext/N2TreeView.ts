import {TreeView, TreeViewModel} from "@syncfusion/ej2-navigations";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2TreeViewRef extends StateNx2EjBasicRef {
    widget?: N2TreeView;
}

export interface StateN2TreeView<WIDGET_LIBRARY_MODEL extends TreeViewModel = TreeViewModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2TreeViewRef;
}

export class N2TreeView<STATE extends StateN2TreeView = StateN2TreeView> extends Nx2EjBasic<STATE, TreeView> {
    static readonly CLASS_IDENTIFIER: string = "N2TreeView";

    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2TreeView.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new TreeView(this.state.ej);
    }

    get classIdentifier(): string { return N2TreeView.CLASS_IDENTIFIER; }

}