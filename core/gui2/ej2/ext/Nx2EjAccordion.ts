import {Accordion, AccordionModel} from "@syncfusion/ej2-navigations";
import {Nx2Evt_OnLogic} from "../../Nx2";
import {addNx2Class} from '../../Nx2HtmlDecorator';
import {Nx2EjBasic, StateNx2EjBasic, StateNx2EjBasicRef} from "../Nx2EjBasic";


export interface StateNx2EjAccordionRef extends StateNx2EjBasicRef {
    widget?: Nx2EjAccordion;
}

export interface StateNx2EjAccordion<WIDGET_LIBRARY_MODEL extends AccordionModel = AccordionModel> extends StateNx2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateNx2EjAccordionRef;
}

export class Nx2EjAccordion<STATE extends StateNx2EjAccordion = StateNx2EjAccordion> extends Nx2EjBasic<STATE, Accordion> {
    constructor(state ?: STATE) {
        super(state);
        addNx2Class(this.state.deco, 'Nx2EjAccordion');
    }


    onLogic(args: Nx2Evt_OnLogic) {
        super.onLogic(args);

        this.obj = new Accordion(this.state.ej);
        this.obj.appendTo(this.htmlElementAnchor); // this will initialize the htmlElement if needed
    }
}