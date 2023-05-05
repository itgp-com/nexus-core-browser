import {TreeView, TreeViewModel} from "@syncfusion/ej2-navigations";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjTreeViewRef extends StateNx2EjBasicRef {
    widget?: Nx2EjTreeView;
}

export interface StateNx2EjTreeView<WIDGET_LIBRARY_MODEL extends TreeViewModel = TreeViewModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjTreeViewRef;
}

export class Nx2EjTreeView<STATE extends StateNx2EjTreeView = StateNx2EjTreeView> extends Nx2EjBasic<STATE, TreeView> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjTreeView');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new TreeView(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}