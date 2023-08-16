import {Accordion, AccordionModel} from "@syncfusion/ej2-navigations";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateN2AccordionRef extends StateNx2EjBasicRef {
    widget?: N2Accordion;
}

export interface StateN2Accordion<WIDGET_LIBRARY_MODEL extends AccordionModel = AccordionModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2AccordionRef;
}

export class N2Accordion<STATE extends StateN2Accordion = StateN2Accordion> extends Nx2EjBasic<STATE, Accordion> {
    static readonly CLASS_IDENTIFIER:string = "N2Accordion"
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, N2Accordion.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new Accordion(this.state.ej);
    }

    get classIdentifier() {
        return N2Accordion.CLASS_IDENTIFIER;
    }

}