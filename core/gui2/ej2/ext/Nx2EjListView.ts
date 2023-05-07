import {ListView, ListViewModel} from "@syncfusion/ej2-lists";
import {Virtualization} from '@syncfusion/ej2-lists/src/list-view/virtualization';
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

ListView.Inject(Virtualization)
export interface StateNx2EjListViewRef extends StateNx2EjBasicRef {
    widget?: Nx2EjListView;
}

export interface StateNx2EjListView<WIDGET_LIBRARY_MODEL extends ListViewModel = ListViewModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjListViewRef;
}

export class Nx2EjListView<STATE extends StateNx2EjListView = StateNx2EjListView> extends Nx2EjBasic<STATE, ListView> {
    constructor(state: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjListView');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new ListView(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}