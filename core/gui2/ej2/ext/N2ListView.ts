import {ListView, ListViewModel} from "@syncfusion/ej2-lists";
import {Virtualization} from '@syncfusion/ej2-lists/src/list-view/virtualization';
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";

ListView.Inject(Virtualization)

export interface StateN2ListViewRef extends StateNx2EjBasicRef {
    widget?: N2ListView;
}

export interface StateN2ListView<WIDGET_LIBRARY_MODEL extends ListViewModel = ListViewModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ListViewRef;
}

export class N2ListView<STATE extends StateN2ListView = StateN2ListView> extends Nx2EjBasic<STATE, ListView> {
    static readonly CLASS_IDENTIFIER: string = 'N2ListView';

    constructor(state: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2ListView.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new ListView(this.state.ej);
    }

    get classIdentifier(): string { return N2ListView.CLASS_IDENTIFIER; }


}