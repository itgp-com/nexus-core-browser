import {Accordion, AccordionModel} from '@syncfusion/ej2-navigations';
import {addN2Class} from '../../N2HtmlDecorator';
import {N2EjBasic, StateN2EjBasic, StateN2EjBasicRef} from '../N2EjBasic';


export interface StateN2AccordionRef extends StateN2EjBasicRef {
    widget?: N2Accordion;
}

export interface StateN2Accordion<WIDGET_LIBRARY_MODEL extends AccordionModel = AccordionModel> extends StateN2EjBasic<WIDGET_LIBRARY_MODEL> {
    /**
     * Override with specific type used in code completion
     * Contains all the fields that have references to this instance and are usually created by the widget initialization code
     */
    ref?: StateN2AccordionRef;
}

export class N2Accordion<STATE extends StateN2Accordion = StateN2Accordion> extends N2EjBasic<STATE, Accordion> {
    static readonly CLASS_IDENTIFIER:string = 'N2Accordion'
    constructor(state ?: STATE) {
        super(state);
        addN2Class(this.state.deco, N2Accordion.CLASS_IDENTIFIER);
    }

    createEjObj(): void {
        this.obj = new Accordion(this.state.ej);
    }

    get classIdentifier() {
        return N2Accordion.CLASS_IDENTIFIER;
    }

}