import {Toolbar, ToolbarModel} from "@syncfusion/ej2-navigations";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjToolbarRef extends StateNx2EjBasicRef {
    widget?: Nx2EjToolbar;
}

export interface StateNx2EjToolbar<WIDGET_LIBRARY_MODEL extends ToolbarModel = ToolbarModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjToolbarRef;
}

export class Nx2EjToolbar<STATE extends StateNx2EjToolbar = StateNx2EjToolbar> extends Nx2EjBasic<STATE, Toolbar> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjToolbar');
    }

    protected createEjObj(): void {
        this.obj = new Toolbar(this.state.ej);
    }

    protected appendEjToHtmlElement(): void {
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }

}