import {Toolbar, ToolbarModel} from '@syncfusion/ej2-navigations';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2ToolbarRef extends StateN2EjBasicRef {
    widget?: N2Toolbar;
}

export interface StateN2Toolbar<WIDGET_LIBRARY_MODEL extends ToolbarModel = ToolbarModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2ToolbarRef;
}

export class N2Toolbar<STATE extends StateN2Toolbar = StateN2Toolbar> extends N2EjBasic<STATE, Toolbar> {
    static readonly CLASS_IDENTIFIER: string = 'N2Toolbar';

    constructor(state ?: STATE) {
        super(state);
    }

    protected onStateInitialized(state: STATE) {
        addN2Class(state.deco,  N2Toolbar.CLASS_IDENTIFIER);
        super.onStateInitialized(state)
    }


    createEjObj(): void {
        this.obj = new Toolbar(this.state.ej);
    }

    get classIdentifier(): string { return N2Toolbar.CLASS_IDENTIFIER; }

}